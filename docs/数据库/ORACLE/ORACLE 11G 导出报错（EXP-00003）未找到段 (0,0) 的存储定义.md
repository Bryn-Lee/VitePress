```sql
SELECT 'alter table ' || OWNER || '.' || table_name || ' allocate extent;'
  FROM dba_tables
 WHERE segment_created = 'NO'
   and OWNER = 'WOLF'
```

