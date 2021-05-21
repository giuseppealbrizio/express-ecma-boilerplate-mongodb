import multer from 'multer';

export const Multer = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 30 * 1024 * 1024, // no larger than 30mb
  },
});
