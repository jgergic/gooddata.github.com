---
title: Server side Charting - a case for Node.js and Erlang
excerpt: Erlang and Nodejs distributed technology foundation behind the scenes of the new Chart Export functionality.
layout: post
---

# {{ page.title }}
_by Jan Pradac ([@prajanq](http://twitter.com/#!prajanq)) &amp; Standa Opichal ([@opichals](http://twitter.com/#!opichals))_


GoodData [Release 46](http://support.gooddata.com/entries/424738-release-46-notes-february-2-2011) sports a long awaited chart export capability. In this post, we won&apos;t focus on the feature itself, but rather on the interesting stuff going on under the hood. Since this is a completely new piece of functionality in our platform, we chose it to be a testing ground for the new infrastructure we are experimenting with.

# GoodData Charting Engine

Let’s start from the beginning. Two years ago we were facing the need to implement a client-side charting capability. We started by exploring what was available at the time and subsequently chose a 3rd party commercial library. However, it soon turned out that the 3rd party library wasn&apos;t able to meet our longer term requirements so we decided to dedicate resources to develop a charting library in-house. Because of demands for high user interactivity we developed a native JS charting library. We anticipated the exporting feature would be needed later so we were thinking about either maintaining parallel code base on the server side, or maybe running our client JS library under [Rhino](http://www.mozilla.org/rhino/).

As new features and chart types kept piling up and our charting library became more complex, it became obvious that the possibility to maintain a feature-identical server-side code base was no longer an option. When the chart exporting feature appeared on our short term roadmap, we started exploring options on how to deploy our JS charting library on the server side. The first idea on how to deal with this was the [nodejs-yui3](https://github.com/davglass/nodejs-yui3) project by YUI developer Dave Glass. Nodejs-yui3 enables execution of [YUI3](http://developer.yahoo.com/yui/3/) which we use as our primary JavaScript framework under [Node.js](http://nodejs.org/). We started experimenting with this in February 2010. After a while Dave&apos;s endeavor got public mainly via his great post [&apos;Running YUI 3 Server-Side with Node.js&apos;](http://www.yuiblog.com/blog/2010/04/05/running-yui-3-server-side-with-node-js/). The second trigger was David Padbury&apos;s blog post [&apos;Using NodeJs to render JavaScript charts on the server&apos;](http://blog.davidpadbury.com/2010/10/03/using-nodejs-to-render-js-charts-on-server/). After considering our options, we decided to go ahead and use this technology in production.

# Server-side Charting Execution Chain

Exporting charts is generally a multi-step process. First, the data needs to be pulled from the data warehouse. The next step, is rendering the data into a vector graphics representation, the step which is performed by our JS charting library. The last step, involves converting the vectorised graphics into another output format like PDF or PNG. In general this process is what is usually called a multi-part long-running operation - a workflow.

<p>
<center><img src="{{ site.root }}/images/posts/2011-02-22-export-service-rest.png" alt="Export Service Chain"></center>
</p>

# Meet TaskMan - the asynchronous task management middle-ware

Some sort of an orchestrator - an oversight entity - taking care of scheduling, monitoring and error handling of all stages of the process is necessary. Erlang with its OTP platform and the inherent supervisor concept seemed to be an ideal choice for this portion of the middleware. Since we already built some prototypes of what we call TaskMan (a task manager) in Erlang earlier, we decided the server side charting feature would be an ideal candidate to battle test Erlang in GoodData in production deployment. The TaskMan is a distributed long-running operation scheduler/manager with REST API. It employs Erlang’s integrated distributed transaction DBMS - [Mnesia](http://www.erlang.org/doc/man/mnesia.html) which allows us to brace for multi-node deployments and [Yaws](http://yaws.hyber.org/) a high performance web server for fast REST API tasks management. The initial TaskMan design was intentionally kept minimal. It receives a task definition and manages a pool of workers to process it. 

# Execution Workflow Implementation

<p>
<center><img src="{{ site.root }}/images/posts/2011-02-22-export-service.png" alt="Export Service Architecture"></center>
</p>

There are workers configured for each of the steps of the chart export process.
The first worker manages the data retrieval. It uses our standard REST APIs and fetches all the data necessary for a particular chart export job.

The second worker is for the actual chart rendering, a process analogous to what is happening in the web browser when rendering a chart on the client. Using YUI on both sides allowed us to share the browser built code on the server side in Node.js with suprisingly, almost no additional work.

The final step is the conversion of the rendered SVG to a PDF document or PNG image file. We built a worker based on the good old Apache Batik Rasterizer using Apache FOP (for generating PDF).  The only extra step was adjusting the SVG markup to avoid generic SVG->PDF conversion transparency issues.

# Conclusion

We have been very pleased by the result and are getting the exact same chart rendering using the browser as well as in the exported documents. We are looking forward to exploiting the opportunities this great piece of infrastructure provides. The idea of sharing the JavaScript code beyond just the browser environment is very powerful. Using the Erlang-built TaskMan enables us to distribute the worker load with minimal effort.
