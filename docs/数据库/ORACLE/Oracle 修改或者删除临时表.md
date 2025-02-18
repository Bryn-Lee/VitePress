```sql
select 'alter system kill session ''' || sid || ',' || serial# || ''';' "copy this sql"
  FROM v$session
 WHERE sid in
       (SELECT sid
          FROM v$lock
         WHERE id1 = (SELECT object_id
                        FROM all_objects
                       WHERE object_name = upper('TMP_ACC33030_Q')));
```
