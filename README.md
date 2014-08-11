# Node Service Commons
- - -

Common REST services for node / web applications

## Introduction

The Node Service Commons is a set of components that support REST / web service containers.  

## Controllers Package

A collection of startup and control objects.  Most classes are designed to be extended by concrete web control and configuration objects.

### CommonBootstrap

This object is used to parse command line inputs to set environment, logfile, configuration, etc.  Its primary method, parseCommandLine() is used to parse an array of strings, typically process.argv and extract the environment name (development, staging, test, production, etc), the config and log files.  For example:

~~~
	var Bootstrap = require('node-commons').controllers.CommonBootstrap;
    
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

Model Delegate, Validators, Cache, Middleware

## Models

Validation fields, Base data model

## Services

Data and Web services, Index page, status page


- - -
<p><small><em>Copyright © 2014, roundpeg | Version 0.90.10</em></small></p>
