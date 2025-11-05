<?php
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || $_SERVER['REQUEST_METHOD'] != 'POST') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$user_id = $_SESSION['user_id'];
$borrow_id = mysqli_real_escape_string($conn, $_POST['borrow_id']);

// Get book_id from borrow record
$borrow_sql = "SELECT book_id FROM borrowed_books WHERE id = $borrow_id AND user_id = $user_id";
$borrow_result = mysqli_query($conn, $borrow_sql);

if (mysqli_num_rows($borrow_result) == 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid borrow record']);
    exit();
}

$borrow_row = mysqli_fetch_assoc($borrow_result);
$book_id = $borrow_row['book_id'];

// Update return date
$return_date = date('Y-m-d');
$update_sql = "UPDATE borrowed_books SET return_date = '$return_date' WHERE id = $borrow_id";

if (mysqli_query($conn, $update_sql)) {
    // Make book available again
    mysqli_query($conn, "UPDATE books SET available = 1 WHERE id = $book_id");
    echo json_encode(['success' => true, 'message' => 'Book returned successfully!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to return book']);
}
?>