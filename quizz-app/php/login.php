<?php
session_start();
header("Content-Type: application/json");
include "db.php";

$data = json_decode(file_get_contents("php://input"), true) ?: [];
$user = trim($data["username"] ?? "");
$pass = $data["password"] ?? "";

if ($user === "" || $pass === "") {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Please enter both username and password."]);
    exit;
}

$stmt = $conn->prepare("SELECT id, username, password FROM users WHERE username = ? LIMIT 1");
$stmt->bind_param("s", $user);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "User not found."]);
    exit;
}

$row = $res->fetch_assoc();

if (!password_verify($pass, $row["password"])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Wrong password."]);
    exit;
}

$_SESSION["user_id"] = (int)$row["id"];
$_SESSION["username"] = $row["username"];

echo json_encode(["success" => true, "message" => "Successfully logged in. Redirecting...", "username" => $row["username"]]);
?>