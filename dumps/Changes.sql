-- CUSTOMER CHANGES

-- (add) - [tbluser] - intGoogle
ALTER TABLE `db_usg`.`tbluser` 
ADD COLUMN `intGoogle` VARCHAR(45) NULL DEFAULT NULL AFTER `strFile`;

-- (add) - [tbluser] - intFacebook
ALTER TABLE `db_usg`.`tbluser` 
ADD COLUMN `intFacebook` VARCHAR(45) NULL DEFAULT NULL AFTER `intGoogle`;

-- (fix) - [tbluser] - intPassword
ALTER TABLE `db_usg`.`tbluser` 
CHANGE COLUMN `strPassword` `strPassword` VARCHAR(72) NULL DEFAULT NULL ;
