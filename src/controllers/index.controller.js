export default {
  /**
   * Entry point controller for /api/v1
   * @param req
   * @param res
   * @param next
   * @return {Promise<void>}
   */
  apiEntryPoint: async (req, res, next) => {
    try {
      res.status(200).json({
        status: 'success',
        message: 'API endpoint is ready!',
      });
    } catch (err) {
      res.status(500).json({
        status: 'fail',
        message: 'Unexpected Error',
        error: err.toString(),
      });
    }
  },
  /**
   * Return uploaded files in the test route
   * @param req
   * @param res
   * @param next
   * @return {Promise<void>}
   */
  testUploadSingleFile: async (req, res, next) => {
    try {
      const file = await req.file;
      res.status(200).json({
        status: 'success',
        message: 'Upload single file function is working',
        fileDetails: file,
      });
    } catch (err) {
      res.status(500).json({
        status: 'fail',
        message: 'Unable to upload file',
        error: err.message,
      });
    }
  },
  /**
   * Return uploaded files in the test route
   * @param req
   * @param res
   * @param next
   * @return {Promise<void>}
   */
  testUploadFiles: async (req, res, next) => {
    try {
      const files = await req.files;
      res.status(200).json({
        status: 'success',
        message: 'Upload files function is working',
        filesDetails: files,
      });
    } catch (err) {
      res.status(500).json({
        status: 'fail',
        message: 'Unable to upload files',
        error: err.message,
      });
    }
  },
};
