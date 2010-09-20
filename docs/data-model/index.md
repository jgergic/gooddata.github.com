---
layout: documentation
stub: data-model
---

# Data Model

Data Model helps GoodData understand the structure of your data and create database queries to analyze it.

**nice infographic follows**

There are two important things to get right: Attributes/Facts and Data Structure.

## Data Types

In business intelligence, data is separated between quantitative (*facts*) and qualitative (*attributes*).

*Facts* are numerical data that can be aggregated (summed, averaged, etc.) Not all numerical data are facts however - a table ID or social security number are examples of purely numerical fields that cannot be aggregated with math.

*Attributes* are any labels that you can apply to data. Some can be textual, some numeric. Examples would include names, places, colors, IDs.

There are more types with special semantics/behavior available (for example dates). See ldmType in the [Schema XML documentation](/gooddata-cl/xml-config.html).

When configuring your data model, help us by identifying which fields are facts and which are attributes. If you get it wrong, you can [change your model](/api/maql-ddl.html) later, however you'll have to rebuild your reports from scratch.

**Example:**

    +------------------------------------------------------------------------------------+
    | Name | Surname | Address | Company | Cust. ID | Date | Revenue | Age  | Item Count |
    +------------------------------------------------------------------------------------+
    | ATTR |   ATTR  |   ATTR  |   ATTR  |   ATTR   | Date |   FACT  | FACT |   FACT     |
    +------------------------------------------------------------------------------------+

## Data Structure

When aggregating data in GoodData ROLAP engine, we need to understand relationships between your data fields.

**…more to follow…**