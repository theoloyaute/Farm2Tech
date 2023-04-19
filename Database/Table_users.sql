INSERT INTO users (firstname, lastname, email, fix, mobile, password, service_id)
SELECT 
    firstnames.value || CAST(random() * 1000 AS INT), 
    lastnames.value, 
    firstnames.value || '.' || lastnames.value || '@example.com',
    CONCAT('01', CAST(random() * 100000000 AS INT)),
    CONCAT('06', CAST(random() * 100000000 AS INT)),
    md5(CAST(random() * 100000000 AS INT)::TEXT),
    CAST(random() * 30 + 1 AS INT)
FROM 
    (SELECT unnest(ARRAY['Alice','Bob','Charlie','David','Emma','Frank','Grace','Hannah','Isabella','James']) AS value) AS firstnames,
    (SELECT unnest(ARRAY['Smith','Johnson','Williams','Jones','Brown','Davis','Miller','Wilson','Moore','Taylor']) AS value) AS lastnames
LIMIT 1000;