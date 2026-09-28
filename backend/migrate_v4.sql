-- Run this against your existing `ecommerce` database.
-- Adds a profile picture column to users. Safe: doesn't touch existing data.
--
-- PowerShell:  Get-Content backend/migrate_v4.sql | mysql -u root -p ecommerce 
--  mysql -u root -p ecommerce -e "DESCRIBE users;"

USE ecommerce;

ALTER TABLE users
    ADD COLUMN avatar_url VARCHAR(255) DEFAULT NULL;
