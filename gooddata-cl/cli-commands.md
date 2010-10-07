---
title: GoodData CL Commands
layout: gdcl
stub: gooddata-cl-commands
---

#Command-Line Options

    -h,--host <arg>       GoodData host (secure.gooddata.com by default)
    -f, --ftphost <arg>   GoodData FTP host (secure-di.gooddata.com by default)
    -t, --proto <arg>     Protocol to access GoodData (HTTP or HTTPS, HTTPS by default)
    -s, --insecure        Disable encryption for HTTP and FTP (prefer this to -t)
    -p,--password <arg>   GoodData password
    -u,--username <arg>   GoodData username
    -i,--project <arg>    GoodData project identifier (takes the form of an MD5 hash)
    -e,--execute <arg>    Commands to execute
    -b,--backend <arg>    Local database backend (DERBY or MYSQL, DERBY by default)
    -d,--dbusername <arg> Database backend username (not required for the local Derby SQL)
    -c,--dbpassword <arg> Database backend password (not required for the local Derby SQL)
    -l,--dbhost <arg>     Database backend hostname (e.g. dbmachine:3306 for MySQL, not required for the local Derby SQL)
    -m,--memory <arg>     Turns on the fast MySQL in-memory backend. It requires memory heap size in MB (60+ MB)
    -V, --version         Prints out the tool version
    file                  path to script file with commands to execute

{% include gdcl/cli-distro/doc/CLI.md %}
<div class="next">Next:&nbsp;<a href="{{ site.root }}/gooddata-cl/examples/">Usage Examples&nbsp;▶</a></div>
