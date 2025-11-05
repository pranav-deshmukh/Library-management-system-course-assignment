<?php
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || $_SERVER['REQUEST_METHOD'] != 'POST') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$user_id = $_SESSION['user_id'];
$book_id = mysqli_real_escape_string($conn, $_POST['book_id']);

// Check if user already has 3 books
$count_sql = "SELECT COUNT(*) as count FROM borrowed_books WHERE user_id = $user_id AND return_date IS NULL";
$count_result = mysqli_fetch_assoc(mysqli_query($conn, $count_sql));

if ($count_result['count'] >= 3) {
    echo json_encode(['success' => false, 'message' => 'You can only borrow up to 3 books at a time']);
    exit();
}

// Check if book is available
$book_sql = "SELECT * FROM books WHERE id = $book_id AND available = 1";
$book_result = mysqli_query($conn, $book_sql);

if (mysqli_num_rows($book_result) == 0) {
    echo json_encode(['success' => false, 'message' => 'Book is not available']);
    exit();
}

// Borrow the book
$borrow_date = date('Y-m-d');
$due_date = date('Y-m-d', strtotime('+14 days'));

$insert_sql = "INSERT INTO borrowed_books (user_id, book_id, borrow_date, due_date) 
               VALUES ($user_id, $book_id, '$borrow_date', '$due_date')";

if (mysqli_query($conn, $insert_sql)) {
    // Update book availability
    mysqli_query($conn, "UPDATE books SET available = 0 WHERE id = $book_id");
    echo json_encode(['success' => true, 'message' => 'Book borrowed successfully!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to borrow book']);
}
?>