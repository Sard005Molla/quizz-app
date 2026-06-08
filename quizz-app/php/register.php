<?php
session_start();
header("Content-Type: application/json");
include "db.php";

$data = json_decode(file_get_contents("php://input"), true) ?: [];
$user = trim($data["username"] ?? "");
$password = $data["password"] ?? "";

if ($user === "" || $password === "") {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Please choose a username and password."]);
    exit;
}

if (strlen($password) < 4) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Password must be at least 4 characters."]);
    exit;
}

$check = $conn->prepare("SELECT id FROM users WHERE username = ? LIMIT 1");
$check->bind_param("s", $user);
$check->execute();

if ($check->get_result()->num_rows > 0) {
    http_response_code(409);
    echo json_encode(["success" => false, "message" => "That username is already taken."]);
    exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
$stmt->bind_param("ss", $user, $hash);
$stmt->execute();

$_SESSION["user_id"] = $stmt->insert_id;
$_SESSION["username"] = $user;

echo json_encode(["success" => true, "message" => "Successfully registered. Redirecting...", "username" => $user]);
?>