WITH firstnames AS (
  SELECT unnest('{Emma,Liam,Noah,Olivia,Ethan,Ava,William,Sophia,Mason,Isabella,Mia,Logan,Charlotte,Jackson,Amelia,Lucas,Harper,Oliver,Evelyn,Aiden,Abigail,Elijah,Emily,Grayson,Elizabeth,Carter,Sofia,Sebastian,Madison,Avery,Evelyn,Owen,Layla,Ethan,Riley,Christopher,Lily,Joshua,Aubrey,David,Lillian,Jack,Addison,Luke,Natalie,Andrew,Hannah,Nicholas,Aria,Isaac,Avery,Evan,Brooklyn,William,Sofia,Ryan,Ellie,Aiden,Hazel,Alexander,Audrey,Nathaniel,Caroline,Caleb,Leah,Henry,Savannah,Eli,Kennedy,Landon,Claire,Gabriel,Skylar,Anthony,Violet,Mason,Stella,Addison,Aurora,Dylan,Savannah,Hunter,Paisley,Samuel,Nova,Leo,Emilia,Lincoln,Ellie,Isaiah,Autumn,Christopher,Jasmine}'::text[]) AS firstname
), lastnames AS (
  SELECT unnest('{Smith,Johnson,Brown,Taylor,Miller,Anderson,Wilson,Davis,Martin,Moore,Harris,Clark,Lewis,Robinson,Walker,Young,Allen,King,Wright,Scott,Green,Baker,Adams,Nelson,Carter,Mitchell,Perez,Roberts,Turner,Phillips,Campbell,Parker,Evans,Edwards,Collins,Stewart,Sanchez,Morris,Rogers,Reed,Cook,Morgan,Bell,Murphy,Bailey,Rivera,Cooper,Richardson,Cox,Howard,Ward,Torres,Peterson,Gray,Ramirez,James,Watson,Brooks,Kelly,Sanders,Price,Bennett,Wood,Barnes,Ross,Henderson,Coleman,Jenkins,Perry,Powell,Sullivan,Long,Foster,Cunningham,Blake,Sherman,Hopkins,Fowler,Matthews,Hunter,Reynolds,Vasquez,Porter,Gibson,Bryant,Mayo,Holland,Shaw,Pena,Holt,Cannon,May,Parks,Barrett,Navarro,Harper,Jimenez,Wolf,Frazier,Leonard,Mendoza,Tyler,Gross,Stokes,Figueroa,Flynn,Harrell,Fleming,Gates,Baldwin,Griffin,Mejia}'::text[]) AS lastname
), domains AS (
  SELECT unnest('{gmail.com,yahoo.com,outlook.com,hotmail.com}'::text[]) AS domain
)

INSERT INTO users (firstname, lastname, email, fix, mobile, password, service_id)
SELECT 
  firstnames.firstname,
  lastnames.lastname,
  firstnames.firstname || '.' || lastnames.lastname || '@' || domains.domain AS email,
  CONCAT('01', CAST(random() * 100000000 AS INT)),
  CONCAT('06', CAST(random() * 100000000 AS INT)),
  md5(RANDOM()::TEXT) AS password,
  service.id
FROM firstnames, lastnames, domains, service
ORDER BY RANDOM()
LIMIT 1000;