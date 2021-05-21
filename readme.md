# Express ECMA Boilerplate With MongoDB

#### This is a minimalistic express boilerplate with EICMA features enabled, MongoDB configured, Passport basic authentication, and ready to be multi-stage containerized

#### App entry point is located in `./src/app.js`

#### The server config entrypoint is located in `./src/bin/www.js`

#### Babel config is located at `./.babel.rc`

#### Prettier configuration is located at `./.prettierrc.js`

#### Docker config is located at `./Dockerfile`

There are some basic packages installed and configured as dotenv, helmet, express-session, etc

## Folder Structure

> `src/`
>
> - **`bin/`** - server configuration folder
> - **`config/`** - here you find all the configuration files (database, passport, etc...)
> - **`constants/`** - here you can put all you global constants
> - **`controllers/`** - all the controllers to use in routes that interact with services
> - **`helpers/`** - some helpers function i.e. an error helper that return json everytime an error comes in controllers
> - **`models/`** - database model definition
> - **`routes/`** - here you find all the defined routes of the app
> - **`services/`** - here we store all the services; i.e. here we define the methods to manipulate a db model entity
> - **`utils/`** - a folder containing some utilities function to be reused in the code (i.e. axios global configuration)

## Getting Started

Copy the .env.local to .env

`cp env.local .env`

> Then replace the string in .env file MONGO_URI with your connection

To get started with this repo npm install in the root folder

`npm install`

To getting started with a dev environment. Here we use nodemon and babel-node to restart the server asa we change something

`npm run dev`

To transpile the code and create a production build

`npm run transpile`

This command will create a build in the root directory

To start with a production ready build you can run this command

`npm run start`

> This command run multiple commands. Set the NODE_ENV to production, npm-run-all, create a build and run the server command

If you have a build and you want to node the build you can run

`npm run server`

> This command launch the node instance inside the ./build/bin/www

## Docker Ready

### Here we use the multistage build to optimize speed and size of the final image

If you use Docker and wanna dockerize the app you can run the command

`docker build -t <dockerhubusername>/<docker-image-name>:<tag> . `

then

`docker run --name <docker-process-name> -d - p 3000:3000 <dockerhubusername>/<docker-image-name>:<tag>`
