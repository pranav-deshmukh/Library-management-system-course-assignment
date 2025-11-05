# Simple Library Management System

A basic library management system built with HTML, CSS, JavaScript, PHP, and MySQL.

## Features

- User login/logout
- Browse books with search and filters
- Borrow books (max 3 per user)
- Return books
- View borrowed books
- Real-time statistics

## Installation Steps

### 1. Setup Requirements

- XAMPP or WAMP (includes Apache, PHP, MySQL)
- Web browser

### 2. Database Setup

1. Start XAMPP/WAMP
2. Open phpMyAdmin (http://localhost/phpmyadmin)
3. Create a new database named `library_db`
4. Import the `database.sql` file OR run the SQL queries in it

### 3. File Setup

1. Copy all files to your web server directory:

   - For XAMPP: `C:\xampp\htdocs\library\`
   - For WAMP: `C:\wamp64\www\library\`

2. Make sure these files are in the folder:
   - config.php
   - login.php
   - login_process.php
   - dashboard.php
   - get_books.php
   - get_my_books.php
   - borrow_book.php
   - return_book.php
   - logout.php
   - database.sql

### 4. Configuration

Open `config.php` and update if needed:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');          // Change if different
define('DB_PASS', '');               // Add password if you set one
define('DB_NAME', 'library_db');
```

### 5. Access the System

1. Open browser
2. Go to: `http://localhost/library/login.php`

## Demo Accounts

**User Account:**

- Username: `john.doe`
- Password: `user123`

**Admin Account:**

- Username: `admin`
- Password: `admin123`

**Other User:**

- Username: `jane.smith`
- Password: `user123`

## Usage

1. **Login:** Use demo accounts or create new users in database
2. **Browse Books:** Search and filter books by genre/availability
3. **Borrow Book:** Click "Borrow" button (max 3 books)
4. **My Books Tab:** View your borrowed books
5. **Return Book:** Click "Return" button
6. **Logout:** Click logout button in navbar

## File Structure

```
library/
│
├── config.php              # Database configuration
├── login.php               # Login page
├── login_process.php       # Login handler
├── dashboard.php           # Main dashboard
├── get_books.php          # API: Get all books
├── get_my_books.php       # API: Get user's borrowed books
├── borrow_book.php        # API: Borrow a book
├── return_book.php        # API: Return a book
├── logout.php             # Logout handler
└── database.sql           # Database structure and data
```

## Database Tables

**users** - Store user information

- id, username, password, name, email, role, created_at

**books** - Store book information

- id, title, author, genre, isbn, description, available, created_at

**borrowed_books** - Track borrowed books

- id, user_id, book_id, borrow_date, due_date, return_date

## Common Issues

**Problem:** Cannot connect to database

- **Solution:** Make sure MySQL is running in XAMPP/WAMP

**Problem:** Page not found

- **Solution:** Check the URL is correct: `http://localhost/library/login.php`

**Problem:** Login not working

- **Solution:** Make sure database is created and has sample data

## Notes

- Books are borrowed for 14 days
- Users can borrow maximum 3 books at a time
- This is a simple educational project
- Passwords are stored in plain text (not secure for production)

## Future Enhancements (Optional)

- Admin panel for managing books
- Book covers/images
- Email notifications
- Fine calculation for overdue books
- User registration
- Password hashing (use password_hash() in PHP)
