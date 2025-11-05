-- Create database
CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;
-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Books table
CREATE TABLE books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    genre VARCHAR(50),
    isbn VARCHAR(20),
    description TEXT,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Borrowed books table
CREATE TABLE borrowed_books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    borrow_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);
-- Insert sample users (passwords are hashed with password_hash())
-- Password for john.doe: user123
-- Password for admin: admin123
INSERT INTO users (username, password, name, email, role)
VALUES (
        'john.doe',
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'John Doe',
        'john.doe@library.com',
        'user'
    ),
    (
        'admin',
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'Admin User',
        'admin@library.com',
        'admin'
    ),
    (
        'jane.smith',
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'Jane Smith',
        'jane.smith@library.com',
        'user'
    );
-- Insert sample books
INSERT INTO books (
        title,
        author,
        genre,
        isbn,
        description,
        available
    )
VALUES (
        'The Great Gatsby',
        'F. Scott Fitzgerald',
        'Fiction',
        '978-0-7432-7356-5',
        'A classic American novel set in the Jazz Age',
        TRUE
    ),
    (
        'To Kill a Mockingbird',
        'Harper Lee',
        'Fiction',
        '978-0-06-112008-4',
        'A powerful story of racial injustice',
        FALSE
    ),
    (
        '1984',
        'George Orwell',
        'Science Fiction',
        '978-0-452-28423-4',
        'A dystopian novel about totalitarian control',
        TRUE
    ),
    (
        'Pride and Prejudice',
        'Jane Austen',
        'Romance',
        '978-0-14-143951-8',
        'A witty and romantic novel',
        TRUE
    ),
    (
        'The Catcher in the Rye',
        'J.D. Salinger',
        'Fiction',
        '978-0-316-76948-0',
        'A coming-of-age story',
        FALSE
    ),
    (
        'Harry Potter',
        'J.K. Rowling',
        'Fiction',
        '978-0-439-70818-8',
        'The magical story of a young wizard',
        TRUE
    ),
    (
        'The Da Vinci Code',
        'Dan Brown',
        'Mystery',
        '978-0-307-27430-4',
        'A thrilling mystery',
        TRUE
    ),
    (
        'Steve Jobs',
        'Walter Isaacson',
        'Biography',
        '978-1-451-64853-9',
        'Biography of Steve Jobs',
        TRUE
    );