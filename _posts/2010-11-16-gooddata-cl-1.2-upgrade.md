---
title: Major Upgrade to GoodData CL v1.2
excerpt: The new v1.2 of GoodData CL (formerly the SLI branch) was released today. Before upgrading, read more here about the major changes and what it means for you.
layout: post
---

# New Gooddata CL Version 1.2 Is Here

Starting today when you download the latest version of GoodData CL, you will get the new v1.2. It has been in preparation in the `sli` branch for weeks, but has been merged to master as of today. We have [written about changes](/2010/10/15/data-upload-apis) in GoodData CL in the past, but here is a brief run-down:

### Features:

* this new version is **MUCH** faster in loading data into your projects and doesn't need a local database for it's use (details in [previous post](/2010/10/15/data-upload-apis))
* this version also supports multiple profiles when loading into [Google Analytics](http://developer.gooddata.com/blog/2010/10/26/google-analytics-multiple-profiles/) and has a separate tool for pushing [notification streams](http://developer.gooddata.com/blog/2010/11/02/automated-notifications-messages/)
* you can export a full description of all metrics, reports and dashboards from your project and import it into another project with a compatible data model
* you can use date dimension with time data

### Draw-backs:

* you **cannot** use **CL v1.2 with older projects** created in v1.1 and earlier. Either create a new project or use this [migration guide](/blog/2010/10/25/gooddata-cl-migration) to make your older project compatible. Contact us if you need help with the migration to 1.2
* there are significant changes in the command set. Most `*.cmd` files will need to be updated. Most importantly, `Load*` ⇒ `Use*`
