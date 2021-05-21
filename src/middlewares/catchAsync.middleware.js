/**
 * Catch Async Errors in routes
 * @param catchAsync
 * @return {(function(*=, *=, *=): Promise<*|undefined>)|*}
 */
export default (catchAsync) => async (request, response, next) => {
  try {
    await catchAsync(request, response, next);
  } catch (error) {
    return next(error);
  }
};
