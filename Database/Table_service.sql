INSERT INTO service (name, site_id) 
SELECT 'Production', id FROM site;
INSERT INTO service (name, site_id) 
SELECT 'Comptabilité', id FROM site;
INSERT INTO service (name, site_id) 
SELECT 'Accueil', id FROM site;
INSERT INTO service (name, site_id) 
SELECT 'Recherche', id FROM site;
INSERT INTO service (name, site_id) 
SELECT 'Informatique', id FROM site;
INSERT INTO service (name, site_id) 
SELECT 'Commercial', id FROM site;