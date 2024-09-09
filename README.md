__The application is available at https://production.blueprint.aleksanderciesiel.ski__
# Blueprint
___Blueprint___ is an algorithm visualiser web application that allows its users to create and share program visualisations. 

### Prerequisities
To run the application, make sure you have ___Node.js___ installed (the application has been tested with v20.17.0). You will also need a running _PostgreSQL_ database.

To properly run _Blueprint_, rename all `.env.example` files to `.env` and set correct values for the environment variables:
* `packages/blueprint-client/.env.example`
* `packages/blueprint-server/.env.example`
* `infrastructure/.env.example` (if you intend to use provided _Docker_ images).
* `infrastructure/environments/.env.example` (if you intend to use provided _Docker_ images).

## Starting the application
First, install required dependencies by running `$ npm install` in the root directory. Start two terminal sessions and run:
* In the first terminal session, run `$ npm run dev:client` to start the client.
* In the second session, run `$ npm run dev:server` to start the server.

The application should now be up and running, on default on `http://localhost:3000`.
