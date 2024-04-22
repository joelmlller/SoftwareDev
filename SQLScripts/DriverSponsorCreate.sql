-- Active: 1708026071767@@team29-database.cobd8enwsupz.us-east-1.rds.amazonaws.com@3306@team29database
CREATE TABLE DriverSponsor (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    userID VARCHAR(255),
    SponsorID INT,
    FOREIGN KEY (userID) REFERENCES Users(user_id)
        ON DELETE CASCADE,
    FOREIGN KEY (SponsorID) REFERENCES Sponsor(SponsorID)
        ON DELETE CASCADE
);
