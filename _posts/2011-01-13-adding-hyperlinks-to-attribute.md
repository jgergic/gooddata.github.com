---
title: Adding Hyperlink to Your Attributes
excerpt: A short guide to using custom MAQL DDL to add hyperlinks your report headers, which can integrate with external applications
layout: post
---

# {{ page.title }}

When analyzing data from online applications (Salesforce, Zendesk, etc.) it makes a lot of sense to set up some attributes to be clickable hyperlinks leading back to the original data. Take this example of Susan's open support tickets in Zendesk, along with the age of the tickets:

![Open Tickets]({{ site.root }}/images/posts/2011-01-13-open-tickets.png)

Wouldn't it be nice if you could click on the ID of the individual support ticket and open it directly back in Zendesk? Well let's have a look how we can get this done.

First, we'll need to extend our original data with a new column `URL` containing the link for each ticket:

    Ticket ID, Asignee, URL, ...
    ...
    764613,Abbott Susan B., http://yourcompany.zendesk.com/tickets/764613
    765427,Abbott Susan B., http://yourcompany.zendesk.com/tickets/765427
    ...

Now we need to edit our XML schema to add information about the new column. We will set this up as a `LABEL` ldmType, adding it as another view to our original attribute that should have the hyperlink (in this case Ticket ID). Note the `<reference>` field containing the `<name>` of the attribute:

{% highlight xml %}
...
<column>
  <name>url</name>
  <title>URL</title>
  <ldmType>LABEL</ldmType>
  <reference>ticketid</reference>
</column>
...
{% endhighlight %}

Next, we'll need to modify the data model in our project. The easiest way to do this is by using the `GenerateUpdateMaql` command, which analyzes changes to your XML schema (compared to the current status in your project) and produces an "update MAQL" that will modify your model accordingly:

{% highlight ruby %}
OpenProject(id="<project-id>");
UseCsv(csvDataFile="data.csv",configFile="schema.xml");
GenerateUpdateMaql(maqlFile="update.maql");
{% endhighlight %}

You can review the `update.maql` file at this point. Before you run it in your project however, we need to add one extra line specifying the newly created LABEL as a _hyperlink_. You can insert it just above the `SYNCHRONIZE` line at the end:

    {% comment %}
    Original MAQL pre-Pygmentize:
    ALTER ATTRIBUTE {attr.dataset.ticketid} ALTER LABELS {label.dataset.ticketid.url} HYPERLINK;
    {% endcomment %}

<div class="highlight"><pre><code class="maql"><span class="k">ALTER</span> <span class="n">ATTRIBUTE</span> <span class="nv">{attr.dataset.ticketid}</span> <span class="k">ALTER</span> <span class="n">LABELS</span> <span class="nv">{label.dataset.ticketid.url}</span> <span class="n">HYPERLINK</span><span class="p">;</span></code></pre></div>

(**Note:** the MAQL identifiers `{attr.dataset.ticketid}` and `{label.dataset.ticketid.url}` will need to be replaced by your own identifiers, to be found in the same update MAQL file.)

All that remains is to run this modified MAQL script in your project and upload the new data including hyperlink labels:

{% highlight ruby %}
OpenProject(id="<project-id>");
UseCsv(csvDataFile="data.csv",header="true",configFile="schema.xml");
ExecuteMaql(maqlFile="update.maql");
TransferData();
{% endhighlight %}

The same report as before now shows hyperlinks on each ticket ID that can be clicked to open a new window with the original ticket in Zendesk. If the window doesn't open for you, your browser is probably blocking pop-up windows and you might need to allow `secure.gooddata.com` to open popups (below is an example from Chrome).

![Allow Popups]({{ site.root }}/images/posts/2011-01-13-allow-popups.png)