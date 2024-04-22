-- Active: 1708026071767@@team29-database.cobd8enwsupz.us-east-1.rds.amazonaws.com@3306@team29database
CREATE TABLE Applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    sponsor_id INT,
    user_id VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    accepted ENUM('pending', 'accepted', 'declined') DEFAULT 'pending',
    FOREIGN KEY (sponsor_id) REFERENCES Sponsor(SponsorID)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
        ON DELETE CASCADE
);
