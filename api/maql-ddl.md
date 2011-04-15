---
title: MAQL DDL Documentation
layout: documentation
stub: api-maql-ddl
---

<h1 id="modeling_data_with_maql_ddl">Modeling Data with MAQL DDL</h1>

<p><strong>MAQL</strong> (Multidimensional Query Language) is a simple yet powerful query language that provides an underpinning of GoodData&#8217;s reporting capabilities. It&#8217;s extension <strong>MAQL DDL</strong> (MAQL Data Definition Language) is used for building and adapting a data model.</p>

<h2 id="getting_started">Getting Started</h2>

Similar to the core MAQL, DDL syntax is simple and reminiscent of SQL. At it&#8217;s core, there are three most important commands to choose from: <strong>CREATE</strong>, <strong>ALTER</strong> and <strong>DROP</strong>. These commands can be applied to objects forming the data model:

 * datasets (dataset is one joint source of data and comprises of attributes and facts)
 * attributes (attribute is container of data that cannot be added - typically all strings and some numeric columns, like ID or SSN)
 * facts (a fact is a data column containing computational data - ie. prices, amounts etc.)
 * folders (folders are used to organize attributes and facts visually for users)

<p>You can try the MAQL commands featured here directly in the REST API interface, just go to http://secure.gooddata.com/gdc/md/&lt;project&gt;/ldm/manage (replacing project with your own project's MD5 hash). It's good to mention as well that you can enter multiple commands into the text field. They will all execute together as part of a transaction and if any of them fails none of them will be applied.</p>

<h2 id="identifiers">Identifiers</h2>

<p>Throughout the MAQL script samples below, words enclosed in {curly brackets} denote <em>identifiers</em>. Think of them as human-readable IDs that you can assign to objects and refer to them in other objects. Once an object is created, the identifier is persistent and cannot be changed. You can choose your own naming conventions for identifiers (in the examples below we often put identifiers into "namespace" by prefixing them with "folder.", "fact." etc.) Identifiers can contain alphanumeric characters, underscore and dot (ie. <code>[A-Za-z0-9_\.]</code>).</p>

<p class="note"><strong>Note:</strong> The only exception, where identifier name has to follow certain structure is <em>data column identifiers</em>. These identifiers reference specific data columns in data files that you upload through the upload API. These are structured in <a href="http://en.wikipedia.org/wiki/Third_normal_form">3NF</a>. The identifiers must take form of <code>file.column</code>. The <code>file</code> part corresponds to the data file, while column corresponds to a specific column. All columns that in 3NF share a common file must also share the same prefix in their identifiers. In examples below, <em>data column identifiers</em> are <span class="dataColumn">highlighted</span>.</p>

<h2 id="synchronize">Synchronize</h2>

<p>Whatever commands you perform, they affect the &#8220;logical data model&#8221; - ie. a formal representation of your data. Underneath this abstraction layer is a &#8220;physical data model&#8221; that GoodData uses to perform computations. After you finish applying your changes through MAQL DDL, if those changes have impacted the physical data model you must call the <code>SYNCHRONIZE</code> command to reflect your changes from logical to physical model. You can think of this as &#8220;preparing&#8221; your changes and then committing them. Visual changes (names, descriptions, membership in folders etc.) don't need to be synchronized to the physical model.</p>

<pre class="highlight"><code class="maql"><span class="k">SYNCHRONIZE</span> <span class="nv">{dataset.one}</span><span class="p">,</span> <span class="nv">{dataset.two}</span><span class="p">;</span></code></pre>


<p class="warning"><strong>WARNING:</strong> Calling <code>SYNCHRONIZE</code> will change the physical storage underneath the project and will empty all data and require you to reload all your data again. Without calling the <code>SYNCHRONIZE</code> command at the end of your changes, you will be left with a <strong>broken</strong> project that won&#8217;t function properly. It is essential that you <code>SYNCHRONIZE</code> whenever you make changes.</p>

<h2 id="dataset">Dataset</h2>

<p>Since dataset is just a named container for attributes and facts, creating and modifying it is fairly simple:</p>

<h3 id="create_dataset">CREATE DATASET</h3>

<pre class="highlight"><code class="maql"><span class="k">CREATE</span> <span class="k">DATASET</span> <span class="nv">{dataset.quotes}</span> <span class="k">VISUAL</span><span class="p">(</span><span class="k">TITLE</span> <span class="s">&quot;Stock Quotes Data&quot;</span><span class="p">);</span></code></pre>


<h3 id="alter_dataset">ALTER DATASET</h3>

<ol>
    <li>
        <p>add attribute/fact:</p>
        <pre class="highlight"><code class="maql"><span class="k">ALTER</span> <span class="k">DATASET</span> <span class="nv">{dataset.quotes}</span> <span class="k">ADD</span> <span class="nv">{attribute.sector}</span><span class="p">;</span></code></pre>
    </li>
    <li>
        <p>remove attribute/fact:</p>
        <pre class="highlight"><code class="maql"><span class="k">ALTER</span> <span class="k">DATASET</span> <span class="nv">{dataset.quotes}</span> <span class="k">DROP</span> <span class="nv">{attribute.symbol}</span><span class="p">;</span></code></pre>
    </li>
    <li>
        <p>change the name of the dataset:</p>
        <pre class="highlight"><code class="maql"><span class="k">ALTER</span> <span class="k">DATASET</span> <span class="nv">{dataset.quotes}</span> <span class="k">VISUAL</span><span class="p">(</span><span class="k">TITLE</span> <span class="s">&quot;Internal Quotes Data&quot;</span><span class="p">);</span></code></pre>
    </li>
</ol>

<p class="note"><strong>Note:</strong> one attribute or fact should always belong to exactly one dataset (not more, not less). Otherwise the validation of the project will fail.</p>

<h2 id="attribute">Attribute</h2>

<p>An attribute is the unit that allows you to specify how to aggregate (or slice) your data. Examples would include: Assignee, City, Day, ID, Group etc. Attributes can optionally have additional <strong>labels</strong>. These are alternate string representation of the <em>same semantic value</em>. For example a person John Doe is the same person, regardless if they are visualized as &quot;J. Doe&quot;, &quot;Doe, John&quot;, &quot;Johnny&quot; etc. Or &quot;Jan 10&quot;, &quot;January 2010&quot; and &quot;01/2010&quot;.</p>

<h3 id="create_attribute">CREATE ATTRIBUTE</h3>

<pre class="highlight"><code class="maql"><span class="k">CREATE</span> <span class="k">ATTRIBUTE</span> <span class="nv">{attr.quotes.symbol}</span> <span class="k">VISUAL</span><span class="p">(</span><span class="k">TITLE</span> <span class="s">&quot;Symbol&quot;</span><span class="p">,</span> <span class="k">FOLDER</span> <span class="nv">{folder.quotes.attr}</span><span class="p">)</span>
    <span class="k">AS</span> <span class="nv dataColumn">{d_quotes_symbol.nm_symbol}</span><span class="p">;</span></code></pre>


<h3 id="alter_attribute">ALTER ATTRIBUTE</h3>

<pre class="highlight"><code class="maql"><span class="k">ALTER</span> <span class="k">ATTRIBUTE</span> <span class="nv">{attr.quotes.symbol}</span> <span class="k">ADD</span> <span class="k">LABELS</span> <span class="nv">{attr.quotes.company}</span> <span class="k">VISUAL</span><span class="p">(</span><span class="k">TITLE</span> <span class="s">&quot;Company&quot;</span><span class="p">)</span>
    <span class="k">AS</span> <span class="nv dataColumn">{d_quotes_symbol.nm_company}</span><span class="p">;</span></code></pre>



<h2 id="fact">Fact</h2>

<h3 id="create_fact">CREATE FACT</h3>

<pre class="highlight"><code class="maql"><span class="k">CREATE</span> <span class="k">FACT</span> <span class="nv">{fact.quotes.open_price}</span> <span class="k">VISUAL</span><span class="p">(</span> <span class="k">TITLE</span> <span class="s">&quot;Open Price&quot;</span><span class="p">,</span> <span class="k">FOLDER</span> <span class="nv">{folder.quotes.fact}</span><span class="p">)</span>
    <span class="k">AS</span> <span class="nv dataColumn">{f_quotes.f_open_price}</span><span class="p">;</span></code></pre>

<h3 id="alter_fact">ALTER FACT</h3>

<pre class="highlight"><code class="maql"><span class="k">ALTER</span> <span class="k">FACT</span> <span class="nv">{fact.quotes.open_price}</span> <span class="k">ADD</span> <span class="nv dataColumn">{f_quotes2.f_open_price}</span><span class="p">;</span></code></pre>


<h2 id="folder">Folder</h2>

<p>Folders are used to visually organize facts or attributes and metrics for the user. Folders are types - ie. they can only contain objects of one kind (hence the TYPE section).</p>

<h3 id="create_folder">CREATE FOLDER</h3>

<pre class="highlight"><code class="maql"><span class="k">CREATE</span> <span class="k">FOLDER</span> <span class="nv">{folder.quotes.attr}</span>
    <span class="k">VISUAL</span> <span class="p">(</span> <span class="k">TITLE</span> <span class="s">&quot;Stock Quotes Data&quot;</span><span class="p">,</span> <span class="k">DESCRIPTION</span> <span class="s">&quot;Stock quotes data obtained from John Doe etc.&quot;</span> <span class="p">)</span>
    <span class="k">TYPE</span> <span class="k">ATTRIBUTE</span><span class="p">;</span></code></pre>


<h3 id="create_folder">ALTER FOLDER</h3>

<p>As seen above, folders are filled during the creation and modification of attributes, metrics and facts. Thus the only thing that can be changed on the folder itself is it's name:</p>

<pre class="highlight"><code class="maql"><span class="k">ALTER</span> <span class="k">FOLDER</span> <span class="nv">{folder.quotes.attr}</span> <span class="k">VISUAL</span><span class="p">(</span><span class="k">TITLE</span> <span class="s">&quot;Quotes Attributes&quot;</span><span class="p">);</span></code></pre>


<h2 id="performance">Performance Optimization</h2>

<p>There are several useful techniques to optimize the data model for performance. In general it is a good idea to talk to our support for data model optimizations, but here are a few techniques to get you started:</p>

<h3>Specify a DATATYPE</h3>

<p>By default the system automatically stores all facts as decimal(12,2) and all atributes and labels as 128-character strings. For performance reasons or to store other data types, you can redefine your column data type:</p>

<pre class="highlight"><code class="maql"><span class="k">ALTER</span> <span class="k">DATATYPE</span> <span class="nv dataColumn">{d_quotes_symbol.nm_symbol}</span> <span class="k">VARCHAR</span><span class="p">(</span><span class="m">4</span><span class="p">),</span>
    <span class="nv dataColumn">{d_quotes_symbol.nm_symbol}</span> <span class="k">VARCHAR</span><span class="p">(</span><span class="m">80</span><span class="p">),</span> <span class="nv dataColumn">{f_quotes.f_open_price}</span> <span class="k">DECIMAL</span><span class="p">(</span><span class="m">10</span><span class="p">,</span><span class="m">2</span><span class="p">);</span></code></pre>

    
<p>Supported data types are:</p>
<table>
    <tbody>
        <tr>
            <th class="confluenceTh">data type</th>
            <th class="confluenceTh">form</th>
            <th class="confluenceTh">note</th>
        </tr>
        <tr>
            <td class="confluenceTd">VARCHAR (N)</td>
            <td class="confluenceTd">&nbsp;</td>
            <td class="confluenceTd"><b>N</b> (1..255)</td>
        </tr>
        <tr>
            <td class="confluenceTd">DECIMAL (M,D)</td>
            <td class="confluenceTd">&nbsp;</td>
            <td class="confluenceTd"><b>M</b> min(-1e+15) max(1e+15), <b>D</b> max = 6</td>
        </tr>
        <tr>
            <td class="confluenceTd">INT</td>
            <td class="confluenceTd">&nbsp;</td>
            <td class="confluenceTd">min(-2147483648) max(2147483647)</td>
        </tr>
        <tr>
            <td class="confluenceTd">BIGINT</td>
            <td class="confluenceTd">&nbsp;</td>
            <td class="confluenceTd">min(-1e+15) max(1e+15)</td>
        </tr>
        <tr>
            <td class="confluenceTd">DATE</td>
            <td class="confluenceTd">'YYYY-MM-DD'</td>
            <td class="confluenceTd">&nbsp;</td>
        </tr>
        <tr>
            <td class="confluenceTd">DOUBLE</td>
            <td class="confluenceTd">&nbsp;</td>
            <td class="confluenceTd">discouraged</td>
        </tr>
    </tbody>
</table>

<p><sup>*</sup>) The DATE datatype automatically maps with the GoodData-provided date dimension, if you have previously included it into the project:</p>
<pre class="highlight"><code class="maql"><span class="k">INCLUDE</span> <span class="k">TEMPLATE</span> <span class="s">&quot;URN:GOODDATA:DATE&quot;</span> <span class="k">MODIFY</span> <span class="p">(</span><span class="nb">IDENTIFIER</span> <span class="s">&quot;my-date&quot;</span><span class="p">,</span> <span class="k">TITLE</span> <span class="s">&quot;quote&quot;</span><span class="p">);</span></code></pre>

<h3>Create Multiple Fact Columns</h3>

<p>In the following example, the fact <code>fact.quotes.open_price</code> already has a fact column f_quotes.f_open_price, but for performance reasons, an identical column in f_quotes2 is being added below:</p>
<pre class="highlight"><code class="maql"><span class="k">ALTER</span> <span class="k">FACT</span> <span class="nv">{fact.quotes.open_price}</span> <span class="k">ADD</span> <span class="nv dataColumn">{f_quotes2.f_open_price}</span><span class="p">;</span></code></pre>

