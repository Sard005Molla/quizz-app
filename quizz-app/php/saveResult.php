<?php
session_start();
header("Content-Type: application/json");

if (empty($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["success" => false, "saved" => false, "message" => "Log in to save this result to your stats and the leaderboard."]);
    exit;
}

include "db.php";

$data = json_decode(file_get_contents("php://input"), true) ?: [];
$user_id = (int)$_SESSION["user_id"];
$quiz_id = (int)($data["quiz_id"] ?? 0);
$score = (int)($data["score"] ?? -1);
$total = (int)($data["total"] ?? 0);

if ($quiz_id <= 0 || $score < 0 || $total <= 0 || $score > $total) {
    http_response_code(400);
    echo json_encode(["success" => false, "saved" => false, "message" => "Invalid result data."]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO results (user_id, quiz_id, score, total) VALUES (?, ?, ?, ?)");
$stmt->bind_param("iiii", $user_id, $quiz_id, $score, $total);
$stmt->execute();

echo json_encode(["success" => true, "saved" => true, "message" => "Result saved to your stats."]);
?>