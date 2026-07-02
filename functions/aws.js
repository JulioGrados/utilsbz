const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");

dotenv.config();

// Si SPACES_ENDPOINT está definido usamos DigitalOcean Spaces; si no, AWS S3 (comportamiento anterior).
// Esto permite un corte 100% controlado: sin las envs de Spaces, todo sigue funcionando igual con S3.
const useSpaces = !!process.env.SPACES_ENDPOINT;

const bucketName = useSpaces ? process.env.SPACES_BUCKET : process.env.AWS_BUCKET_NAME;
const region = useSpaces
    ? (process.env.SPACES_REGION || 'us-east-1')
    : (process.env.AWS_BUCKET_REGION || 'us-east-2');
const accessKeyId = useSpaces ? process.env.SPACES_KEY : process.env.AWS_PUBLICK_KEY;
const secretAccessKey = useSpaces ? process.env.SPACES_SECRET : process.env.AWS_SECRET_KEY;

// ACL público solo en Spaces (los objetos deben ser legibles por URL). AWS conserva su comportamiento actual.
const objectAcl = useSpaces ? 'public-read' : undefined;

// URL pública base para armar los enlaces (Mongo / proveedores WhatsApp). Fallback: bucket S3 actual.
const FILE_PUBLIC_BASE_URL = process.env.FILE_PUBLIC_BASE_URL
    || `https://${process.env.AWS_BUCKET_NAME || 'bizeus-test'}.s3.${process.env.AWS_BUCKET_REGION || 'us-east-2'}.amazonaws.com`;

const clientConfig = {
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
    maxAttempts: 5,
    retryMode: "adaptive",
    retryDelayOptions: {
        base: 100
    }
};

if (useSpaces) {
    clientConfig.endpoint = process.env.SPACES_ENDPOINT;
    clientConfig.forcePathStyle = false;
}

const client = new S3Client(clientConfig);

// Construye la URL pública de un archivo a partir de su ruta (base + ruta, tal cual se hacía inline).
const filePublicUrl = (path) => `${FILE_PUBLIC_BASE_URL}${path || ''}`;

function formatFileName(fileName) {
    if(fileName.startsWith('/')) fileName = fileName.substring(1);
    return fileName;
}

const saveFileAws = async (file, route) => {
    console.log("aws")
    const cleanName = file.name.toLowerCase()
        .replace(/\s+/g, '_')           // Reemplaza espacios con guiones bajos
        .replace(/[^a-z0-9._-]/g, '')   // Elimina caracteres especiales, mantiene solo alfanuméricos, puntos, guiones bajos y guiones
        .replace(/_{2,}/g, '_')         // Reemplaza múltiples guiones bajos con uno solo
        .replace(/^_+|_+$/g, '');       // Elimina guiones bajos al inicio y final
    const fileroot = route + '/' + file.md5 + '-' + cleanName;
    const params = {
        Bucket: bucketName,
        Key: formatFileName(fileroot),
        Body: file.data,
        ContentType: file.mimetype || 'application/octet-stream',
        ACL: objectAcl
    };
    try {
      const data = await client.send(new PutObjectCommand(params));
      console.log("Archivo subido exitosamente:", data);
      console.log("fileroot", fileroot);
      return fileroot;
    } catch (error) {
      console.error('Error al guardar el archivo:', error);
      throw error;
    }
};

const saveFileHookAws = async (file, route) => {
    console.log("aws")
    // const cleanName = file.name.toLowerCase().replace(/\s/g, '');
    // const fileroot = route + '/' + file.md5 + '-' + cleanName;
    const params = {
        Bucket: bucketName,
        Key: formatFileName(route),
        Body: file,
        ACL: objectAcl
    };
    try {
      const data = await client.send(new PutObjectCommand(params));
      console.log("Archivo subido exitosamente:", data);
      console.log("route", route);
      return '/' + route;
    } catch (error) {
      console.error('Error al guardar el archivo:', error);
      throw error;
    }
};
  
const deleteFileAws = async (fileroot) => {
      const fileName = formatFileName(fileroot);
      const params = {
        Bucket: bucketName,
        Key: fileName,
    };
      try {
          const deleteResponse = await client.send(new DeleteObjectCommand(params));
          console.log('Archivo eliminado con éxito:', deleteResponse);
          return fileroot;
      } catch (error) {
          console.error('Error al eliminar el archivo:', error);
          throw error;
      }
  }
  
  module.exports = {
      saveFileAws,
      saveFileHookAws,
      deleteFileAws,
      filePublicUrl,
      FILE_PUBLIC_BASE_URL
  }