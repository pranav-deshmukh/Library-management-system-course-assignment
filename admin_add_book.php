<?php
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || $_SESSION['role'] != 'admin' || $_SERVER['REQUEST_METHOD'] != 'POST') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$title = mysqli_real_escape_string($conn, $_POST['title']);
$author = mysqli_real_escape_string($conn, $_POST['author']);
$genre = mysqli_real_escape_string($conn, $_POST['genre']);
$isbn = mysqli_real_escape_string($conn, $_POST['isbn']);
$description = mysqli_real_escape_string($conn, $_POST['description']);

$sql = "INSERT INTO books (title, author, genre, isbn, description, available) 
        VALUES ('$title', '$author', '$genre', '$isbn', '$description', 1)";

if (mysqli_query($conn, $sql)) {
    echo json_encode(['success' => true, 'message' => 'Book added successfully!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to add book']);
}
?>