# Express ECMA Boilerplate With MongoDB

This is a minimalist express boilerplate with the following features:

> - `ECMA` features enabled
> - `Dotenv` Load environment variables from .env file
> - `Eslint` Code quality tool
> - `Prettier` to prettify the code
> - `MongoDB` ready to go configuration with mongoose
> - `CORS` feature enabled
> - `Passport` local authentication strategy and middleware to restrict access.
> - `Sendgrid` email service support with sendgrid.
> - `Error Handling` errors custom middleware and helpers globally configured
> - `Multer` File uploading configured to use in routes as middleware
> - `Google Cloud Storage` middleware configured to use Google Cloud Storage as upload bucket
> - `Google Cloud Pub/Sub` pub/sub support for event driven events added
> - `Axios` globally configured in `./src/utils/api.utils.js`
> - `Swagger` documentation reachable at `http://localhost:3000/api/v1/docs`
> - `Jest` Testing tool support
> - `Docker` ready configuration with multi-stage option
> - `Best practices` in naming files

## Basic Information

- App entry point is located in `./src/app.js`

- Server config entrypoint is located in `./src/bin/www.js`

- Babel config to transpile the code is located at `./.babel.rc`

- Prettier config is located at `./.prettierrc.js`
- Eslint config is located at `./.eslintrc.json`

- Passport config is located at `./src/config/passport.config.js`

  - Local Strategy is defined in `./src/services/passport/passport-local.service.js`

- Sendgrid service support is located at `./src/services/email/sendgrid.service.js`

  - You can define your own email services in this file

- Mongo config is located at `./src/config/database.config.js`

  - Models definition are located in `./src/services`

- Error Handling middleware is located at `./src/middlewares/errorHandler.middleware.js`

  - You can configure as many errors you need in `./src/helpers/errors.helper.js`

- Multer middleware is located at `./src/middlewares/upload.middleware.js`

  - If you want to use Google Cloud Storage as upload bucket follow instructions at `./src/config/gcloud/README.md`

- Swagger config file is located at `./swagger.json`

  - Swagger routes are defined in `./src/routes/swagger.route.js`

- Docker config is located at `./Dockerfile`

- Pub/Sub service is located at `./src/services/pubsub/pub-sub.service.js`

## Folder Structure

> `src/`
>
> - **`bin/`** - server configuration folder
> - **`config/`** - this folder contains all the configs file (database, passport, etc...)
> - **`constants/`** - this folder contains all the global constants
> - **`controllers/`** - all the controllers to use in routes that interact with services
> - **`helpers/`** - some helpers func i.e. an error helper that returns json everytime an error comes in
> - **`middlewares/`** - here you can find all the custom middlewares
> - **`models/`** - database model definition
> - **`routes/`** - here you find all the defined routes of the app
> - **`services/`** - here we store all the services; i.e. here we define methods to manipulate a db model entity
> - **`utils/`** - containing some utils function to be reused in the code (i.e. axios global configuration)

## Getting Started

Copy the .env.example to .env

```bash
cp env.example .env
```

Then replace:

1. `MONGO_URI` string with your Mongo connection
   1. `MONGO_URI_TEST` string with your Mongo Test connection
2. `GOOGLE_APPLICATION_CREDENTIALS` path with yours
3. `GOOGLE_PROJECT_ID` with yours
4. `SENDGRID_API_KEY` with yours
5. `SENDGRID_SENDER_EMAIL` with yours

In order to Google Cloud Storage works follow instructions located in
`./src/config/gcloud/README.md`

---

To get started with this repo npm install in the root folder

```bash
npm install
```

To getting started with a dev environment. Here we use nodemon and babel-node to restart the server asa we change
something

```bash
npm run dev
```

To transpile the code and create a production build

```bash
npm run transpile
```

This command will create a build in the root directory

To start with a production ready build you can run this command

```bash
# This set the NODE_ENV to production, npm-run-all, create a build and run the server command
npm run start
```

If you have a build and you want to node the build you can run

```bash
# This command launch the node instance inside the ./build/bin/www
npm run server
```

## Docker Ready

### Here we use the multistage build to optimize speed and size of the final image

If you use Docker and wanna dockerize the app you can run the command

```bash
docker build -t <dockerhubusername>/<docker-image-name>:<tag> .
```

then

```bash
docker run --name <docker-process-name> -d - p 3000:3000 <dockerhubusername>/<docker-image-name>:<tag>
```
