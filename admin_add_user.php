<?php
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || $_SESSION['role'] != 'admin' || $_SERVER['REQUEST_METHOD'] != 'POST') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$username = mysqli_real_escape_string($conn, $_POST['username']);
$password = mysqli_real_escape_string($conn, $_POST['password']);
$name = mysqli_real_escape_string($conn, $_POST['name']);
$email = mysqli_real_escape_string($conn, $_POST['email']);
$role = mysqli_real_escape_string($conn, $_POST['role']);

// Check if username already exists
$check_sql = "SELECT COUNT(*) as count FROM users WHERE username = '$username'";
$check_result = mysqli_fetch_assoc(mysqli_query($conn, $check_sql));

if ($check_result['count'] > 0) {
    echo json_encode(['success' => false, 'message' => 'Username already exists']);
    exit();
}

// For simplicity, storing plain text password
// In production, use: password_hash($password, PASSWORD_DEFAULT)
$sql = "INSERT INTO users (username, password, name, email, role) 
        VALUES ('$username', '$password', '$name', '$email', '$role')";

if (mysqli_query($conn, $sql)) {
    echo json_encode(['success' => true, 'message' => 'User added successfully!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to add user: ' . mysqli_error($conn)]);
}
?>