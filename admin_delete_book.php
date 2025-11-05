<?php
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || $_SESSION['role'] != 'admin' || $_SERVER['REQUEST_METHOD'] != 'POST') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$book_id = mysqli_real_escape_string($conn, $_POST['book_id']);

// Check if book is currently borrowed
$check_sql = "SELECT COUNT(*) as count FROM borrowed_books WHERE book_id = $book_id AND return_date IS NULL";
$check_result = mysqli_fetch_assoc(mysqli_query($conn, $check_sql));

if ($check_result['count'] > 0) {
    echo json_encode(['success' => false, 'message' => 'Cannot delete book. It is currently borrowed.']);
    exit();
}

// Check if book has any borrowing history
$history_sql = "SELECT COUNT(*) as count FROM borrowed_books WHERE book_id = $book_id";
$history_result = mysqli_fetch_assoc(mysqli_query($conn, $history_sql));

if ($history_result['count'] > 0) {
    // Book has history, so delete the history records first
    $delete_history = "DELETE FROM borrowed_books WHERE book_id = $book_id";
    mysqli_query($conn, $delete_history);
}

// Now delete the book
$sql = "DELETE FROM books WHERE id = $book_id";

if (mysqli_query($conn, $sql)) {
    echo json_encode(['success' => true, 'message' => 'Book deleted successfully!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to delete book: ' . mysqli_error($conn)]);
}
?>