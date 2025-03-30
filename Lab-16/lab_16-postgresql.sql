Server [localhost]:
Database [postgres]:
Port [5432]:
Username [postgres]:
Password for user postgres:

psql (17.4)
WARNING: Console code page (437) differs from Windows code page (1252)
         8-bit characters might not work correctly. See psql reference
         page "Notes for Windows users" for details.
Type "help" for help.

postgres=# CREATE DATABASE lab_16;
CREATE DATABASE
postgres=# \c lab_16
You are now connected to database "lab_16" as user "postgres".
lab_16=# CREATE TABLE table1 (id SERIAL PRIMARY KEY, name VARCHAR(50));
CREATE TABLE
lab_16=# INSERT INTO table1 (name) VALUES ('George'), ('Jerry'), ('Larry');
INSERT 0 3
lab_16=# SELECT * FROM table1
lab_16-# SELECT * FROM table1;
ERROR:  syntax error at or near "SELECT"
LINE 2: SELECT * FROM table1;
        ^
lab_16=# SELECT * FROM table1;
 id |  name
----+--------
  1 | George
  2 | Jerry
  3 | Larry
(3 rows)


lab_16=#

