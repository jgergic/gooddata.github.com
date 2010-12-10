---
title: Major release - GoodData CL v1.2 - Migration &amp; New Features
excerpt: New CL v1.2 was released today. Before upgrading, read here more about the major changes and how to migrate from your existing version.
layout: post
---

# New GoodData CL Version 1.2 Is Here

Starting today when you download the latest version of GoodData CL, you will get the new v1.2. It has been in preparation for weeks. Here is a run-down of new features and important migration information for existing projects:

## New Features:

* *much* faster in loading data into your projects
* does not use local MySQL/Derby database anymore (details in [previous post]({{ site.root }}/blog/2010/10/15/data-upload-apis))
* this version also supports multiple profiles when loading into [Google Analytics]({{ site.root }}/blog/2010/10/26/google-analytics-multiple-profiles/) and has a separate tool for pushing [notification streams]({{ site.root }}/blog/2010/11/02/automated-notifications-messages/)
* you can export all your metrics/reports/dashboards, back them up, and load them into another project (allowing you to clone projects, migrate your dashboards to a new project etc.)
* you can use date dimension with time data

## Migration of Older Projects:

Your projects can either be used **exclusively either with CL 1.1 or with CL 1.2**. Existing projects created with CL tool 1.1 and lower will **need to be migrated** to be used with CL 1.2. It is important you understand the changes. CL 1.1 used a local database (Derby or MySQL) to store lookup tables of IDs for your attribute string values. When new data was loaded (both incremental and full-replace) identical IDs are assigned to the same attribute values so that filters defined in your reports keep working.

1. The local database has been removed in 1.2 and is now kept on GoodData servers. If you have a v1.1 project, you will need to run the `MigrateDatasets` command. This command will transfer your local lookup tables to GoodData servers and sets up the project for CL v1.2. After this change, the project should not be used with CL 1.1 anymore. The command looks like this:

       gdi.sh -u ... -p ... -e 'MigrateDatasets(configFiles="list-of-files");'

   where `list-of-files` is a comma-separates list of paths to XML schema files that represent datasets that are to be migrated.

2. Additionally, you'll need to modify your project model to adhere to the way the new version constructs data models. Only projects that contain datasets without any facts require this migration. If you try to load data to such project, you’ll most probably receive an error reading “Unknown import mode” or complaints about non-existing `factsof` attribute. If your project requires migration, you’ll need to execute a migration MAQL script via the `ExecuteMaql` command. The migration script deletes the ambiguous `factsof` attribute that has been created for the dataset’s `CONNECTION_POINT`.

   You'll need to run the `ALTER ATTRIBUTE` statement on the line 5 for every `REFERENCE` to the migrated dataset. You'll also need to `SYNCHRONIZE` all `REFERENCE` datasets.

   {% comment %}
   Original MAQL pre-pygmentize

       ALTER ATTRIBUTE {attr.<dataset-name>.<connection-point-name>} DROP KEYS {f_<dataset-name>.id};
       ALTER DATASET {dataset.<dataset-name>} DROP {attr.<dataset-name>.factsof};
       DROP {attr.<dataset-name>.factsof};

       # You need to add this statement for each REFERENCE to the migrated dataset
       ALTER ATTRIBUTE {attr.<dataset-name>.<connection-point-name>} ADD KEYS
           {d_<reference-dataset-name>_<reference-name>.<dataset-name>_id};

       SYNCHRONIZE {dataset.<dataset-name>};
       # Also you need to synchronize all REFERENCE datasets
       SYNCHRONIZE {dataset.<reference-dataset-name>};

   {% endcomment %}

   <div class="highlight"><pre><span class="k">ALTER</span> <span class="k">ATTRIBUTE</span> <span class="nv">{attr.&lt;dataset-name&gt;.&lt;connection-point-name&gt;}</span> <span class="k">DROP</span> <span class="k">KEYS</span> <span class="nv">{f_&lt;dataset-name&gt;.id}</span><span class="p">;</span>
   <span class="k">ALTER</span> <span class="k">DATASET</span> <span class="nv">{dataset.&lt;dataset-name&gt;}</span> <span class="k">DROP</span> <span class="nv">{attr.&lt;dataset-name&gt;.factsof}</span><span class="p">;</span>
   <span class="k">DROP</span> <span class="nv">{attr.&lt;dataset-name&gt;.factsof}</span><span class="p">;</span>

   <span class="c1"># You need to add this statement for each REFERENCE to the migrated dataset</span>
   <span class="k">ALTER</span> <span class="k">ATTRIBUTE</span> <span class="nv">{attr.&lt;dataset-name&gt;.&lt;connection-point-name&gt;}</span> <span class="k">ADD</span> <span class="k">KEYS</span>
       <span class="nv">{d_&lt;reference-dataset-name&gt;_&lt;reference-name&gt;.&lt;dataset-name&gt;_id}</span><span class="p">;</span>

   <span class="k">SYNCHRONIZE</span> <span class="nv">{dataset.&lt;dataset-name&gt;}</span><span class="p">;</span>
   <span class="c1"># Also you need to synchronize all REFERENCE datasets</span>
   <span class="k">SYNCHRONIZE</span> <span class="nv">{dataset.&lt;reference-dataset-name&gt;}</span><span class="p">;</span>
   </pre></div>
   
   For more details and further examples, see this [older blog post]({{ site.root }}/blog/2010/10/25/gooddata-cl-migration) about the issue.

-------

## CL Commands Changes

**New Commands:** `MigrateDatasets`, `RetrieveAllObjects`, `StoreAllObjects` (see [Metadata Management Commands]({{ site.root }}/gooddata-cl/cli-commands.html#metadata_management_commands))

**Changed Commands:**

* `UseDateDimension` now supports time (`includeTime = <true | false>`), you need to use `<datetime>true</datetime>` element in your XML config to activate this and you must use `TransferData` command to load the time portion of the date dimension - see the XML and cmd files of [Forex example](https://github.com/gooddata/GoodData-CL/tree/master/cli-distro/examples/forex).
* support for `<dataType>` key directly in your [XML model]({{ site.root }}/gooddata-cl/xml-config.html)
* new `IDENTITY` datatype creates a new column with a unique ID for each row of your dataset. It creates the ID as an MD5 hash of the whole row.
* `DATE` format supports time, [see more]({{ site.root }}/gooddata-cl/xml-config.html)


**Renamed Commands:**
We've simplified/consolidated names of the CL tool commands. Old names are still working, however will be deprecated in the future:

* `Load*` -> `Use*`
* `DropProject` -> `DeleteProject`
* `StoreProject` -> `RememberProject`
* `RetrieveProject` -> `UseProject`

**Discontinued commands:** `DropIntegrationDatabase`, `DropSnapshots`, `Transfer*Snapshot` (use TransferData instead)
