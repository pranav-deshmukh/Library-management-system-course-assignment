<?php
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || $_SESSION['role'] != 'admin') {
    echo json_encode([]);
    exit();
}

$sql = "SELECT u.*, 
        (SELECT COUNT(*) FROM borrowed_books WHERE user_id = u.id AND return_date IS NULL) as borrowed_count
        FROM users u
        ORDER BY u.id";

$result = mysqli_query($conn, $sql);
$users = [];

while ($row = mysqli_fetch_assoc($result)) {
    $users[] = $row;
}

echo json_encode($users);
?>