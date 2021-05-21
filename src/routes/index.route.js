import express from 'express';
import { Multer } from '../middlewares/upload.middleware.js';
import indexController from '../controllers/index.controller';

const { apiEntryPoint, testUploadSingleFile, testUploadFiles } =
  indexController;

const router = express.Router();

router.get('/', apiEntryPoint);
router.get('/test-upload-file', Multer.single('file'), testUploadSingleFile);
router.get('/test-upload-files', Multer.array('files', 2), testUploadFiles);

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
