-- Active: 1708026071767@@team29-database.cobd8enwsupz.us-east-1.rds.amazonaws.com@3306@team29database
CREATE TABLE Catalog (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sponsorID INT,
    productID INT,
    FOREIGN KEY (sponsorID) REFERENCES Sponsor(SponsorID)
        ON DELETE CASCADE
);
