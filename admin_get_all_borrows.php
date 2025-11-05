<?php
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || $_SESSION['role'] != 'admin') {
    echo json_encode([]);
    exit();
}

$sql = "SELECT bb.*, b.title, b.author, u.name as user_name
        FROM borrowed_books bb
        JOIN books b ON bb.book_id = b.id
        JOIN users u ON bb.user_id = u.id
        WHERE bb.return_date IS NULL
        ORDER BY bb.borrow_date DESC";

$result = mysqli_query($conn, $sql);
$borrows = [];

while ($row = mysqli_fetch_assoc($result)) {
    $borrows[] = $row;
}

echo json_encode($borrows);
?>