-- Active: 1708026071767@@team29-database.cobd8enwsupz.us-east-1.rds.amazonaws.com@3306@team29database
CREATE TABLE AboutPage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_number INT NOT NULL,
    version_number VARCHAR(10) NOT NULL,
    release_date DATE NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT NOT NULL
);
