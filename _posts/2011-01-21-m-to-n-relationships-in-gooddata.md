---
title: Modeling M:N relationships in GoodData
excerpt: How-to guide to constructing M:N relationships in model in GoodData and examples on how to use this in metrics using MAQL with enforced aggregations
layout: post
---

# {{ page.title }}

When using GoodData, constructing a good data model is cruicial to the healthy functioning of your project. How you create your model directly influences the way you construct your reports and metrics - particularly how GoodData aggregates your data (and assumes aggregations). Typical 1:N relationships are fairly easy - represented as oriented edges in your model graph - each `Year` has multiple `Months`, each `Month` has multiple `Days`:

![Date Dimension Model Example]({{ site.root }}/images/posts/2011-01-21-m-to-n-modeling-ymd-ldm.png)

However sometimes you need to try to model M:N relationships. A typical usecase like this is tagging. There are typically multiple tags associated with one object and multiple objects tagged with one specific tag.

## The Data Model

To take a specific example, let's take support tickets - the `Ticket` and `Tag` attributes. As in relational databases, in order to create 1:N relationships, a third, joining attribute `TicketTag` must be introduced. This attribute contains unique `Ticket`-`Tag` pairs (ie. if ticket X is tagged with tag Y, there is an XY entry in this ticket). For each entry in this attribute, there is a 1:N relationship with tickets (each one `Ticket` can have multiple `TicketTag` pairs, but each pair corresponds to only one ticket) and 1:M relantionship with tags.

Let us now assume that each ticket has some facts associated with it - for example `ResolutionTime` (the number of hours it took to close it) - and we would like to display a report showing the total resolution time of tickets marked with a certain tag. Additionally, for implementation reasons, let's also create a `Dummy` fact associated with this `TicketTag` attribute. It can really be just a column of values "1" or anything.

Thus, our data model now looks like this:

![Data Model]({{ site.root }}/images/posts/2011-01-21-m-to-n-modeling-ldm.png)

## Naive Approach

Using a straightforward approach would be to define a metric AVG(ResolutionTime) and then create a report with that metric and Tags. But this is what happens:

![Tags Attribute Disabled]({{ site.root }}/images/posts/2011-01-21-m-to-n-modeling-tags-disabled.png)

As you can see the `Tags` attribute is disabled. This happens because GoodData does not know how to split the `ResolutionTime` by `Tag` - if a ticket has tags (red,hot,chili) and a resolution time of 10 hours - how do the hours divide between the 3 tags?

## Enforce Aggregation

Fortunatelly, there is a way in advanced MAQL to override this default behavior via enforced aggregation rules. First, let's modify our metric like this:

    {% comment %}
	SELECT AVG(ResolutionTime) BY Ticket, ALL IN ALL OTHER DIMENSIONS
    {% endcomment %}

<div class="highlight"><pre><span class="k">SELECT</span> <span class="k">AVG</span><span class="p">(</span><span class="nv">ResolutionTime</span><span class="p">)</span> <span class="k">BY</span> <span class="nv">Ticket</span><span class="p">,</span> <span class="k">ALL IN ALL OTHER DIMENSIONS</span>
</pre></div>

The `BY` section now specifies that the metric should be aggregated on a per-ticket level and should ignore any attributes from other dimensions when being computed. Now it is already possible to add the `Tag` to the report, but still the result is still not what we intended:

![Tags Metric Identical]({{ site.root }}/images/posts/2011-01-21-m-to-n-modeling-tags-identical.png)

The metric behaves exactly as - it aggregates `ResolutionTime` for each `Ticket`, but as tickets are not directly connected to tags, it ignores any attributes from other dimensions (`ALL IN ALL OTHER`) - and produces a average of **all data** in your warehouse.

## Wrap In a Different Aggregation

If we were to add Tickets to the report above, we would see each ticket containing all tags - since for each ticket-tag combination, the metric just computes value over the whole warehouse. Now comes **the trick** - use this as a sub-metric and add a fact at the TicketTags level (and multiplying it by 0 we eliminate it from influencing the result):

    {% comment %}
    SELECT AVG(
    	(SELECT SUM(ResolutionTime) BY Ticket, ALL IN ALL OTHER DIMENSIONS)
    	+
    	(0 * Dummy)
    )
    {% endcomment %}

<div class="highlight"><pre><span class="k">SELECT AVG</span><span class="p">(</span>
	<span class="p">(</span><span class="k">SELECT SUM</span><span class="p">(</span><span class="nv">ResolutionTime</span><span class="p">)</span> <span class="k">BY</span> <span class="nv">Ticket</span><span class="p">,</span> <span class="k">ALL IN ALL OTHER DIMENSIONS</span><span class="p">)</span>
	<span class="o">+</span>
	<span class="p">(</span><span class="mi">0</span> <span class="o">*</span> <span class="nv">Dummy</span><span class="p">)</span>
<span class="p">)</span>
</pre></div>

Now it's useful to view the resulting report split by both Tickets and Tags:

![Metric Split By Ticket and Tags]({{ site.root }}/images/posts/2011-01-21-m-to-n-modeling-tickettags.png)

As you can see, the metric is still identical for all tags in one specific ticket (since the internal metric is aggregated by `Ticket`). However only pairs of tickets-tags that actually have a `Dummy` fact associated with them are listed. Removing the `Ticket` attribute from the report now finally results in our intended report:

![Final Report]({{ site.root }}/images/posts/2011-01-21-m-to-n-modeling-final.png)

## Summary

In retrospect, let's have a look how we achieved M:N modeling in GoodData:

1. we split the Ticket-Tag M:N relationship into two 1:N and 1:M relationships using a "joining" `TicketTag` attribute and included a "dummy" fact with this attribute
2. we defined an "inner" metric with enforced aggregation by the `Ticket` (and by `ALL IN ALL OTHER DIMENSIONS`)
3. we wrapped the inner metric in an outter metric, used the `Dummy` fact to filter out just the ticket-tag pairs that exist and "repositioned" the aggregation to TicketTag level
4. we constructed the final report sliced by `Tag`


You can read more on this topic in our documentation on [MAQL metrics]({{site.root}}/docs/maql.html). Examples of setting up hierarchies using GoodData CL can be found in the [HR example]({{site.root}}/gooddata-cl/examples/hr/).