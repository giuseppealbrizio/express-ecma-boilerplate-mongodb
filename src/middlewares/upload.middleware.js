import multer from 'multer';
import slugify from 'slugify';
import MulterGoogleCloudStorage from 'multer-cloud-storage';

/**
 * This is the default middleware for uploading
 * files. The memoryStore is used to obtain
 * a buffer in request a file
 * @type {Multer}
 */
export const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 30 * 1024 * 1024, // no larger than 30mb
  },
});

/**
 * You can define the path to keyFilename if you don't want
 * to use .env variable
 * @type {string}
 */
// import path from 'path';
// const keyFilenamePath = path.resolve(
//   path.join(
//     __dirname,
//     './../config/gcloud/google-application-credentials.json',
//   ),
// );

/**
 * Multer to GCS middleware.
 * Follow the README.md instructions at .src/config/gcloud/README.md
 * and create a bucket in GCP and generate a JSON file
 * otherwise this middleware will not work
 * @type {Multer}
 */
export const multerGCSUpload = multer({
  storage: new MulterGoogleCloudStorage({
    acl: 'publicRead',
    autoRetry: true,
    bucket: process.env.GOOGLE_STORAGE_BUCKET_NAME, //bucket name
    destination: 'main_upload_folder/', //folder destination in gcs
    projectId: process.env.GOOGLE_PROJECT_ID, //gcp project id
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, //path to JSON
    filename: (req, file, cb) => {
      cb(null, slugify(file.originalname));
    },
  }),
});
