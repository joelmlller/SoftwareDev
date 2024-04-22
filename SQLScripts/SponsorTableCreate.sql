-- Active: 1708026071767@@team29-database.cobd8enwsupz.us-east-1.rds.amazonaws.com@3306@team29database
CREATE TABLE Sponsor (
    SponsorID INT AUTO_INCREMENT PRIMARY KEY,
    SponsorName VARCHAR(255) NOT NULL,
    SponsorPointRatio DECIMAL(10,2) NOT NULL,
    IsActive BOOLEAN DEFAULT TRUE
);
