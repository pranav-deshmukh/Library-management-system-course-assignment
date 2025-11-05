<?php
require_once 'config.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode([]);
    exit();
}

$search = isset($_GET['search']) ? mysqli_real_escape_string($conn, $_GET['search']) : '';
$genre = isset($_GET['genre']) ? mysqli_real_escape_string($conn, $_GET['genre']) : '';
$available = isset($_GET['available']) ? mysqli_real_escape_string($conn, $_GET['available']) : '';

$sql = "SELECT * FROM books WHERE 1=1";

if (!empty($search)) {
    $sql .= " AND (title LIKE '%$search%' OR author LIKE '%$search%')";
}

if (!empty($genre)) {
    $sql .= " AND genre = '$genre'";
}

if ($available !== '') {
    $sql .= " AND available = $available";
}

$sql .= " ORDER BY title";

$result = mysqli_query($conn, $sql);
$books = [];

while ($row = mysqli_fetch_assoc($result)) {
    $books[] = $row;
}

header('Content-Type: application/json');
echo json_encode($books);
?>