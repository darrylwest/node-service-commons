# Node Service Commons
- - -
An MVC platform of common JSON/REST services for node / web applications implemented for classical instantiation and inheritance.

[![NPM version](https://badge.fury.io/js/node-service-commons.svg)](http://badge.fury.io/js/node-service-commons) [![Build Status](https://travis-ci.org/darrylwest/node-service-commons.svg?branch=master)](https://travis-ci.org/darrylwest/node-service-commons) [![Dependency Status](https://david-dm.org/darrylwest/node-service-commons.svg)](https://david-dm.org/darrylwest/node-service-commons)

## Introduction

The Node Service Commons is a set of components that support REST / web service containers.  The MVC implementation includes factories, data access base classes, delegates, web and data service classes.  Implementation uses classical construction (but not ECMA6 classes yet).

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

## Models

### ServiceRoute

A simple datamodel that contains route info including method, url, and service function.  ServiceRoute objects are defined in named WebService containers to enable auto-wiring on construction.

### ServiceResponse

The ServiceResponse is a wrapper for all JSON returns.  There are two possible status conditions: ok or failed.  Normal returns include a status of ok, a timestamp, version and the model or list payload.  Error or failed returns include a status of failed, a timestamp, version and the reason for the failure.

## Data Access Objects

### Abstract NoSQL DAO

Optimized for redis but can support others.

## Services

### AbstractWebService

AbstractWebService provides a base class for all web services.  Its methods include creating ServiceReponse objects for ok/failed model or list responses.  It also supports digest calculation to insure the the payload is delivered with the correct signature.

### AbstractDataService

The AbstractDataService provides a base class used to connect web services from the API to the back end services.  Data service usually connects to a data access object but can also connect to file system, cash, other servers or any appropriate service.

### IndexPageService

The IndexPageService presents a very simple HTML page displaying the application title, version and a timestamp.  A more elaborate page can be defined through configuration if needed.

### WebStatusService

WebStatusService is used to report the web container's current status.  Values include up-time, available memory, the environment name, version, etc.

## Mocks

- MockExpress
- MockRedisClient

## Common Web Service Architecture

![web service architecture](http://blog.raincitysoftware.com/images/web-service-architecture.png)

_find more info [here](http://blog.raincitysoftware.com/A-Common-Service-Library-for-Node/)..._

TODO:
- create demo implementation
- example of method overrides

- - -
<p><small><em>Copyright © 2014, roundpeg | Version 0.90.52</em></small></p>
