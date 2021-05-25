import express from 'express';
import indexController from '../controllers/index.controller';
import {
  multerUpload,
  multerGCSUpload,
} from '../middlewares/upload.middleware.js';
import authentication from '../middlewares/authenticate.middleware';
import catchAsync from '../middlewares/catchAsync.middleware';

const {
  apiEntryPoint,
  testUploadSingleFile,
  testUploadMultipleFiles,
  testUploadSingleFileToGCS,
  testUploadMultipleFilesToGCS,
} = indexController;

const { authenticate } = authentication;

const router = express.Router();

router.get('/', apiEntryPoint);
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

/**
 import asyncHandler from 'express-async-handler';
 router.get(
 '/',
 Multer.single('file'),
 asyncHandler(async (req, res, next) => {
    const file = await req.file;
    res.status(200).json({
      status: 'success',
      message: 'API endpoint is ready',
      file: file,
    });
  }),
 );

 // return next(err);
 */

export default router;
