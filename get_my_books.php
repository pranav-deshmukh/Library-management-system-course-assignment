<?php
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode([]);
    exit();
}

$user_id = $_SESSION['user_id'];

$sql = "SELECT bb.id as borrow_id, b.title, b.author, bb.borrow_date, bb.due_date 
        FROM borrowed_books bb 
        JOIN books b ON bb.book_id = b.id 
        WHERE bb.user_id = $user_id AND bb.return_date IS NULL
        ORDER BY bb.borrow_date DESC";

$result = mysqli_query($conn, $sql);
$books = [];

while ($row = mysqli_fetch_assoc($result)) {
    $books[] = $row;
}

echo json_encode($books);
?>