---
title: Major release - GoodData CL v1.2 - Migration &amp; New Features
excerpt: New CL v1.2 was released today. Before upgrading, read here more about the major changes and how to migrate from your existing version.
layout: post
---

# New Gooddata CL Version 1.2 Is Here

Starting today when you download the latest version of GoodData CL, you will get the new v1.2. It has been in preparation for weeks. Here is a run-down of new features and important migration information for existing projects:

## New Features:

* *much* faster in loading data into your projects
* does not use local MySQL/Derby database anymore (details in [previous post](/2010/10/15/data-upload-apis))
* this version also supports multiple profiles when loading into [Google Analytics](http://developer.gooddata.com/blog/2010/10/26/google-analytics-multiple-profiles/) and has a separate tool for pushing [notification streams](http://developer.gooddata.com/blog/2010/11/02/automated-notifications-messages/)
* you can export all your metrics/reports/dashboards, back them up, and load them into another project (allowing you to clone projects, migrate your dashboards to a new project etc.)
* you can use date dimension with time data

## Migration of Older Projects:

Your projects can either be used **exclusively either with CL 1.1 or with CL 1.2**. Existing projects created with CL tool 1.1 and lower will **need to be migrated** to be used with CL 1.2. It is important you understand the changes. CL 1.1 used a local database (Derby or MySQL) to store lookup tables of IDs for your attribute string values. When new data was loaded (both incremental and full-replace) identical IDs are assigned to the same attribute values so that filters defined in your reports keep working.

The local database has been removed in 1.2 and is now kept on GoodData servers. If you have a v1.1 project, you will need to run the `MigrateDatasets` command. This command will transfer your local lookup tables to GoodData servers and sets up the project for CL v1.2. After this change, the project should not be used with CL 1.1 anymore. The command looks like this:

    gdi.sh -u ... -p ... -e 'MigrateDatasets();'

## CL Commands Changes

**New Commands:** `MigrateDatasets`, `RetrieveAllObjects`, `StoreAllObjects` (see [Metadata Management Commands](http://localhost:4000/gooddata-cl/cli-commands.html#metadata_management_commands))

**Changed Commands:**

* `UseDateDimension` now supports time (`includeTime = <true | false>`) 
* the XML config must use `<datetime>true</datetime>` element - see the Forex demo
* support for &lt;dataType&gt; key directly in your XML model
* new `IDENTITY` datatype
* `DATE` format supports time


**Renamed Commands:**
We've simplified/consolidated names of the CL tool commands. Old names are still working, however will be deprecated in the future:

* `Load*` -> `Use*`
* `DropProject` -> `DeleteProject`
* `StoreProject` -> `RememberProject`
* `RetrieveProject` -> `UseProject`

**Discontinued commands:** `DropIntegrationDatabase`, `DropSnapshots`, `Transfer*Snapshot` (use TransferData instead)
