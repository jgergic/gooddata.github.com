---
title: Data modelling in GoodData
layout: documentation
breadcrumbs:
- name: API Documentation
  url: /api/
stub: model
---

# Managing the logical data model

This document describes the API for submitting the logical data model commands.
For documentation of the language used consult the [MAQL DDL](maql-ddl.html)
description.

## Changing the model

Logical data model is defined via custom data modeling language, [MAQL DDL](maql-ddl.html).
The MAQL DDL statements are submitted by <i>POST</i>-ing to
<i>/gdc/md/&lt;projectId&gt;/ldm/manage</i> resource.

If the execution is successful, server responds with <i>201</i>
status code and URIs of affected metadata object; otherwise an appropriate
error code with an explanation in body is returned.

<pre>$ <b>curl --cookie cookies.txt \
  --data-binary @- \
  --header 'Accept: application/yaml' \
  --header 'Content-Type: application/json' \
  https://secure.gooddata.com/gdc/md/</b><i>1d677d2fb51e48</i><b>/ldm/manage &lt;&lt;EOR
{
   "manage" : {
      "maql" : "CREATE ATTRIBTE {my_attribute}"
   }
}
EOR</b>
---
uris:
  - /gdc/md/<i>1d677d2fb51e48</i>/obj/<i>666</i></pre>

## Validating the model

Every time you change the logical model, you need to issue a <i>SYNCHRONIZE</i>
MAQL DDL command and ensure that both Logical and Physical model are structurally
sound. That is the purpose of <i>/gdc/md/&lt;projectId&gt;/ldm/manage</i> resource.
<i>POST</i> to the resource with list of desired validations (<i>LDM</i>
and <i>PDM</i> being most interesting in context of modelling) creates a validation
task and returns the URI which you should poll with <i>GET</i> for successful finish.

<pre>$ <b>curl --cookie cookies.txt \
  --data-binary @- \
  --header 'Accept: application/yaml' \
  --header 'Content-Type: application/json' \
  https://secure.gooddata.com/gdc/md/</b><i>1d677d2fb51e48</i><b>/validate &lt;&lt;EOR
{ "validateProject" : [ "LDM", "PDM" ] }
EOR</b>
---
uri: /gdc/md/<i>1d677d2fb51e48</i>/validate/<i>aaY7alIRepBN</i></pre>

While the task is running, you'll get a <i>NOTAVAILABLE</i> status:

<pre>$ <b>curl --cookie cookies.txt \
  --header 'Accept: application/yaml' \
  https://secure.gooddata.com/gdc/md/</b><i>1d677d2fb51e48</i><b>/validate/</b><i>aaY7alIRepBN</i>
---
validateResult:
  created: 2011-04-15 12:09:35
  messages: []

  state: RUNNING
  status: NOTAVAILABLE</pre>

Once the validation task finishes, the resulting resource returns report of
validation results, messages in human-readable form.

<pre>$ <b>curl --cookie cookies.txt \
  --header 'Accept: application/yaml' \
  https://secure.gooddata.com/gdc/md/</b><i>1d677d2fb51e48</i><b>/validate/</b><i>aaY7alIRepBN</i>
---
validateResult:
  created: 2011-04-15 12:09:35
  messages:
    -
      category: PDM_TABLE_REDUNDANT_COLS
      level: WARN
      message: Table '%s'(id:%s) referenced from attribute %s has redundant column(s) '%s'
      parameters:
        -
          common: warehouse_country
        -
          object:
            uri: /gdc/md/<i>1d677d2fb51e48</i>/obj/3347
        -
          object:
            uri: /gdc/md/<i>1d677d2fb51e48</i>/obj/60
        -
          common: currency_id
      validation: PDM
  state: FINISHED
  status: OK</pre>

## Implementation

Consult [executeMAQL method in the GdcRESTApiWrapper.java](http://github.com/gooddata/GoodData-CL/blob/master/backend/src/main/java/com/gooddata/integration/rest/GdcRESTApiWrapper.java) for the MAQL execution API example.
