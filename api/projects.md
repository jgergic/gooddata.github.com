---
title: Project provisioning in GoodData
layout: documentation
breadcrumbs:
- name: API Documentation
  url: /api/
stub: api-projects
---

# Provisioning GoodData projects

Projects in GoodData are accessible as HTTP resources, uniquely identified by
an URI. The project resources are authenticated, so you should obtain a valid
authentication token before accessing them; consult the [Authentication API](auth.html)
documentation to learn how to do so.

## Creating a project

Creating a project is basically a matter of a <i>POST</i> to <i>/gdc/projects</i>.
The <i>summary</i> and <i>title</i> keys of project metadata are mostly
self-describing.

The <i>guidedNavigation</i> provides a hint to help client accessing a project
decide whether to hide controls that can lead to uncomputable reports when used.

If the project creation is successful, server responds with <i>201</i>
status code and URI of the newly created project.

<pre>$ <b>curl --cookie cookies.txt \
  --data-binary @- \
  --header 'Accept: application/yaml' \
  --header 'Content-Type: application/json' \
  https://secure.gooddata.com/gdc/projects/ &lt;&lt;EOR
{
   "project" : {
      "content" : {
         "guidedNavigation": </b><i>1</i><b>
      },
      "meta" : {
         "summary" : "</b><i>Bug mortality stats</i><b>",
         "title" : "</b><i>Bugs</i><b>"
      }
   }
}
EOR</b>
---
uri: /gdc/projects/666</pre>

Once the project creation is submitted, you need to wait until
the project is prepared before you can [construct the data model]({{ site.root }}/api#data)
and load the data. This is done by repeatedly <i>GET</i>-ting
(polling) the project URI you just obtained until it the project
state is <i>ENABLED</i> (initially the allocated project will be in
<i>LOADING</i> state):

<pre>$ <b>curl --cookie cookies.txt \
  --header 'Accept: application/yaml' \
  https://secure.gooddata.com/gdc/projects/666</b>
---
project:
  content:
    guidedNavigation: 1
    isPublic: 0
    state: LOADING
  links:
    invitations: /gdc/projects/666/invitations
    ldm: /gdc/projects/666/ldm
    ldm_thumbnail: /gdc/projects/666/ldm?thumbnail=1
    metadata: /gdc/md/bc60c32b222f335092ee0c3195111ac1
    roles: /gdc/projects/666/roles
    self: /gdc/projects/666
    users: /gdc/projects/666/users
  meta:
    author: /gdc/account/profile/409
    contributor: /gdc/account/profile/409
    created: 2048-10-16 12:34:56
    summary: Bug mortality stats
    title: Bugs
    updated: 2048-10-16 12:34:56</pre>

## Modifying a project

Project is modified by <i>POST</i>-ing the very same structure you use when
creating a project to the project's URI (that you've obtained upon project
creation):

<pre>$ <b>curl --cookie cookies.txt \
  --data-binary @- \
  --header 'Accept: application/yaml' \
  --header 'Content-Type: application/json' \
  https://secure.gooddata.com/gdc/projects/</b><i>666</i><b> &lt;&lt;EOR
{
   "project" : {
      "content" : {
         "guidedNavigation": </b><i>1</i><b>
      },
      "meta" : {
         "summary" : "</b><i>Bug mortality stats</i><b>",
         "title" : "</b><i>Bugs</i><b>"
      }
   }
}
EOR</b>
---
uri: /gdc/projects/666</pre>

## Deletion of a project

Following a RESTful API design, deletion of a project is done by
issuing a <i>DELETE</i> request to the project URI (getting an
empty response upon success):

<pre>$ <b>curl --cookie cookies.txt \
  --header 'Accept: application/yaml' \
  -X DELETE \
  https://secure.gooddata.com/gdc/projects/</b><i>666</i>
--- ''</pre>

## Implementation

Consult [_createProject_ and _dropProject_ methods in the GdcRESTApiWrapper.java](http://github.com/gooddata/GoodData-CL/blob/master/backend/src/main/java/com/gooddata/integration/rest/GdcRESTApiWrapper.java) for a practical use example of the project provisioning API.
