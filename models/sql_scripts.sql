CREATE TABLE user_books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    bookID INT NOT NULL,
    FOREIGN KEY (userID) REFERENCES users(ID),
    FOREIGN KEY (bookID) REFERENCES books(ID),
    UNIQUE (userID, bookID)
);