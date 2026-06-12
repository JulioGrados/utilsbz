# utilsbz — Utilidades compartidas

Helpers reutilizables (sin estado de negocio). `package.json` name: `utils`. Lo consumen `apibz`/`crmbz`/`dashbz` como dependencia git privada.

> **Antes de escribir un helper nuevo (AWS, WhatsApp API, encriptación, parseo de archivos), busca aquí primero.** Probablemente ya exista.

## Estructura

| Carpeta | Qué hay |
|---------|---------|
| `functions/` | Helpers de dominio: `aws.js` (S3: `saveFileAws`, `saveFileHookAws`, `deleteFileAws`), `wahaApi.js` (cliente WAHA con retry), `cloudapi/getMedia.js` (cliente Cloud API), `encryption.js`, parsers (CSV…) |
| `api/` | Helpers de cliente HTTP / wrappers de API |
| `files/` | Utilidades de manejo de archivos |
| `lib/` | Utilidades base |

## Referencias cruzadas

- WAHA (`functions/wahaApi.js`) → `../docs/integraciones/whatsapp-waha.md`
- Cloud API (`functions/cloudapi/getMedia.js`) → `../docs/integraciones/whatsapp-cloudapi.md`
- S3 (`functions/aws.js`) → `../docs/integraciones/aws-s3.md`

## Convenciones

- Funciones puras/sin acoplar a Express o a un modelo concreto.
- Si añades un helper de integración externa, enlaza el doc correspondiente en `../docs/integraciones/`.
