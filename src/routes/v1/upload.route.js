import express from 'express';
import uploadController from '../../controllers/upload.controller';
import {
  multerGCSUpload,
  multerUpload,
} from '../../middlewares/upload.middleware';
import authentication from '../../middlewares/authenticate.middleware';
import catchAsync from '../../middlewares/catchAsync.middleware';

const { authenticate } = authentication;

const {
  testUploadSingleFile,
  testUploadMultipleFiles,
  testUploadSingleFileToGCS,
  testUploadMultipleFilesToGCS,
} = uploadController;

const router = express.Router();

/**
 * Routes intended for testing upload functionality.
 */
router.post(
  '/test-upload-file',
  multerUpload.single('file'),
  authenticate,
  catchAsync(testUploadSingleFile),
);
router.post(
  '/test-upload-files',
  multerUpload.array('files', 2),
  authenticate,
  catchAsync(testUploadMultipleFiles),
);

/**
 * Upload a file using the MulterGoogleCloudStorage middleware.
 */
router.post(
  '/test-upload-single-file-to-gcs',
  multerGCSUpload.single('file'),
  authenticate,
  catchAsync(testUploadSingleFileToGCS),
);
router.post(
  '/test-upload-multiple-files-to-gcs',
  multerGCSUpload.any(),
  authenticate,
  catchAsync(testUploadMultipleFilesToGCS),
);

export default router;
