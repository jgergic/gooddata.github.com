---
title: API Documentation
layout: documentation
stub: api
---

# GoodData API Structure

GoodData platform exposes all of its functionality via the HTTP APIs. We will keep documenting the APIs here. Currently the fastest way how to learn about the GoodData APIs is to inspect the [Java code of the GoodData CL application](http://github.com/gooddata/GoodData-CL). We also recommend you to read the brief overview of the [GoodData CL architecture](/gooddata-cl/architecture.html)

A typical integration scenario looks like this:

1. Login to GoodData (see the [Authentication API](#auth))
1. Create a new GoodData project (see the [Provisioning API](#provision))
1. Create new Logical Data Model by executing a [MAQL DDL](maql-ddl.html) script (see the [Modeling API](#model))
1. Transform your data to fit Data Loading Interfaces (DLIs) generated from the [MAQL DDL](maql-ddl.html) script.
1. Load your data to the GoodData project (see the [Data Loading API](#data))

<a name="auth" style="position:absolute;">&nbsp;</a>
## Authentication API

The authentication API provides access to the GoodData's token-based authentication
which is required prior to authorizing access to most GoodData resources.

To lean more about how to authenticate to GoodData, read the [Authentication API](auth.html)
documentation, where you can find an example as well.

<a name="model" style="position:absolute;">&nbsp;</a>
## Modeling API 
Each GoodData project requires so called Logical Data Model (LDM) that describes the data that are available for analysis. The LDM consists of mutually connected _attribute_, _fact_, _dataset_, and _folder_ objects. These objects are created using a MAQL DDL scripts.

 * [MAQL DDL](maql-ddl.html) &mdash; <em>SQL-like scripted language for creating and changing a project's Logical Data Model</em>
 * See the [_executeMAQL_ method in the GdcRESTApiWrapper.java](http://github.com/gooddata/GoodData-CL/blob/master/backend/src/main/java/com/gooddata/integration/rest/GdcRESTApiWrapper.java) for more details about the project provisioning API.

<a name="data" style="position:absolute;">&nbsp;</a>
## Data Loading API
The data loading API enable the physical transfer of data between various data sources and a GoodData project. The MAQL DDL script generates so called Data Loading Interface (DLI) that you can use to load the data. Each DLI consists of multiple parts that each describe a structure of a data file that is exchanged between your application and GoodData. You need to transform your data to fit the structures described in the parts, package all data files along with a simple manifest into a ZIP archive, and transfer the archive via FTP to GoodData.

 *  See the [_getDLIs_ and _getDLIParts_ methods in the GdcRESTApiWrapper.java](http://github.com/gooddata/GoodData-CL/blob/master/backend/src/main/java/com/gooddata/integration/rest/GdcRESTApiWrapper.java) for more details about the DLI introspection.
 *  See the [_deploySnapshot_ in the AbstractConnectorBackend.java](http://github.com/gooddata/GoodData-CL/blob/master/backend/src/main/java/com/gooddata/connector/backend/AbstractConnectorBackend.java) for more details about the creation of the data package that is transferred to the GoodData.
 * See the [_deploySnapshot_ in the GdcFTPApiWrapper.java](http://github.com/gooddata/GoodData-CL/blob/master/backend/src/main/java/com/gooddata/integration/ftp/GdcFTPApiWrapper.java) to get more details on the FTP transfer of the data package.
 * Finally take a look at the [_startLoading_ and _getLoadingStatus_ methods in the GdcRESTApiWrapper.java](http://github.com/gooddata/GoodData-CL/blob/master/backend/src/main/java/com/gooddata/integration/rest/GdcRESTApiWrapper.java) that tell the GoodData project to process the data package.

You can find a more depth-in explanation of the language and its use
on a dedicated [MAQL DDL](maql-ddl.html) page.

<a name="provision" style="position:absolute;">&nbsp;</a>
## Project Provisioning API
The project provisioning API takes care of creating and dropping new projects. Please note that the amount of projects that you can create in the GoodData platform is limited.

* See the [_createProject_ and _dropProject_ methods in the GdcRESTApiWrapper.java](http://github.com/gooddata/GoodData-CL/blob/master/backend/src/main/java/com/gooddata/integration/rest/GdcRESTApiWrapper.java) for more details about the project provisioning API.
