# Lofar Long Term Archive pipeline orcestrate web application

The is the frontend and the db backend of the web application which can be used to run a pipeline on several data products in the Lofar Long Term Archive.
To run pipeline the https://github.com/EOSC-LOFAR/lofar_workflow_api web service is required.

![Architecture](architecture.png "Architecture")

### Configuration:

To run the following enviroonment variables must be set:
* HR_CONNECTIONSTRING, connection string to Lofar database (optional)
* HR_USER, username to connect to Lofar database
* HR_PASSWORD, password to connect to Lofar database

### Installation:
To install frbcat-web, please follow the following steps. First we need to install the dependencies of frbcat-web using the following commands:
```
  npm install
```
Next, we build the package using:

```
  npm run webpack
```

### Running the express server with frbcat-web:
To start the express server with frbcat-web loaded use the following command:
```
npm run start
```

To run both backends behind the same server use [CaddyServer](https://caddyserver.com/) by running it in root of this repo with:
```
caddy
```

The web application is running at http://localhost:2015
