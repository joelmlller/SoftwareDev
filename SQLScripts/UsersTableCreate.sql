-- Active: 1708026071767@@team29-database.cobd8enwsupz.us-east-1.rds.amazonaws.com@3306@team29database
CREATE TABLE Users (
    user_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    usertype ENUM('admin', 'sponsor', 'driver') NOT NULL,
    points INT DEFAULT 0,
    sponsor INT,
    accepted ENUM('pending', 'declined', 'accepted') NOT NULL,
    FOREIGN KEY (sponsor) REFERENCES Sponsor(SponsorID)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);
