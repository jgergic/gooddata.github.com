---
title: GoodData CL 1.1 to 1.2 Migration
excerpt: The CL tool version 1.2 requires a simple migration of projects that have been created with the previous versions of the CL tool
layout: post
---
#Upgrading projects created with CL tool 1.1 to CL tool 1.2

The new 1.2 version of CL tool changes the way data models are being created. This requires a simple migration of projects created with CL tool 1.1 and older. 

Only projects that use datasets without any facts require the migration. If you try to load data to such project, you'll most probably receive an error reading "Unknown import mode" or complaints about non-existing `factsof` attribute.

If your project requires migration, you'll need to execute a migration MAQL script via the `ExecuteMaql` command. The migration script deletes the ambiguous `factsof` attribute that has been created for the dataset's `CONNECTION POINT`.

You'll need to run the `ALTER ATTRIBUTE` statement on the line 5 for every `REFERENCE` to the migrated dataset. You'll also need to `SYNCHRONIZE` all `REFERENCE` datasets.

    ALTER ATTRIBUTE {attr.<dataset-name>.<connection-point-name>} DROP KEYS {f_<dataset-name>.id};
    ALTER DATASET {dataset.<dataset-name>} DROP {attr.<dataset-name>.factsof};
    DROP {attr.<dataset-name>.factsof};

    # You need to add this statement for each REFERENCE to the migrated dataset
    ALTER ATTRIBUTE {attr.<dataset-name>.<connection-point-name>} ADD KEYS
        {d_<reference-dataset-name>_<reference-name>.<dataset-name>_id};

    SYNCHRONIZE {dataset.<dataset-name>};
    # Also you need to synchronize all REFERENCE datasets
    SYNCHRONIZE {dataset.<reference-dataset-name>};

Let me illustrate this on the HR demo project. There are two datasets with no facts: department, and employee. The following figure highlights the `factsof` attributes that we need to delete and reconnect. 

![Old Model]({{ site.root }}/images/posts/old.model.png)

and here is the new model that we need to create

![New Model]({{ site.root }}/images/posts/new.model.png)

Here is the script that updates both department and employee datasets. 

    # Disconnect the department attribute from the department factsof that we are going to drop
    ALTER ATTRIBUTE {attr.department.department} DROP KEYS {f_department.id};
    # Remove the department factsof from the department dataset
    ALTER DATASET {dataset.department} DROP {attr.department.factsof};
    # Drop the department factsof
    DROP {attr.department.factsof};

    # Disconnect the employee attribute from the employee factsof that we are going to drop
    ALTER ATTRIBUTE {attr.employee.employee} DROP KEYS {f_employee.id};
    # Remove the employee factsof from the employee dataset
    ALTER DATASET {dataset.employee} DROP {attr.employee.factsof};
    # Drop the employee factsof
    DROP {attr.employee.factsof};

    # Reconnect the department attribute to the employee (bridge the non-existing factsof)
    ALTER ATTRIBUTE {attr.department.department} ADD KEYS {d_employee_employee.department_id};
    # Reconnect the employee attribute to the employee (bridge the non-existing factsof)
    ALTER ATTRIBUTE {attr.employee.employee} ADD KEYS {f_salary.employee_id};

    # Synchronize the model changes with the underlying storage
    # Please note that currently all data will be deleted after running the SYNCHRONIZE command!
    SYNCHRONIZE {dataset.department};
    SYNCHRONIZE {dataset.employee};
    SYNCHRONIZE {dataset.salary};

*Caution:* The `SYNCHRONIZE` statement will delete all data from the given server-side data set. You will need to perform a full load after issuing the statements above!

You need to create your migration script, save it in a `migrate.maql` file, and create the migration commands file that opens the migrated project and execute the migration MAQL.

    # Open the migrated project
    OpenProject(id="<your-migrated-project-hash>");
    # Execute the MAQL
    ExecuteMaql(maqlFile="migrate.maql");

Finally, you will need to run your data loading script to re-populate the data sets as their contents have been deleted by the `SYNCHRONIZE` MAQL statement. 

The other option is to start from scratch and create entirely new project from the new CL tool version. The new project obviously doesn't contain the reports and dashboards that you might have in your current project. You can use the new `RetrieveAllObjects` CL tool command to retrieve all objects from the old project to your disk and then CopyObjects command to copy these objects to your new project. You'll need to delete the `factsof` objects from the disk before the import.