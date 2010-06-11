---
title: MAQL DDL Documentation
layout: documentation
---

# Modeling Data with MAQL DDL

**MAQL** (Multidimensional Query Language) is a simple yet powerful query language that provides an underpinning of GoodData's reporting capabilities. It's extension **MAQL DDL** (MAQL Data Definition Language) is used for building and adapting a data model.

# Getting Started

Similar to the core MAQL, DDL syntax is simple and reminiscent of SQL. At it's core, there are three most important commands to choose from: **CREATE**, **ALTER** and **DROP**. These commands can be applied to objects forming the data model:

* [datasets](#create-datasets) (dataset is one joint source of data and comprises of attributes and facts)
* attributes (attribute is container of data that cannot be added - typically all strings and some numeric columns, like ID or SSN)
* facts (a fact is a data column containing computational data - ie. prices, amounts etc.)
* folders (folders are used to organize attributes and facts visually for users)
* datatypes?



# Dataset

Being a simple named container for attributes and facts, creating and modifying dataset is fairly simple:

### CREATE DATASET

<code>CREATE DATASET {dataset.csv2009} VISUAL(TITLE "Dataset for csv from 2009");</code>

### ALTER DATASET

1. add attribute/fact:

        ALTER FACT {a} ADD {table.column};

2. remove attribute/fact:

        ALTER FACT {a} DROP {table.column};

3. change the name of the dataset:

        ALTER FACT {a} VISUAL(TITLE "Internal Data");

# Attribute

An attribute is the unit that allows you to specify how to aggregate (or slice) your data. Examples would include: Assignee, City, Day, ID, Group etc. Attributes can optionally have additional **labels**. There are alternate string representation of the *same logical unit*. For example a person John Doe is the same person, regardless if they are visualized as "J. Doe", "Doe, John", "Johnny" etc. Or "Jan 10", "January 2010" and "01/2010". The attribute itself must contain unique values, and while it's labels don't, it is a good practice to keep the labels unique, too. A report can be render useless if it contains entries showing two "Johnny"s - each with a different amount of income - but no way to differentiate which one is which.

### CREATE ATTRIBUTE

<code>CREATE ATTRIBUTE {attr.opportunity.category} VISUAL(TITLE "Category of opportunity", FOLDER {folder.opportunity}) AS {tab_cat.col_id};</code>

### ALTER ATTRIBUTE

ALTER ATTRIBUTE {a} ADD LABELS {label1} AS {table.column};

# Fact

### CREATE FACT

<code>CREATE FACT {fact.opportunity.sales} VISUAL( TITLE "Sales" ) AS {tab_opp.col_sales};</code>

# Folder

Folders are used to visually organize facts or attributes and metrics for the user. Folders are types - ie. they can only contain objects of one kind (hence the TYPE section).

### CREATE FOLDER

<code>CREATE FOLDER {folder.one} VISUAL ( TITLE "folder one", DESCRIPTION "some description" ) TYPE ATTRIBUTE</code>

### CREATE FOLDER

Folders are filled during the creation and modification of attributes, metrics and facts - so the only thing that can be changed on the folder itself is it's name:

<code>ALTER FOLDER {a} VISUAL(TITLE "folder123");</code>





