---
title: Data Integration FAQ
layout: documentation
stub: faq
---


# Paralel Data Loads

### Can I Upload Data In Paralel? What if it depends on each other?

You can start multiple different uploads in paralel. If they upload into different projects, there shouldn't be any issue. If they upload into the same project, the data will be received in paralel but then "integrated" into the project one-by-one, in the order in which the integration was scheduled (by GoodData CL or through API). This is roughly equivalent to the order in which uploads finished.

# Data Size Limits

### What Data Types and Sizes Does GoodData Support

Below is a table giving you a rough idea on best practices. If you fall outside the boundaries, be sure to [get in touch](mailto:support@gooddata.com) with us - usually we can find a solution to work around problems. Specifically larger data sets (more rows) can be supported dependent on how the data model is constructed and/or pre-aggregation can be used before data upload.

<style>
  table#limits { margin: 20px 0px; }
  table#limits td, table#limits th { padding: 10px; }
</style>

<table id="limits">
  <tr>
    <th># of columns</th>
    <td>60 attributes, references &amp; connection_points / dataset</td>
  </tr>
  <tr>
    <th># of rows</th>
    <td>10^6 rows is fine, 10^7 rows is getting slow</td>
  </tr>
  <tr>
    <th>attribute size</th>
    <td>128 characters by default, <a href="{{site.root}}/api/maql-ddl.html#performance">extensible</a> to 256 characters</td>
  </tr>
  <tr>
    <th>fact size</th>
    <td>DECIMAL(12,2) by default (-10^10..10^10, 2 decimal places)<br><a href="{{site.root}}/api/maql-ddl.html#performance">extensible</a> to DECIMAL(15,6) (-10^15..10^15, 6 decimal places )</td>
  </tr>
</table>
