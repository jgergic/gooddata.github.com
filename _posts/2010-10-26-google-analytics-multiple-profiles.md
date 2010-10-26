---
title: Google Analytics Connector Now Supports Multiple Profiles
excerpt: In this follow-up to our update on SLI APIs, we detail the migration process of existing projects to thew new CL tool v1.2
layout: post
---

#Google Analytics Connector Now Supports Multiple Profiles

Based on popular demand, the new [CL tool v1.2]({{ site.root }}/blog/2010/10/15/data-upload-apis/)  contains an updated version of Google Analytics connector which supports multiple Google Analytics profiles (and thus the ability to analyze multiple different websites).

The new connector uses the same old Google Analytics project template. Thus, once your create the project from the template, you'll need to run a simple MAQL DDL script to extend the data model with the multi-profile extensions. You'll also need to create a simple CSV that lists all profiles that you want to load to GoodData and load it to the project as additional dataset.

For more detailed instructions, see the end of the [GA connector README](http://github.com/gooddata/GoodData-CL/tree/sli/cli-distro/examples/ga/). 
**Note**: you have to use the [GoodData CL v1.2]({{ site.root }}/blog/2010/10/15/data-upload-apis/) -- currently in alpha build.

<table border="1" cellspacing="0" cellpadding="5">
    <tr><th>profileId</th><th>profileName</th></tr>
    <tr><td>ga:7654321</td><td>Example Site</td></tr>
    <tr><td>ga:1234567</td><td>Second Site</td></tr>
</table>

The Google Analytics dashboards need a bit work to better support multiple profiles. Can you help us improve it? <a href="mailto:support@gooddata.com">Drop us a note</a>.