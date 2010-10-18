---
title: Update on Data Upload APIs
excerpt: We've been really busy in GoodData in the past couple months reshaping our upload APIs - simplifying them, speeding them up and opening them up to more flexibility. In summer we've released our v2.0 APIs to our developer community through our GoodData CL. Now we're back with the latest installment - SLI API allowing you to load a single file and have it normalized in GoodData. Read more on how to start using them.
layout: post
---
# On Data Upload APIs

We've been really busy in GoodData in the past couple months reshaping our upload APIs - simplifying them, speeding them up and opening them up to more flexibility. Our v1.0 API allowed you to upload a single CSV file and our product would try to infer the data model from it (giving you a few couple options to choose from along the way).

We soon realized that we needed a more powerful data framework - but more importantly that we need to turn the table and allow you to specify a data model first and for the data interface to follow later. We have created v2.0 of our APIs that allowed you the tremendous flexibility to create your own data model explicitly.

To speed things up and get this out of the door ASAP, we had to sacrifice a bit of simplicity. Our APIs would accept data only in a normalized form, each lookup in a separate data file. We called these APIs "DLI" (shorthand for data-loading interface) and quickly built a bit of magic into CL tool to produce these normalized files automatically for you. CL tool was either using built-in Apache Derby or external MySQL to transform and normalize the data.

Today we've finally finished our last piece of the Data Upload API puzzle - SLI (single-file loading interface). You can still specify your own data model, but we give you a single data file to load and do all the normalization inside the product. This both simplifies the upload and speeds it up significantly (compared to the existing CL tool with DLI APIs).
    
Currently, the new version of CL tool using these APIs is a special build. Once we test everything works as expected, we'll turn on SLI APIs for everybody.

### What's changing with SLIs:

* CL tool doesn't need any DB backend (Derby or MySQL)
* Uploads processing should be significantly faster
* GoodData CL (and other API clients) can be significantly simplified
* You cannot mix&amp;match DLI and SLI in single project. You can only use one or the other.
* You need a special CL tool build (currently, eventually we'll migrate all projects)
* `-b, -c, -d, -m` (or `--backend, --dbusername, --dbpassword` and `--memory`) CL flags are meaning less

We'd like you to help us prototype the new APIs. If you're interested, download this special build ([tar.gz](http://dl.dropbox.com/u/9417728/gooddata-cli-1.2.1-SNAPSHOT.tar.gz), [zip](http://dl.dropbox.com/u/9417728/gooddata-cli-1.2.1-SNAPSHOT.zip) - and if you run into issues, let us know on [Developer Forum](http://support.gooddata.com/forums/176660-developer-forum) (and please indicate you're using SLI APIs).
