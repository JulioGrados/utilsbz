'use strict'

/**
 * Validación de registro e inicio de sesión.
 *
 * La MISMA función corre en el navegador (crmbz, para pintar el error bajo cada
 * campo antes de enviar) y en el servidor (apibz, que es quien manda). Por eso
 * este archivo es puro: sin `config`, sin red, sin Node-only.
 *
 * Cada validador devuelve:
 *   { valid, errors: { campo: 'mensaje' }, values: { ...normalizados } }
 *
 * `values` es lo que hay que guardar: email en minúsculas, teléfono en dígitos,
 * nombre sin espacios dobles, etc. El servidor nunca usa el body crudo.
 */

const LIMITS = {
  nameMin: 2,
  nameMax: 80,
  emailMax: 254,
  passwordMin: 8,
  // bcrypt ignora todo lo que pase de 72 bytes: dos contraseñas que solo
  // difieren después del 72 serían la misma. Se corta antes.
  passwordMax: 72,
  codeLength: 6
}

const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/
// Letras de cualquier idioma, espacios, apóstrofo, guion y punto (J. Pérez, O'Neil).
// Los regex con \p{…} se construyen con new RegExp (no como literal): el
// babel de webpack 4 (dashbz) no sabe compilar el literal y tumba el build;
// en tiempo de ejecución todos los navegadores y Node los soportan.
const NAME_RE = new RegExp("^[\\p{L}\\p{M}][\\p{L}\\p{M}'’.\\- ]*$", 'u')
const HAS_LETTER_RE = new RegExp('\\p{L}', 'u')

const collapse = value => String(value == null ? '' : value).replace(/\s+/g, ' ').trim()

const normalizeEmail = value => String(value == null ? '' : value).trim().toLowerCase()

const validateFullName = value => {
  const name = collapse(value)
  if (!name) return { error: 'Ingresa tu nombre completo.' }
  if (name.length < LIMITS.nameMin) return { error: 'El nombre es demasiado corto.' }
  if (name.length > LIMITS.nameMax) return { error: `Máximo ${LIMITS.nameMax} caracteres.` }
  if (!NAME_RE.test(name)) return { error: 'Usa solo letras, espacios, guion o apóstrofo.' }
  const [firstName, ...rest] = name.split(' ')
  return { value: { names: name, firstName, lastName: rest.join(' ') } }
}

const validateEmail = value => {
  const email = normalizeEmail(value)
  if (!email) return { error: 'Ingresa tu correo electrónico.' }
  if (email.length > LIMITS.emailMax || !EMAIL_RE.test(email)) {
    return { error: 'Ingresa un correo válido (ej. tucorreo@empresa.com).' }
  }
  return { value: email }
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
 * Registro. Campos: fullName, email, password, acceptTerms.
 * `values` sale aplanado con lo que espera el modelo User.
 */
const validateSignup = (data = {}) => {
  const result = collect({
    fullName: validateFullName(data.fullName),
    email: validateEmail(data.email),
    password: validateNewPassword(data.password),
    acceptTerms: data.acceptTerms === true || data.acceptTerms === 'true'
      ? { value: true }
      : { error: 'Debes aceptar los Términos y la Política de Privacidad.' }
  })
  if (!result.valid) return result
  const { fullName, ...rest } = result.values
  return { ...result, values: { ...rest, ...fullName } }
}

/**
 * Código de verificación del correo. Se aceptan espacios o guiones al pegarlo
 * ("123 456"): se comparan solo los dígitos.
 */
const validateVerificationCode = (data = {}) => {
  const code = String(data.code || '').replace(/[\s-]/g, '')
  return collect({
    code: !code
      ? { error: 'Ingresa el código que te enviamos.' }
      : new RegExp(`^\\d{${LIMITS.codeLength}}$`).test(code)
        ? { value: code }
        : { error: `El código tiene ${LIMITS.codeLength} dígitos.` }
  })
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
  validateFullName,
  validateEmail,
  validateNewPassword,
  validateSignup,
  validateVerificationCode,
  validateLogin
}
