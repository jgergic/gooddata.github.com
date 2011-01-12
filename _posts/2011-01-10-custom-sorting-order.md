---
title: Defining Custom Sorting Order For An Attribute
excerpt: You can use advanced MAQL DDL features to define custom sorting order for your attribute
layout: post
---

# {{ page.title }}

I am often asked how to define a custom sort order in GoodData. Today I'll show you how to setup custom sorting for an attribute using MAQL DDL and an additional sorting data column.

Alphabetical or numeric ordering isn't always the most appropriate way to sort data. This occurs especially in situations where data has some custom, inherent order that people understand. One example could be customer stages in a CRM system or ticket status in a support/bug tracking system:

    1. New
    2. Open
    3. Pending
    4. Closed

These items have an inherent, obvious order which is not alphabetical. Let's take a simplified dataset in the form of this `data.csv`:

    Status,Age
    New,140
    Open,182
    Pending,198
    Closed,270

You can imagine yourself what the [schema XML file](/gooddata-cl/xml-config.html) looks like (`Status` is an attribute, `Age` is a fact). By default GoodData is going to create a report like this:

![Report With Wrong Sorting]({{site.root}}/images/posts/2011-01-10-report-wrong-sorting.png)

The intuitive way to sort this is to start dragging rows around in the report to sort the data Excel-style. However this isn't a good idea in an analytical system - data can change, new statuses can emerge etc. Instead, the appropriate place to solve this sorting issue is in the data layer. We're going to use another column in our dataset called `Status Ordering`. Let's change the `data.csv` to look like this:

    Status,Status Ordering,Age
    New,1,140
    Open,2,182
    Pending,3,198
    Closed,4,270

Correspondingly, we need to add one more column definition to the `schema.xml` file, setting up the `Status Ordering` column as a `LABEL` to the `Status` attribute:

{% highlight xml %}
<column>
  <name>statussort</name>
  <title>Status Sort</title>
  <ldmType>LABEL</ldmType>
  <reference>status</reference>
</column>
{% endhighlight %}

As always, when modifying the schema XML, we now need to project these changes into our project. We can create a new project from scratch, but sometimes that's not practical. Or we can use the little known [`GenerateUpdateMaql` command](http://developer.gooddata.com/gooddata-cl/cli-commands.html#logical_model_management_commands):

{% highlight ruby %}
OpenProject(id="<project-id>");
UseCsv(csvDataFile="data.csv",configFile="schema.xml");
GenerateUpdateMaql(maqlFile="update.maql");
{% endhighlight %}

This generates the `update.maql` file describing the changes to your data model that add the new `LABEL` column. Before following through with applying the changes to the project and loading the new data, we will make one more change specifying the new `LABEL` column as a sorting column for the `Status` attribute. You can add it at the end of the file just **above** the `SYNCHRONIZE` command: (Note that the specific MAQL identifiers can be different for your model - you can find them by inspecting the generated `update.maql`)

    {% comment %}
    Original MAQL pre-Pygmentize:
    
    ALTER ATTRIBUTE {attr.dataset.status} ORDER BY {label.dataset.status.statussort} ASC;
    {% endcomment %}
    
<div class="highlight"><pre><code class="maql"><span class="k">ALTER</span> <span class="k">ATTRIBUTE</span> <span class="nv">{attr.dataset.status}</span> <span class="k">ORDER BY</span> <span class="nv">{label.dataset.status.statussort}</span> <span class="k">ASC</span><span class="p">;</span></code></pre></div>
    

Save the file and run the following script to make the model changes and load the new data:

{% highlight ruby %}
OpenProject(id="<project-id>");
UseCsv(csvDataFile="data.csv",configFile="schema.xml");
ExecuteMaql(maqlFile="update.maql");
TransferData();
{% endhighlight %}

Now our `Status` attribute sorts naturally as expected with GoodData sorting all rows behind the scenes according to the Status Sorting column in your source data:

![Report With Correct Sorting]({{site.root}}/images/posts/2011-01-10-report-correct-sorting.png)