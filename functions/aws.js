const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_PUBLICK_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const client = new S3Client({
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
});

function formatFileName(fileName) {
    if(fileName.startsWith('/')) fileName = fileName.substring(1);
    return fileName;
}

const saveFileAws = async (file, route) => {
    console.log("aws")
    const cleanName = file.name.toLowerCase().replace(/\s/g, '');
    const fileroot = route + '/' + file.md5 + '-' + cleanName;
    const params = {
        Bucket: bucketName,
        Key: formatFileName(fileroot),
        Body: file.data,
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
      deleteFileAws
  }