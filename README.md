# Node Service Commons

```
                     __                      _                            
 |\ |  _   _|  _    (_   _  ._   o  _  _    /   _  ._ _  ._ _   _  ._   _ 
 | \| (_) (_| (/_   __) (/_ | \/ | (_ (/_   \_ (_) | | | | | | (_) | | _> 
                                                                          
```

An MVC platform of common JSON/REST services for node / web applications implemented for classical instantiation and inheritance.

[![NPM version](https://badge.fury.io/js/node-service-commons.svg)](http://badge.fury.io/js/node-service-commons) [![Build Status](https://travis-ci.org/darrylwest/node-service-commons.svg?branch=master)](https://travis-ci.org/darrylwest/node-service-commons) [![Dependency Status](https://david-dm.org/darrylwest/node-service-commons.svg)](https://david-dm.org/darrylwest/node-service-commons)

## Introduction

The Node Service Commons is a set of components that support REST / web service containers.  The MVC implementation includes factories, data access base objects, delegates, web and data service objects.  Implementation uses Crockford-style classical construction (but no ECMA6 classes).  The associated docker container helps create a containerized implementation.

_Requires minimum node 4.  If you are using an older version of node, please use the pre-4.0 branch._

### Features

* includes start and graceful shutdown hooks
* domain based key generation for no-sql databases
* includes docker file to help containerize your service applications
* brings order to the chaos

## Controllers Package

A collection of startup and control objects.  Most classes are designed to be extended by concrete web control and configuration objects.

### CommonBootstrap

This object is used to parse command line inputs to set environment, logfile, configuration, etc.  Its primary method, parseCommandLine() is used to parse an array of strings, typically process.argv and extract the environment name (development, staging, test, production, etc), the config and log files.  For example:

~~~
	var Bootstrap = require('node-service-commons').controllers.CommonBootstrap;

    // instantiate with the application version
	var bootStrap = new BootStrap( Config.VERSION );

    // parse the options and set defaults
    var options = bootStrap.parseCommandLine( process.argv );

    assert options.env === 'development';
~~~


### AbstractApplicationFactory

The AbstractApplicationFactory constructs components and services required for a typical web service.  Services include middleware, loggers, configurations, etc.

Typical Use:

~~~
	// called by the concrete ApplicationFactory (this) with options/configuration

	AbstractApplicationFactory.extend( this, options );
~~~


## Delegates

### CommonValidator

The common validator provides a base class to validate input values and return all detected errors by populating a supplied list.  This approach enables returning all detected errors to the client application with associated field designators.

Most of the vaidation work is done using [lodash](http://lodash.com/) or [validator](https://github.com/chriso/validator.js) functions.

### MiddlewareDelegate

The middleware delegate provides standard middleware to check API key, enable cross domain access, and provide a shutdown hook to gracefully bring service containers down through a local HTTP request.  A typical shutdown request would look like this:

~~~
	curl -d token=<api-token> http://127.0.0.1:<port>/shutdown
~~~

The standard delegate also includes a X-API-Key filter to require all requests to use the key.  This also enforces the same-domain rule which can be difficult in development.  So, there is an options switch that can be set in development to ignore the key requirement.  This needs to be enforced on both server and client.

## Models

### ServiceRoute

A simple datamodel that contains route info including method, url, and service function.  ServiceRoute objects are defined in named WebService containers to enable auto-wiring on construction.

### ServiceResponse

The ServiceResponse is a wrapper for all JSON returns.  There are two possible status conditions: ok or failed.  Normal returns include a status of ok, a timestamp, version and the model or list payload.  Error or failed returns include a status of failed, a timestamp, version and the reason for the failure.

## Data Access Objects

### Abstract NoSQL DAO

Optimized for redis but can support others.  The standard implementation includes these methods:

- findById - return the model located by id
- query - generic query that returns all rows for the given domain
- insert - insert a model; if id is missing, create one
- update - update a model
- createModelId - create a standard uuid-like id
- createDomainKey - create a key combining the domain name and id
- parseModel - parse the domain model

All of these methods work out of the box and are easily overridden to provide specific implementations.

## Services

### AbstractWebService

AbstractWebService provides a base class for all web services.  Its methods include creating ServiceReponse objects for ok/failed model or list responses.  It also supports digest calculation to insure the the payload is delivered with the correct signature.

### AbstractDataService

The AbstractDataService provides a base class used to connect web services from the API to the back end services.  Data service usually connects to a data access object but can also connect to file system, cash, other servers or any appropriate service.

### IndexPageService

The IndexPageService presents a very simple HTML page displaying the application title, version and a timestamp.  A more elaborate page can be defined through configuration if needed.

### WebStatusService

WebStatusService is used to report the web container's current status.  Values include up-time, available memory, the environment name, version, etc.

Errors and warnings are tracked by listening for process events 'error' and 'warning'.  To enable error and warning listeners, simply invoke 'initListeners()' on the web status service.  This is usually done in the application's implementation of ApplicationFactory like this:

```
const services = factory.createWebServices( factory.createServiceFactory(), webServiceList );
const service = services.find(svc => svc.serviceName === 'WebStatusService');
service.initListeners();
```

_or like this_

```
const services = factory.createWebServices( factory.createServiceFactory(), webServiceList );
services.forEach(service => {
	if (typeof service.initListeners === 'function') {
		service.initListeners();
	}
});
```

Accessing web status shows the warning and error count.  Here is a sample status dump:

```
{ status: 'ok',
  ts: 1464107033676,
  version: '1.0',
  webStatus: {
     version: '00.91.60',
     env: 'production',
     epoch: '2016-05-22T19:25:07.015Z',
     uptime: '01 days+20:58:46',
     warnings: 0,
     errors: 0,
     process: { pid: 1, title: 'node', vers: 'v4.4.3' },
     totalmem: 1928470528,
     freemem: 261324800,
     loadavg: [ 0.00341796875, 0.02392578125, 0.04541015625 ],
     arch: 'x64' 
   } 
}
```

_This format may change in future versions but typically to add new attributes._

## Docker

There is a sample docker file and associated build script in the docker folder.  The container script is based on the small alpine disro and includes node 6.10 (no npm).  The intent is for this to be a template used for your application.

Create the container with `make container`.  From there you can create a run script to "volume" in your source and start your application. _Examples to come soon._

## Mocks

- MockExpress
- MockAgent (super agent, requires version 2)
- MockRedisClient

## Common Web Service Architecture

![web service architecture](http://blog.raincitysoftware.com/images/web-service-architecture.png)

_find more info [here](http://blog.raincitysoftware.com/A-Common-Service-Library-for-Node/)..._

TODO:
- create demo implementation
- example of method overrides

- - -
<p><small><em>Copyright © 2014-2017, rain city software | Version 0.91.35</em></small></p>
