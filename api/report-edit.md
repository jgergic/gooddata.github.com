---
title: Customizing Reports via API
layout: documentation
stub: api-report-edit
---

# {{ page.title }}

This article describes how to modify your reports on the fly via GoodData's REST API. This gives you ultimate flexibility in how you use GoodData. However, the the implementation can be complex. If you just need to customize your reports on a per-user level, using [Variable Filters](https://secure.gooddata.com/docs/html/reference.guide.data.variables.html) might be a more efficient use of time.

## Structure of a Report

In the following text, we'll be using several objects from the API:

* `Report` - what you see in GoodData UI. Contains multiple report definitions (ie. history of revisions) and metadata like name, author etc.
* `Report Definition` - contains definition of a specific report - attributes, metrics, assignment to axes, visual formatting information etc.
* `Attribute` - contains multiple *Display Forms* (in GoodData CL also called *Label*)
* `Display Form` - contains text representations of it's parent attribute's values (for example short and long version of month name)
* `Metric` - MAQL formula for aggregating numeric data represented by facts
* `Fact` - your source numeric data

Let's get an overview how they all fit together:

![Report Structure]({{site.root}}/images/api/report-structure.png)

## Browsing the API

First, let's find URLs to APIs representing the objects described above. We'll start by obtaining the URL of the report:

* open up the report you want to modify

* in the location bar of your browser, extract the URL to the `Report` object - the last fragment in the URL - see this screenshot ![Report Url]({{site.root}}/images/api/report-url.png)

* open this URL in a new window (prepend it with secure.gooddata.com). What you'll see is an API page with representation of the `Report` object (in this case in YAML, however JSON serialization is also available, see [this example](http://developer.gooddata.com/api/projects.html))

![Report Gray Page]({{site.root}}/images/api/report-gray-page.png)

This page serves as a good starting point. Let's follow the link to `Report Result`:

![Report Result Gray Page]({{site.root}}/images/api/report-result-gray-page.png)

From here, we can finally access the `Report Definition` page:

![Report Definition Gray Page]({{site.root}}/images/api/report-definition-gray-page.png)

This is the structure of the report definition, this is that we're going to be modifying. For brevity let's leave out the visual clues & formatting and convert this to JSON:

{% highlight js %}
{ "reportDefinition": {
    "content": {
        "grid": {
            "columns": [
                { "attribute": { "uri": "/gdc/..url../obj/33" } },
                "metricGroup"
            ],
            "rows": []
            "metrics": [
                { "uri": "/gdc/..url../obj/868" },
                { "uri": "/gdc/..url../obj/869" }
            ],
            ...
        },
        "chart": { ... },
        "filters": [
            { "expression": "[/gdc/..url../obj/53]
                BETWEEN {ThisMonth}-1 AND {ThisMonth}" }
        ]
    },
    "links": { ... },
    "meta": { ... }
}}
{% endhighlight %}

## Modifying the Report

The whole `Report Definition` object is considerably bigger and given it's tight coupling with GoodData, it's generaly not advisable to construct it on your own. However, since you already have a starting point from the previous steps, you can modify the definition and send it back to the same URL with a POST request. Typical modifications include:

* **modify the report filters:** `reportDefinition > content > filter > expression`. Don't worry too much about anything else then `expression` section in the `filters`, the rest is ignored when POSTed. The decisive information is listed in the `expression` section. The [MAQL Filters](https://secure.gooddata.com/docs/html/reference.guide.maql.filters.html) section of our reference manual can be used (just include the part following WHERE clause in the filter expression)

* **add/remove attributes, drill-down:** the `reportDefinition > content > grid` section contains `columns` and `rows` sections. Each of them is an ordered array, ordered from outter-most to inner-most attribute relative to the table center.


* **add/remove metrics:** For metrics ordered from left to right) While each member of the array is a rich object, you can only change the `uri` part of the object. Additionaly a string "metricGroup" placed as the last element of either rows or columns controls if metrics (if you have multiple metrics in your report) are stacked or displayed side-by-side.

## Saving the Report

When you've modified your report definition, you'll want to save it as a new object (instead of overwritting the old report definition). You can do this by posting your JSON string to `/gdc/md/<project-id>/obj`. The result should be a `201 Created` HTTP status code and a URL to your new report definition. Note that you'll need to include correct HTTP headers (for `Accept`, `ContentType` and `Cookie`). For examples and details, view the [Authentication]({{site.root}}/api/auth.html) and [Project Provisioning]({{site.root}}/api/projects.html) documentation.

## Viewing the Report

You can view the report manually by copying the URL from the previous step and replacing it in place of an existing report when viewing it (see the Browsing the API step and the first screenshot). Similarly, you can replace such a URL fragment in the `<iframe>` embed code, allowing you to embed on-the-fly generated reports.

## Summary

In short, in order to create reports on the fly and embed them into your application:

1. familiarize yourself with making GoodData API calls in [Authentication]({{site.root}}/api/auth.html) and [Project Provisioning]({{site.root}}/api/projects.html) documentation
2. view (any) report object, it's report result, and it's report definition to get a template for report definition object
3. adjust filter, rows & columns as necessary
4. post the resulting JSON to `/gdc/md/<project-id>/obj` to create a new report definition
5. place URL of this new report definition into your `<iframe>` embed code to view the report

Once you manage to prototype the solution, only steps 3-5 need to be performed at runtime when adjusting a report.