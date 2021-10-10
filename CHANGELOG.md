# Change Log

[EXPRESS ECMA BOILERPLATE](https://github.com/giuseppealbrizio/express-ecma-boilerplate-mongodb)

All notable changes to this project will be documented in this file.

## [1.1.0] - 2021-10-10

Here we would have the update steps for 1.1.0 for people to follow.

### Added

- **RBAC - Logic** to authorize user to use routes based on role permission.
  1. Roles configuration can be customized in:
     `./src/config/roles.config.js`
  2. RBAC middleware definition is in:
     `./src/middlewares/verifyRights.middleware.js`
  3. You can use the middleware `verifyRights` in routes like this:
  ```js
  //Only users with getUsers permission can see this route
  router.get(
    '/users',
    authenticate,
    verifyRights('getUsers'),
    catchAsync(findAllUsers),
  );
  ```

### Changed

- Refactor routes to keep API versioning tidy and clear. Now routes are defined in `./src/routes/v1/index.route.js`
- Added a role field in user model definition `./src/models/user.model.js` to use the verifyRights middleware
- Renamed `./src/config/database.config.js` to `./src/config/mongodb.config.js`
- Moved the entrypoint routes to `./src/routes/v1/app.route.js`
- Refactor events (publisher/subscriber) to keep pub/sub logic tidy and clean. Now all events related controller & routes can be find here:
  1. `./src/controllers/events`
  2. `./src/routes/events`

### Fixed
