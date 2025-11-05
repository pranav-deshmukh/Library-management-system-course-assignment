<?php
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || $_SESSION['role'] != 'admin' || $_SERVER['REQUEST_METHOD'] != 'POST') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$user_id = mysqli_real_escape_string($conn, $_POST['user_id']);

// Check if user has borrowed books
$check_sql = "SELECT COUNT(*) as count FROM borrowed_books WHERE user_id = $user_id AND return_date IS NULL";
$check_result = mysqli_fetch_assoc(mysqli_query($conn, $check_sql));

if ($check_result['count'] > 0) {
    echo json_encode(['success' => false, 'message' => 'Cannot delete user. They have borrowed books.']);
    exit();
}

$sql = "DELETE FROM users WHERE id = $user_id AND role != 'admin'";

if (mysqli_query($conn, $sql)) {
    echo json_encode(['success' => true, 'message' => 'User deleted successfully!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to delete user']);
}
?>