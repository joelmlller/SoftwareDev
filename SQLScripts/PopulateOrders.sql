-- Active: 1708026071767@@team29-database.cobd8enwsupz.us-east-1.rds.amazonaws.com@3306@team29database
INSERT INTO Orders (id, user_id, product_id, order_status) VALUES
(1, 'ayoon', 1, 'ordered'),
(2, 'ayoon', 2, 'shipped'),
(3, 'ayoon', 4, 'ordered'),
(4, 'ayoon', 3, 'ordered'),
(5, 'adjames', 3, 'ordered'), -- Assuming default status 'ordered'
(6, 'jtest', 4, 'ordered'),
(7, 'joelm', 4, 'shipped');
