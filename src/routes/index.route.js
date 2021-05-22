import express from 'express';
import indexController from '../controllers/index.controller';
import { Multer } from '../middlewares/upload.middleware.js';
import authentication from '../middlewares/authenticate.middleware';
import catchAsync from '../middlewares/catchAsync.middleware';

const { apiEntryPoint, testUploadSingleFile, testUploadFiles } =
  indexController;

const { authenticate } = authentication;

const router = express.Router();

router.get('/', apiEntryPoint);
router.post(
  '/test-upload-file',
  Multer.single('file'),
  authenticate,
  catchAsync(testUploadSingleFile),
);
router.post(
  '/test-upload-files',
  Multer.array('files', 2),
  authenticate,
  catchAsync(testUploadFiles),
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
