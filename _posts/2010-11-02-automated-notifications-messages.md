---
title: Automated Notifications and Messages from GoodData
excerpt: We've created a new tool designed to monitor GoodData reports - and if certain conditions are met, to send a message to another system. It was design for the purpose of Salesforce Chatter integration, but could conceivably be used with Yammer, Twitter or other messaging systems.
layout: post
---

# Automated Notifications and Messages from Gooddata

We've created a new tool designed to monitor GoodData reports - and if certain conditions are met, to send a message to another system. It was design for the purpose of Salesforce Chatter integration, but could conceivably be used with Yammer, Twitter or other messaging systems.

Here is a beta download: ([tar.gz](http://support.gooddata.com/attachments/token/y9oxeyrfytglxi5/?name=gooddata-alert-1.2.2-SNAPSHOT.tar.gz), [zip](http://support.gooddata.com/attachments/token/eb2aklrvb5ldgbz/?name=gooddata-alert-1.2.2-SNAPSHOT.zip)). The tool has many similarities with GoodData CL. Documentation and examples are included in the download, however here are links to view them online:

[Usage](http://github.com/gooddata/GoodData-CL/tree/sli/notification-distro/#readme)  
[Config XML Documentation](http://github.com/gooddata/GoodData-CL/blob/sli/notification-distro/doc/XML.md#readme)  
[Salesforce Chatter Example](http://github.com/gooddata/GoodData-CL/tree/sli/notification-distro/examples/sfdc-chatter/#readme)

# Building Your Own Messaging Connectors

The core of GoodData Notification tool is shared with GoodData CL. If you want to try building your own connector into a different messaging service, follow the instructions on how to build [GoodData CL](http://github.com/gooddata/GoodData-CL#readme), but in step 6, instead of doing `cd cli-distro`, use instead the notification-distro: `cd notification-distro` and then resume the original instructions with `mvn assembly:assembly`.