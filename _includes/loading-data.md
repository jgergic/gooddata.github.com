<div style="text-align: center; margin-top: 25px;">
    <object width="640" height="456"><param name="allowfullscreen" value="true" /><param name="allowscriptaccess" value="always" /><param name="movie" value="http://vimeo.com/moogaloop.swf?clip_id=12674036&amp;server=vimeo.com&amp;show_title=1&amp;show_byline=0&amp;show_portrait=0&amp;color=576bab&amp;fullscreen=1" /><embed src="http://vimeo.com/moogaloop.swf?clip_id=12674036&amp;server=vimeo.com&amp;show_title=1&amp;show_byline=0&amp;show_portrait=0&amp;color=576bab&amp;fullscreen=1" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="640" height="456">
        <!-- Fallback content -->
        <a href="http://vimeo.com/m/#/12674036"><img src="/images/video-fallback.png" width="640" height="456" alt="Loading Data into GoodData in 5 minutes"></a>
    </embed></object><br>
</div>

# Loading Data into GoodData in 5 minutes

### Preparation - find some data, create a GoodData account

<li>
    <p>In following examples, we will use a comma-separated file for sake of simplicity. If you have other data formats, or wish to connect directly into the database, we have connectors into data integration tools that offer direct database access.</p>
    <p>If you want to analyze data from your internal database, most vendors feature export tools
        (
        <a href="http://dev.mysql.com/doc/refman/5.1/en/mysqldump.html" target="_blank">MySQL</a>,
        <a href="http://dev.mysql.com/doc/refman/5.1/en/mysqldump.html" target="_blank">Oracle</a>,
        <a href="http://technet.microsoft.com/en-us/library/dd255223.aspx">MS SQL</a> etc.
        ). We also have a JDBC connector that can attach to your database directly. See <a href="/gooddata-cl/examples/jdbc/">this example</a> to learn more.
    </p>
</li>
<li>If you don't have an account with GoodData, go to <a href="http://www.gooddata.com/">www.gooddata.com</a> and register for one.</li>

### Step 1 - install GoodData CL

Follow the quick [installation readme](/gooddata-cl/install.html).

<a name="describe" style="position:absolute">&nbsp;</a>
### Step 2 - describe your data

Run the `gdi.sh` script, generate a XML config file describing your data. The example uses a file in your GoodData CL Framework. You might use your own data file (make sure the first row contains headers):

    ./bin/gdi.sh -e 'GenerateCsvConfig(csvHeaderFile="examples/quotes/quotes.csv",configFile="config.xml");'

This command generated a sample XML config file. Data types of your columns are random. Read the [XML config documentation](/gooddata-cl/documentation.html) to edit this file and describe your data. See [our examples](/gooddata-cl/examples/) for typical basic usage.

### Step 3 - setup your project

Save [this file](create.txt) as `create.txt` and run with `gdi.sh` script:

    ./bin/gdi.sh -u [username] -p [password] create.txt

Now you can log into your project and visually verify your created attributes, facts and data model (in the Data page).

<a name="upload" style="position:absolute">&nbsp;</a>
### Step 4 - load your data

Save [another file](load.txt) as `load.txt` and run with `gdi.sh` script:

    ./bin/gdi.sh -u [username] -p [password] load.txt

<hr>

# Next steps

<a name="automate" style="position:absolute">&nbsp;</a>
### Automatic data load

Since step 4 is fully automatic, you can easily place that command into a shell script (or Windows batch script) and run [periodically](http://en.wikipedia.org/wiki/Cron).
            
### Learn more

 * See the [other examples](/gooddata-cl/examples/) included with GoodData CL.
 * Read the full GoodData CL [documentation](/gooddata-cl/documentation.html) for more advanced options like data snapshotting, custom connectors etc.
 * Or dive even deeper and read our full [MAQL DDL documentation](/api/maql-ddl.html) for creating custom data models.
