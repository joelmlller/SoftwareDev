-- Active: 1708026071767@@team29-database.cobd8enwsupz.us-east-1.rds.amazonaws.com@3306@team29database
CREATE TABLE Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255),
    product_id INT,
    order_status ENUM('ordered', 'shipped', 'delivered', 'canceled', 'returned') DEFAULT 'ordered',
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
        ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Catalog(productID)
        ON DELETE CASCADE
);
