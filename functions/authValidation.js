'use strict'

/**
 * Validación de registro e inicio de sesión.
 *
 * La MISMA función corre en el navegador (crmbz, para pintar el error bajo cada
 * campo antes de enviar) y en el servidor (apibz, que es quien manda). Por eso
 * este archivo es puro: sin `config`, sin red, sin Node-only. Solo depende de la
 * tabla de países.
 *
 * Cada validador devuelve:
 *   { valid, errors: { campo: 'mensaje' }, values: { ...normalizados } }
 *
 * `values` es lo que hay que guardar: email en minúsculas, teléfono en dígitos,
 * nombre sin espacios dobles, etc. El servidor nunca usa el body crudo.
 */

const { countriesData } = require('./countries')

const LIMITS = {
  nameMin: 2,
  nameMax: 80,
  companyMin: 2,
  companyMax: 80,
  emailMax: 254,
  passwordMin: 8,
  // bcrypt ignora todo lo que pase de 72 bytes: dos contraseñas que solo
  // difieren después del 72 serían la misma. Se corta antes.
  passwordMax: 72,
  phoneMin: 8,  // dígitos totales con código de país
  phoneMax: 15  // E.164
}

const DEFAULT_COUNTRY = 'PE'

// Para códigos compartidos (+1, +7) se elige el país más probable.
const PREFERRED_FOR_CODE = { 1: 'US', 7: 'RU' }

const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/
// Letras de cualquier idioma, espacios, apóstrofo, guion y punto (J. Pérez, O'Neil).
// Los regex con \p{…} se construyen con new RegExp (no como literal): el
// babel de webpack 4 (dashbz) no sabe compilar el literal y tumba el build;
// en tiempo de ejecución todos los navegadores y Node los soportan.
const NAME_RE = new RegExp("^[\\p{L}\\p{M}][\\p{L}\\p{M}'’.\\- ]*$", 'u')
const HAS_ALNUM_RE = new RegExp('[\\p{L}\\p{N}]', 'u')
const HAS_LETTER_RE = new RegExp('\\p{L}', 'u')

const collapse = value => String(value == null ? '' : value).replace(/\s+/g, ' ').trim()

const normalizeEmail = value => String(value == null ? '' : value).trim().toLowerCase()

const findCountryByCode = code => countriesData.find(c => c.code === code)

/**
 * Separa un teléfono internacional en código de país y número.
 * Acepta "+51 980 654 016", "0051980654016", "980654016" (asume Perú).
 * Devuelve null si no se puede identificar el país.
 */
const parsePhone = raw => {
  const input = String(raw == null ? '' : raw).trim()
  if (!input) return null
  // Solo se admiten dígitos y separadores habituales.
  if (!/^[+\d\s().-]+$/.test(input)) return { invalidChars: true }

  let digits = input.replace(/\D/g, '')
  const international = input.startsWith('+') || digits.startsWith('00')
  if (digits.startsWith('00')) digits = digits.slice(2)

  if (!international) {
    const country = findCountryByCode(DEFAULT_COUNTRY)
    // Quien escribe su número local (980654016) en Perú no debería tener que
    // saberse el +51.
    if (digits.startsWith(country.callingCode) && digits.length > 9) {
      return { country, callingCode: country.callingCode, national: digits.slice(country.callingCode.length) }
    }
    return { country, callingCode: country.callingCode, national: digits }
  }

  // Prefijo más largo que coincida (1809 antes que 1).
  let best = null
  for (const c of countriesData) {
    if (!c.callingCode || !digits.startsWith(c.callingCode)) continue
    if (!best || c.callingCode.length > best.callingCode.length) {
      best = c
    } else if (
      c.callingCode.length === best.callingCode.length &&
      PREFERRED_FOR_CODE[c.callingCode] === c.code
    ) {
      best = c
    }
  }
  if (!best) return null
  return { country: best, callingCode: best.callingCode, national: digits.slice(best.callingCode.length) }
}

const validateFullName = value => {
  const name = collapse(value)
  if (!name) return { error: 'Ingresa tu nombre completo.' }
  if (name.length < LIMITS.nameMin) return { error: 'El nombre es demasiado corto.' }
  if (name.length > LIMITS.nameMax) return { error: `Máximo ${LIMITS.nameMax} caracteres.` }
  if (!NAME_RE.test(name)) return { error: 'Usa solo letras, espacios, guion o apóstrofo.' }
  const [firstName, ...rest] = name.split(' ')
  return { value: { names: name, firstName, lastName: rest.join(' ') } }
}

const validateCompany = value => {
  const company = collapse(value)
  if (!company) return { error: 'Ingresa el nombre de tu empresa.' }
  if (company.length < LIMITS.companyMin) return { error: 'El nombre de la empresa es demasiado corto.' }
  if (company.length > LIMITS.companyMax) return { error: `Máximo ${LIMITS.companyMax} caracteres.` }
  if (!HAS_ALNUM_RE.test(company)) return { error: 'El nombre de la empresa no es válido.' }
  return { value: company }
}

const validateEmail = value => {
  const email = normalizeEmail(value)
  if (!email) return { error: 'Ingresa tu correo electrónico.' }
  if (email.length > LIMITS.emailMax || !EMAIL_RE.test(email)) {
    return { error: 'Ingresa un correo válido (ej. tucorreo@empresa.com).' }
  }
  return { value: email }
}

const validatePhone = value => {
  const parsed = parsePhone(value)
  if (!parsed) {
    return { error: String(value || '').trim() ? 'No reconocemos el código de país. Empieza con +, ej. +51.' : 'Ingresa tu número de WhatsApp.' }
  }
  if (parsed.invalidChars) return { error: 'El teléfono solo puede tener números, espacios y +.' }
  const total = parsed.callingCode.length + parsed.national.length
  if (parsed.national.length < 6 || total < LIMITS.phoneMin) return { error: 'El número es demasiado corto.' }
  if (total > LIMITS.phoneMax) return { error: 'El número es demasiado largo.' }
  return {
    value: {
      // Mismo formato que ya usa la base: dígitos con código de país, sin "+".
      mobile: parsed.callingCode + parsed.national,
      mobileCode: Number(parsed.callingCode),
      country: parsed.country.name,
      language: parsed.country.language || 'Español'
    }
  }
}

/**
 * Reglas de la contraseña nueva, en el orden en que se le piden al usuario.
 * Se exporta para que el formulario pueda pintar el checklist en vivo.
 */
const PASSWORD_RULES = [
  { id: 'length', label: `Mínimo ${LIMITS.passwordMin} caracteres`, test: p => p.length >= LIMITS.passwordMin },
  { id: 'letter', label: 'Al menos una letra', test: p => HAS_LETTER_RE.test(p) },
  { id: 'number', label: 'Al menos un número', test: p => /\d/.test(p) }
]

const validateNewPassword = value => {
  const password = typeof value === 'string' ? value : ''
  if (!password) return { error: 'Crea una contraseña.' }
  if (password.length > LIMITS.passwordMax) return { error: `Máximo ${LIMITS.passwordMax} caracteres.` }
  if (!password.trim()) return { error: 'La contraseña no puede ser solo espacios.' }
  const failed = PASSWORD_RULES.find(rule => !rule.test(password))
  if (failed) return { error: `La contraseña necesita: ${failed.label.toLowerCase()}.` }
  return { value: password }
}

const collect = checks => {
  const errors = {}
  const values = {}
  Object.keys(checks).forEach(field => {
    const result = checks[field]
    if (result.error) errors[field] = result.error
    else values[field] = result.value
  })
  return { valid: Object.keys(errors).length === 0, errors, values }
}

/**
 * Registro. Campos: fullName, company, email, phone, password, acceptTerms.
 * `values` sale aplanado con lo que espera el modelo User.
 */
const validateSignup = (data = {}) => {
  const result = collect({
    fullName: validateFullName(data.fullName),
    company: validateCompany(data.company),
    email: validateEmail(data.email),
    phone: validatePhone(data.phone),
    password: validateNewPassword(data.password),
    acceptTerms: data.acceptTerms === true || data.acceptTerms === 'true'
      ? { value: true }
      : { error: 'Debes aceptar los Términos y la Política de Privacidad.' }
  })
  if (!result.valid) return result
  const { fullName, phone, ...rest } = result.values
  return { ...result, values: { ...rest, ...fullName, ...phone } }
}

/**
 * Inicio de sesión. A propósito NO se aplican las reglas de contraseña nueva:
 * hay cuentas antiguas con contraseñas que no las cumplen y deben poder entrar.
 */
const validateLogin = (data = {}) => {
  const password = typeof data.password === 'string' ? data.password : ''
  return collect({
    email: validateEmail(data.email),
    password: !password
      ? { error: 'Ingresa tu contraseña.' }
      : password.length > LIMITS.passwordMax
        ? { error: 'Los datos de acceso son incorrectos.' }
        : { value: password }
  })
}

module.exports = {
  LIMITS,
  PASSWORD_RULES,
  normalizeEmail,
  parsePhone,
  validateFullName,
  validateCompany,
  validateEmail,
  validatePhone,
  validateNewPassword,
  validateSignup,
  validateLogin
}
