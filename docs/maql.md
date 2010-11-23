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

{% comment %}
Original MAQL pre-pygmentize

    SELECT AVG(Resolution time)

{% endcomment %}

<div class="highlight"><pre><span class="k">SELECT</span> <span class="nf">AVG</span><span class="p">(</span><span class="nv">Resolution time</span><span class="p">)</span>
</pre></div>

While measuring the average resolution time might be the most typical scenario, showing minimum resolution time, maximum resolution time or total resolution time would be similar:

{% comment %}
Original MAQL pre-pygmentize:

    SELECT MIN(Resolution time)
    SELECT MAX(Resolution time)
    SELECT SUM(Resolution time)

{% endcomment %}

<div class="highlight"><pre><span class="k">SELECT</span> <span class="nf">MIN</span><span class="p">(</span><span class="nv">Resolution time</span><span class="p">)</span>
<span class="k">SELECT</span> <span class="nf">MAX</span><span class="p">(</span><span class="nv">Resolution time</span><span class="p">)</span>
<span class="k">SELECT</span> <span class="nf">SUM</span><span class="p">(</span><span class="nv">Resolution time</span><span class="p">)</span>
</pre></div>

###COUNT

For certain metrics, you might want to count the number of rows entering that are being aggregated. There is a `COUNT` function precisely for that. In it's default incarnation, it will count the number of *unique* values in an attribute:

{% comment %}
Original MAQL pre-pygmentize:

    SELECT COUNT(Ticket_ID)

{% endcomment %}

<div class="highlight"><pre><span class="k">SELECT</span> <span class="nf">COUNT</span><span class="p">(</span><span class="nv">Ticket_ID</span><span class="p">)</span>
</pre></div>

If `Ticket_ID` is a primary key of it's dataset (we call that a `CONNECTION_POINT`) then this will count the number of rows of that dataset. As you can quickly see though, it's more powerful then just counting rows of a dataset - you could count the number of unique customers that filed support tickets - and obviously <code class="highlight"><span class="nf">COUNT</span><span class="p">(</span><span class="nv">Ticket_ID</span><span class="p">)</span> <span class="o">&gt;=</span> <span class="nf">COUNT</span><span class="p">(</span><span class="nv">Customer</span><span class="p">)</span></code>.

The issue gets a bit more complicated with multiple datasets. Let's say we have a **shared dataset** - for example the `Employees` dimension. It is connected to both `Tickets` dataset (support tickets were handled by employees) and to `Payroll` dataset, containing salary data:

![Shared Dimension]({{ site.root }}/images/docs/maql/shared-dim.png)

Now in this setup adding a metric <code class="highlight"><span class="k">SELECT</span> <span class="nf">COUNT</span><span class="p">(</span><span class="nv">Employee</span><span class="p">)</span></code> to a report will render both dataset Tickets and Payroll unusable. The reason is that COUNT will scan all lines of the Employee attribute, but only some of them might be actually connected to `Ticket_ID` or `Invoice_ID`. Thus, a second, optional (but very useful) parameter is used in the `COUNT` function:

{% comment %}
Original MAQL pre-pygmentize:

    SELECT COUNT(Employee,Ticket_ID)

{% endcomment %}
<div class="highlight"><pre><span class="k">SELECT</span> <span class="nf">COUNT</span><span class="p">(</span><span class="nv">Employee</span><span class="p">,</span><span class="nv">Ticket_ID</span><span class="p">)</span></pre></div>

This will count the number of unique employees that are listed in the Ticket dataset (connected to Ticket_ID). As a result, no employees out of the `Ticket` dataset scope are used and you can use all other attributes/metrics from the dataset.

![Shared Dimension]({{ site.root }}/images/docs/maql/count-focused.png)

###BY

By default, each metric is aggregated over a scope of inherited by it's position in the pivot table. The on intersection of `Month(March)` and `City(Boston)` will aggregate all rows that have those corresponding attribute values. This allows metrics to be easily drilled into (drill into March to individual days and the metric starts showing numbers for individual days). You might want to override this behavior though when using the metric as part of some larger calculation.

For example when showing how many hours were spend on resolving tickets in a particular month, out of all hours in a quarter - you need both the month and quarter aggregation levels in a metric:

{% comment %}
Original MAQL pre-pygmentize:

    SELECT (SELECT SUM(Resolution time)) / (SELECT SUM(Resolution time) BY Quarter)

{% endcomment %}

<div class="highlight"><pre><span class="k">SELECT</span> <span class="p">(</span><span class="k">SELECT</span> <span class="nf">SUM</span><span class="p">(</span><span class="nv">Resolution time</span><span class="p">))</span> <span class="o">/</span>
    <span class="p">(</span><span class="k">SELECT</span> <span class="nf">SUM</span><span class="p">(</span><span class="nv">Resolution time</span><span class="p">)</span> <span class="k">BY</span> <span class="nv">Quarter</span><span class="p">)</span></pre></div>

To better illustrate how this works, let's look at all three metrics side by side:

![By Metric Comparison]({{ site.root }}/images/docs/maql/by-metric.png)

You can see that the `SUM BY Quarter` metric displays the identical result for all month in the same quarter, since it's computing results for all months that belong into that quarter.

If the report's aggregation level is higher then the one defined in the metric `BY` clause, the metric's aggregation is ignored. Continuing with this example, if we replace the `Month` attribute with a `Year` attribute, the differences between the metrics will be ignored:

![By Clause Ignored]({{ site.root }}/images/docs/maql/by-ignored.png)

###BY ALL

Let's say we'd like to create showing percentage of `Resolution time` not just out of the `Quarter` or `Year`, but all time. Since the highest-level attribute in the date dimension is `Year`, we need a new construct: `BY ALL YEAR`. This fixes the aggregation for all years, but still can break down by attributes from other dimesions. This is best shown by adding a second attribute from a different dimension into our report - for example `Customer`:

{% comment %}
Original MAQL pre-pygmentize:

    SELECT SUM(Resolution time) BY ALL Year

{% endcomment %}
<div class="highlight"><pre><span class="k">SELECT</span> <span class="nf">SUM</span><span class="p">(</span><span class="nv">Resolution time</span><span class="p">)</span> <span class="k">BY ALL</span> <span class="nv">Year</span></pre></div>

![By All Year]({{ site.root }}/images/docs/maql/by-all-year.png)

###BY attr, ALL IN ALL OTHER DIMENSIONS

The opposite problem would be to create a metric that is fixed at highest aggregation (undrillable) in all dimension but the date dimension, where it is fixed at the `Quarter` level:

{% comment %}
Original MAQL pre-pygmentize:

    SELECT SUM(Resolution time) BY Quarter, ALL IN ALL OTHER DIMENSIONS

{% endcomment %}
<div class="highlight"><pre><span class="k">SELECT</span> <span class="nf">SUM</span><span class="p">(</span><span class="nv">Resolution time</span><span class="p">)</span>
    <span class="k">BY</span> <span class="nv">Quarter</span><span class="p">,</span> <span class="k">ALL IN ALL OTHER DIMENSIONS</span></pre></div>

![By Quarter, All Other]({{ site.root }}/images/docs/maql/by-quarter-all-other.png)

Another similar construct is `BY ALL IN ALL OTHER DIMENSIONS EXCEPT FOR Quarter`. The only difference between these two constructs is that `EXCEPT FOR` preserves natural aggregation in the dimension specified by the attribute (date dimension specified by `Quarter` in this case) but `Quarter, ALL ...` construct will never drill in the date dimension bellow the level specified by `Quarter`.

###BY ALL IN ALL OTHER DIMENSIONS

Finally, the ultimate metric that aggregates over all data in all dimensions is plain and simply:

{% comment %}
Original MAQL pre-pygmentize:

    SELECT SUM(Resolution time) BY ALL IN ALL OTHER DIMENSIONS

{% endcomment %}
<div class="highlight"><pre><span class="k">SELECT</span> <span class="nf">SUM</span><span class="p">(</span><span class="nv">Resolution time</span><span class="p">)</span> <span class="k">BY ALL IN ALL OTHER DIMENSIONS</span></pre></div>

![By All In All Other]({{ site.root }}/images/docs/maql/by-all-everywhere.png)


##Filtering

…to be continued…