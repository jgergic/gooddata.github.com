---
title: Introduction to GoodData REST API
layout: documentation
stub: api-start
---

# {{ page.title }}

# Overview
This document describes the GoodData REST API services that are necessary for implementation of the GoodData mobile client's UI.

## Login ([/gdc/account/login](https://secure.gooddata.com/gdc/account/login))

Logs a GoodData platform user into the platform. The service sets so called SST cookie that represents a client's session. The SST cookie has long-term validity (till loggout or expires after couple days).  Each subsequent request is authenticated via another TT cookie that has limited validity (~ seconds). If the TT token expires, the resource returns *401 Unauthorized*. In such case the REST client application must 
refresh the TT cookie by calling the [/gdc/account/token](https://secure.gooddata.com/gdc/account/token) that requires the valid SST token (this is the only service that checks the SST token).  

### REQUEST
*POST* [/gdc/account/login](https://secure.gooddata.com/gdc/account/login)

{%highlight js%}
    {"postUserLogin":{
      "password":"my_passsword",
      "login":"me@email.com",
      "remember":"0"
    }}
{%endhighlight%}

### RESPONSE

* *400 Bad Request* in case of bad username/password
* *200 OK* in case of successful login  

    {%highlight js%}
        {"userLogin":{
          "profile": "/gdc/account/profile/1234567890",
          "state": "/gdc/account/login/1234567890"
        }}
    {%endhighlight%}

## Refresh the TT token ([/gdc/account/token](https://secure.gooddata.com/gdc/account/token))

Refreshes the TT token. Requires the valid SST token. The TT cookie is set upon the successful execution.

### REQUEST [/gdc/account/token](https://secure.gooddata.com/gdc/account/token)
*GET* [/gdc/account/token](https://secure.gooddata.com/gdc/account/token)

### RESPONSE
* *401 Unauthorized* in case of bad or non-existing SST cookie
* *200 OK* in case of successful login  

## Logout ([/gdc/account/login/1234567890](https://secure.gooddata.com/gdc/account/login/1234567890))

Logging out an active GoodData platform user is achieved by DELETEing the state URI that user has received from the login service. Please note that the logout discards ALL user's sessions! 

### REQUEST
*DELETE* [/gdc/account/login/1234567890](https://secure.gooddata.com/gdc/account/login/1234567890)

### RESPONSE

* *404 Not Found* in case the user wasn't logged in or the session state URL is invalid
* *200 OK* in case of successful logout  

## Get User's Projects ([/gdc/md](https://secure.gooddata.com/gdc/md))

Returns the current user's projects. Requires the valid TT token (logged user). Each project is uniquely identified by so called project ID / identifier (e.g. bfmsivrgxq50wc9cuc5gsbljddz54jo8)

### REQUEST
*GET* [/gdc/md](https://secure.gooddata.com/gdc/md)

### RESPONSE

* *401 Unauthorized* invalid TT token (need to refresh the TT token via the [/gdc/account/token](https://secure.gooddata.com/gdc/account/token)
* *200 OK* the list of projects is returned  

    {%highlight js%}
        {"about": { 
          "summary": "Metadata Resources", 
          "category": "MD", 
          "links": [ 
            {"link": "/gdc/md/status", "summary": "Status of this resource", "category": "status", "title": "status"}, 
            {"link": "/gdc/md/config", "summary": "Apache settings for this resource","category": "config","title": "config"},
            {"link": "/gdc/md/bfmsivrgxq50wc9cuc5gsbljddz54jo8","identifier": "bfmsivrgxq50wc9cuc5gsbljddz54jo8",
             "summary": "A new project", "category": "project","title": "Free SFDC"},
             ... 
           ]
          }
        }
    {%endhighlight%}

*NOTE:* Please note that you'll need to filter the returned _link_ structures by the _category = "project"_

## Projects Details ([/gdc/projects/h0su3zssdycy6qtqbirhumx5p4j6vy63](https://secure.gooddata.com//gdc/projects/h0su3zssdycy6qtqbirhumx5p4j6vy63))

Returns a project details. Requires the valid TT token (logged user). 

### REQUEST
*GET* [/gdc/projects/h0su3zssdycy6qtqbirhumx5p4j6vy63](https://secure.gooddata.com//gdc/projects/h0su3zssdycy6qtqbirhumx5p4j6vy63)

### RESPONSE

* *401 Unauthorized* invalid TT token (need to refresh the TT token via the [/gdc/account/token](https://secure.gooddata.com/gdc/account/token)
* *200 OK* the project's detailed info is returned  

    {%highlight js%}
        {"project": {
          "content":{
            "guidedNavigation": "1",
            "isPublic": "0",
            "state": "ENABLED"},
            "links":{
              "roles": "/gdc/projects/11262/roles",
              "ldm": "/gdc/projects/11262/ldm",
              "ldm_thumbnail": "/gdc/projects/11262/ldm?thumbnail=1",
              "self": "/gdc/projects/h0su3zssdycy6qtqbirhumx5p4j6vy63",
              "metadata": "/gdc/md/h0su3zssdycy6qtqbirhumx5p4j6vy63",
              "invitations": "/gdc/projects/11262/invitations",
              "users": "/gdc/projects/11262/users",
              "templates": "/gdc/md/h0su3zssdycy6qtqbirhumx5p4j6vy63/templates"
            },
            "meta": {
              "created": "2010-12-17 11:33:24",
              "summary": "A new project",
              "updated": "2010-12-17 11:33:27",
              "author": "/gdc/account/profile/1676",
              "title": "ga - 2",
              "contributor": "/gdc/account/profile/1676"
            }
          }
        }
    {%endhighlight%}


*NOTE:* Please note that the project state must be _ENABLED_ in order the app can use the project.

## Dashboards ([/gdc/md/ab3xjtar62dfe3tgapblupogo2xvt7w2/query/projectdashboards](https://secure.gooddata.com/gdc/md/ab3xjtar62dfe3tgapblupogo2xvt7w2/query/projectdashboards))

Returns a list of project's dashboards. Requires the valid TT token (logged user). 

### REQUEST
*GET* [/gdc/md/ab3xjtar62dfe3tgapblupogo2xvt7w2/query/projectdashboards](https://secure.gooddata.com/gdc/md/ab3xjtar62dfe3tgapblupogo2xvt7w2/query/projectdashboards)

### RESPONSE

* *401 Unauthorized* invalid TT token (need to refresh the TT token via the [/gdc/account/token](https://secure.gooddata.com/gdc/account/token)
* *200 OK* the list of dashboards is returned   

    {%highlight js%}
        {"query":{
          "entries":[
            {
              "link":"/gdc/md/ab3xjtar62dfe3tgapblupogo2xvt7w2/obj/247",
              "author":"/gdc/account/profile/4179",
              "tags":"",
              "created":"2011-02-02 06:13:08",
              "deprecated":"0",
              "summary":"",
              "title":"Default dashboard",
              "category":"projectDashboard",
              "updated":"2011-02-02 09:50:05",
              "contributor":"/gdc/account/profile/10"
            }
          ],
          "meta":{
            "summary":"Metadata Query Resources for project 'ab3xjtar62dfe3tgapblupogo2xvt7w2'",
            "title":"List of projectdashboards",
            "category":"MD::Query::Object"
          }
        }}
    {%endhighlight%}


## Dashboard (any metadata object) Details ([/gdc/md/ab3xjtar62dfe3tgapblupogo2xvt7w2/obj/247](https://secure.gooddata.com/gdc/md/ab3xjtar62dfe3tgapblupogo2xvt7w2/obj/247))

Returns a dashboard's details. Requires the valid TT token (logged user). 

### REQUEST
*GET* [/gdc/md/ab3xjtar62dfe3tgapblupogo2xvt7w2/obj/247](https://secure.gooddata.com/gdc/md/ab3xjtar62dfe3tgapblupogo2xvt7w2/obj/247)

### RESPONSE

* *401 Unauthorized* invalid TT token (need to refresh the TT token via the [/gdc/account/token](https://secure.gooddata.com/gdc/account/token)
* *200 OK* the dashboard structure is returned 

    {%highlight js%}
        {"projectDashboard":{
          "content":{
            "tabs":[
              {
                "identifier":"amduauotiqqL",
                "title":"First Tab",
                "items":[
                  {
                    "reportItem":{
                      "positionX":0,
                      "obj":"/gdc/md/ab3xjtar62dfe3tgapblupogo2xvt7w2/obj/245",
                      "sizeY":500,
                      "sizeX":940,
                      "visualization":{
                        "oneNumber":{
                          "labels":{}
                        }
                      },
                      "positionY":0
                    }
                  }
                ]
              }
            ],
            "prompts":[]
          },
          "meta":{
            "author":"/gdc/account/profile/4179",
            "uri":"/gdc/md/ab3xjtar62dfe3tgapblupogo2xvt7w2/obj/247",
            "tags":"",
            "created":"2011-02-02 06:13:08",
            "identifier":"amcuauotiqqL",
            "deprecated":"0",
            "summary":"",
            "title":"Default dashboard",
            "category":"projectDashboard",
            "updated":"2011-02-02 09:50:05",
            "contributor":"/gdc/account/profile/10"
          }
        }}
    {%endhighlight%}

## Report Execution ([/gdc/xtab2/executor3](https://secure.gooddata.com/gdc/xtab2/executor3))

Executes report and returns the report results. Requires the valid TT token (logged user). 

### REQUEST
*POST* [/gdc/xtab2/executor3](https://secure.gooddata.com/gdc/xtab2/executor3)

{%highlight js%}
    {"report_req":{"reportDefinition":"/gdc/md/ab3xjtar62dfe3tgapblupogo2xvt7w2/obj/243"}}
{%endhighlight%}

or

{%highlight js%}
    {"report_req":{"report":"/gdc/md/ab3xjtar62dfe3tgapblupogo2xvt7w2/obj/245"}}
{%endhighlight%}

### RESPONSE

* *401 Unauthorized* invalid TT token (need to refresh the TT token via the [/gdc/account/token](https://secure.gooddata.com/gdc/account/token)
* *200 OK* the report result structure is returned 

    {%highlight js%}
        {
          "reportResult2":{
            "content":{
              "reportDefinition":"/gdc/md/ab3xjtar62dfe3tgapblupogo2xvt7w2/obj/243",
              "reportView":{
                "chart":{
                  "buckets":{
                    "y":[{"id":"yui_3_2_0_1_129660023251311038","uri":"metric"}],
                    "color":[],
                    "angle":[],
                    "x":[{"id":"yui_3_2_0_1_129660023251311039","uri":"/gdc/md/ab3xjtar62dfe3tgapblupogo2xvt7w2/obj/30"}]
                  },
                  "styles":{
                    "global":{
                      "linetype":"smooth",
                      "datalabels":{
                        "displayValues":1,
                        "fontsize":8,
                        "percent":0,
                        "displayBoxed":1,
                        "display":"inline",
                        "displayTotals":1
                      }
                    },
                    "yui_3_2_0_1_129660023251311039":{
                      "axis":{"majorlabel":{"rotation":-60}}}},"type":"line","axes":[]},
                      "reportName":"GoodData Corp. Facebook Page Visits",
                      "columnWidths":[],
                      "filters":[],
                      "rows":[],
                      "sort":{
                        "columns":[],
                        "rows":[]
                      },
                      "oneNumber":{
                        "labels":{}
                      },
                      "format":"chart",
                      "columns":[
                        {
                          "sort":"pk",
                          "displayFormId":"/gdc/md/ab3xjtar62dfe3tgapblupogo2xvt7w2/obj/30",
                          "attributeTitle":"Date (Facebook)",
                          "baseElementURI":"/gdc/md/ab3xjtar62dfe3tgapblupogo2xvt7w2/obj/27/elements?id=",
                          "title":"Date (Facebook)",
                          "attributeId":"/gdc/md/ab3xjtar62dfe3tgapblupogo2xvt7w2/obj/27",
                          "totals":[[]]
                        },
                        "metricGroup"
                      ],
                      "metrics":[
                        {
                          "format":"#,##0",
                          "title":"Page Views",
                          "metricId":"/gdc/md/ab3xjtar62dfe3tgapblupogo2xvt7w2/obj/232"
                        }
                      ]
                    },
                    "parentReport":null,
                    "dataResult":"/gdc/md/ab3xjtar62dfe3tgapblupogo2xvt7w2/dataResult/244"
                  },
                  "meta":{
                    "author":"/gdc/account/profile/10",
                    "uri":"/gdc/md/ab3xjtar62dfe3tgapblupogo2xvt7w2/obj/250",
                    "tags":"",
                    "created":"2011-02-02 13:46:16",
                    "identifier":"acov0cvubjgx",
                    "deprecated":"0",
                    "summary":"",
                    "title":"temporary result",
                    "category":"reportResult2",
                    "updated":"2011-02-02 13:46:16",
                    "contributor":"/gdc/account/profile/10"
                  }
                }
              }
    {%endhighlight%}

## Report Export (PDF | PNG | XLS ) ([/gdc/exporter/executor3](https://secure.gooddata.com/gdc/exporter/executor3))

Executes report and returns the report exported to one of the supported formats. Requires the valid TT token (logged user). 

### REQUEST
*POST* [/gdc/exporter/executor3](https://secure.gooddata.com/gdc/exporter/executor3)

{%highlight js%}
    {"result_req":{"format":"pdf","report":"/gdc/md/ab3xjtar62dfe3tgapblupogo2xvt7w2/obj/249"}}
{%endhighlight%}

### RESPONSE

* *401 Unauthorized* invalid TT token (need to refresh the TT token via the [/gdc/account/token](https://secure.gooddata.com/gdc/account/token)
* *200 OK* the exported report result URL is returned 

{%highlight js%}
    "/gdc/exporter/chart_result/ab3xjtar62dfe3tgapblupogo2xvt7w2/8ea0a94f0963f86c8d65450f2ac88dd9"
{%endhighlight%}

The client APP can poll the result URL using the HEAD request until the service returns the *202 Accepted*. Once the URL returns *200 OK* the exported document is ready.

*NOTE:* We are pretty flexible regarding the exported document format. We primarily export to SVG and then converting the SVG to any format. 
