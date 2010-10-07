---
title: Authenticating to GoodData API
layout: documentation
breadcrumbs:
- name: API Documentation
  url: /api/
stub: api-auth
---

# Authenticating to the GoodData API

The GoodData authentication API provides access to the GoodData's token-based authentication.
It uses two distinct tokens to authenticate a user. The first one, called <i>Super-secure token</i>
is valid for whole session while the second (so called <i>Temporary token</i>) has a more limited
lifespan, typically 30 seconds.

Typically, you only use Temporary token to access resources and refresh them using Super-secure
token once it expires.

## Logging in

Login action is the process of obtaining a Super-secure token via <tt>GDCAuthSST</tt> cookie
in response to <i>POST</i> to request to <tt>/gdc/account/login</tt> resource.

This is how would you request the token with <i>curl</i>:

<pre>$ <b>curl --cookie-jar cookies.txt \
  --header 'Accept: application/yaml' \
  --data-urlencode 'USER=</b><i>user@example.com</i><b>' \
  --data-urlencode 'PASSWORD=</b><i>S3kr1TZ</i><b>' \
  https://secure.gooddata.com/gdc/account/login</b>
--- 
userLogin: 
  profile: /gdc/account/profile/409
  state: /gdc/account/login/409
</pre>

You can now look into <tt>cookies.txt</tt> to check the cookie you've obtained.
Note that its path would be set to <tt>/</tt>, so it will now be sent with each request.
This will be fixed in future releases.

## Obtaining a Temporary Token

To obtain the Temporary token, send a <i>GET</i> request to <tt>/gdc/account/token</tt>.
You'll get an empty response with <tt>GDCAuthTT</tt> cookie:

<pre>$ <b>curl --cookie cookies.txt \
  --cookie-jar cookies.txt \
  --header 'Accept: application/yaml' \
  https://secure.gooddata.com/gdc/account/token</b>
--- ''</pre>

## Using the Temporary Token

Once you have the Temporary token, you can access the rest of the API.

<pre>$ <b>curl --cookie cookies.txt \
  --header 'Accept: application/yaml' \
  https://secure.gooddata.com/gdc/md</b>
--- 
about: 
  category: MD
  links: 
    - 
      category: status
      link: /gdc/md/status
      summary: Status of this resource
      title: status
    - 
      category: config
      link: /gdc/md/config
      summary: Apache settings for this resource
      title: config
    - 
      category: project
      identifier: FoodMartDemo
      link: /gdc/md/FoodMartDemo
      summary: FoodMartDemo001
      title: FoodMartDemo
  ...
  summary: Metadata Resources</pre>

Note that once the Temporary token expires you'll get a response with status code 401.
In that case just need to re-request it by visiting <tt>/gdc/account/token</tt> and
repeat the failing request.

<pre>$ <b>curl --cookie cookies.txt \
  --header 'Accept: application/yaml' \
  https://secure.gooddata.com/gdc/md</b>
&lt;!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN"&gt;
&lt;html&gt;&lt;head&gt;
&lt;title&gt;401 Authorization Required&lt;/title&gt;
...</pre>


## Implementation

See the [_login_ methods in the GdcRESTApiWrapper.java](http://github.com/gooddata/GoodData-CL/blob/master/backend/src/main/java/com/gooddata/integration/rest/GdcRESTApiWrapper.java) for a real-world example of authentication API implementation in Java.
