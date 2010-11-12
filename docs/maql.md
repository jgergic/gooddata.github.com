---
layout: documentation
stub: data-model
---

# Introduction to Metrics and MAQL

MAQL (Multi-Dimensional Query Language) is our flexible tool for describing metrics in GoodData. Each metric consists of two main parts: aggregation and (optionally) filters.

##Aggregation

Since GoodData reports are multi-dimensional pivot tables (not just plain spreadsheets), each metric must define an aggregation. This way, you view your metric (let's say Sales) not only for an individual line item, but also aggregate sales for the whole day, week, month, for all salesmen in a department - or even across the whole company. The aggregation is what allows you to change resolution of your report.

###MIN,MAX,SUM

Let's start with a simple, classic example: you're support/ticketing/bugzilla data contains a fact field called `resolution_time`. You'd like to define a metric of average resolution time (over a time period, across a type of question etc.)

<div class="highlight"><pre><span class="k">SELECT</span> <span class="nf">AVG</span><span class="p">(</span><span class="nv">Resolution time</span><span class="p">)</span>
</pre></div>



While measuring the average resolution time might be the most typical scenario, showing minimum resolution time, maximum resolution time or total resolution time would be similar:

<div class="highlight"><pre><span class="k">SELECT</span> <span class="nf">MIN</span><span class="p">(</span><span class="nv">Resolution time</span><span class="p">)</span>
<span class="k">SELECT</span> <span class="nf">MAX</span><span class="p">(</span><span class="nv">Resolution time</span><span class="p">)</span>
<span class="k">SELECT</span> <span class="nf">SUM</span><span class="p">(</span><span class="nv">Resolution time</span><span class="p">)</span>
</pre></div>

###COUNT

For certain metrics, you might want to count the number of rows entering that are being aggregated. There is a `COUNT` function precisely for that. In it's default incarnation, it will count the number of *unique* values in an attribute:

<div class="highlight"><pre><span class="k">SELECT</span> <span class="nf">COUNT</span><span class="p">(</span><span class="nv">Ticket_ID</span><span class="p">)</span>
</pre></div>

If `Ticket_ID` is a primary key of it's dataset (we call that a `CONNECTION_POINT`) then this will count the number of rows of that dataset. As you can quickly see though, it's more powerful then just counting rows of a dataset - you could count the number of unique customers that filed support tickets - and obviously <code class="highlight"><span class="nf">COUNT</span><span class="p">(</span><span class="nv">Ticket_ID</span><span class="p">)</span> <span class="o">&gt;=</span> <span class="nf">COUNT</span><span class="p">(</span><span class="nv">Customer</span><span class="p">)</span></code>.

The issue gets a bit more complicated with multiple datasets. Let's say we have a **shared dataset** - for example the `Employees` dimension. It is connected to both `Tickets` dataset (support tickets were handled by employees) and to `Payroll` dataset, containing salary data:

![Shared Dimension]({{ site.root }}/images/docs/maql/shared-dim.png)

Now in this setup adding a metric <code class="highlight"><span class="k">SELECT</span> <span class="nf">COUNT</span><span class="p">(</span><span class="nv">Employee</span><span class="p">)</span></code> to a report will render both dataset Tickets and Payroll unusable. The reason is that COUNT will scan all lines of the Employee attribute, but only some of them might be actually connected to `Ticket_ID` or `Invoice_ID`. Thus, a second, optional (but very useful) parameter is used in the `COUNT` function:

<div class="highlight"><pre><span class="k">SELECT</span> <span class="nf">COUNT</span><span class="p">(</span><span class="nv">Employee</span><span class="p">,</span><span class="nv">Ticket_ID</span><span class="p">)</span></pre></div>

This will count the number of unique employees that are listed in the Ticket dataset (connected to Ticket_ID). As a result, no employees out of the `Ticket` dataset scope are used and you can use all other attributes/metrics from the dataset.

![Shared Dimension]({{ site.root }}/images/docs/maql/count-focused.png)

###BY

By default, each metric is aggregated over a scope of inherited by it's position in the pivot table. The on intersection of `Month(March)` and `City(Boston)` will aggregate all rows that have those corresponding attribute values. This allows metrics to be easily drilled into (drill into March to individual days and the metric starts showing numbers for individual days). You might want to override this behavior though when using the metric as part of some larger calculation. For example when showing how many percentages of tickets in a quarter were done each months - you need both the month and quarter aggregation levels in a metric:

    SELECT SUM(Ticket_ID) / SELECT SUM(Ticket_ID) BY Quarter



4. BY ALL IN ALL OTHER DIMENSIONS
5. BY attr, ALL IN ALL OTHER DIMENSIONS

2. Filtering