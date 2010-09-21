---
layout: documentation
stub: data-model
---

# Data Model

Data Model helps GoodData understand the structure of your data and create database queries to analyze it.

**nice infographic follows**

## Data Types

In business intelligence, data is separated between quantitative (*facts*) and qualitative (*attributes*).

Examples of *facts*: age, # of items, revenue, **not** social security number or an ID. Generally anything you can count.
Examples of *attributes*: names, places, colors, IDs.

There are more types with special semantics/behavior available (for example Dates). See ldmType in the [Schema XML documentation](/gooddata-cl/xml-config.html) for more details.

When configuring your data model, help us by identifying which fields are facts and which are attributes. If you get it wrong, you *can* [change your model](/api/maql-ddl.html) later, however it's not entirely easy and you'll have to reload all your data again into GoodData.

**Example:**

    +------------------------------------------------------------------------------------+
    | Name | Surname | Address | Company | Cust. ID | Date | Revenue | Age  | Item Count |
    +------------------------------------------------------------------------------------+
    | ATTR |   ATTR  |   ATTR  |   ATTR  |   ATTR   | Date |   FACT  | FACT |   FACT     |
    +------------------------------------------------------------------------------------+

## Data Structure

When aggregating data in GoodData ROLAP engine, we need to understand relationships between your data fields.

**…more to follow…**