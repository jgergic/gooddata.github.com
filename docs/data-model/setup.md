---
layout: documentation
stub: data-model-setup
---

# Data Model Setup


### GoodData CL
If you're using [GoodData CL](/gooddata-cl), you'll need to create an XML file describing your data structure. As a shortcut, the tool can generate a skeleton XML file for you to edit. See [Schema XML syntax](/gooddata-cl/xml-config.html) for detailed description.

    <schema>
      <name>GA</name>
      <columns>
        <column>
          <name>date</name>
          <title>Date</title>
          <ldmType>DATE</ldmType>
          <folder>GA</folder>
          <format>yyyy-MM-dd</format>
          <schemaReference>ga</schemaReference>
        </column>
      </columns>
    </schema>

### SnapLogic
Our Snaplogic plugin asks you for description of your model in step 6 (in the wizard this is called DLI definition). You get a chance to specify your ldmDataTypes (see [Schema XML syntax](/gooddata-cl/xml-config.html)). Each dataset is uploaded as a separate star

**screenshot of snaplogic setup**

### Using REST API and MAQL DDL
You can create/modify the data model directly using the REST API and our data description language - [MAQL DDL](/api/maql-ddl.html).

### Visual in-product configuration
Currently, the Data tab inside GoodData allows you to rename attributes/facts and connect datasets together. It also allows you to import new date dimensions. Eventually more parts of our MAQL DDL functionality will trickle back down into the product.