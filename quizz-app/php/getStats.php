<?php
session_start();
header("Content-Type: application/json");

if (empty($_SESSION["user_id"])) {
    echo json_encode(["loggedIn" => false, "message" => "Log in to see your saved quiz stats.", "results" => []]);
    exit;
}

include "db.php";

$user_id = (int)$_SESSION["user_id"];
$stmt = $conn->prepare("SELECT score, total, created_at FROM results WHERE user_id = ? ORDER BY created_at DESC");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$res = $stmt->get_result();

$results = [];
$totalPercent = 0;
$best = null;

while ($row = $res->fetch_assoc()) {
    $percent = $row["total"] > 0 ? round(($row["score"] / $row["total"]) * 100, 1) : 0;
    $totalPercent += $percent;
    $best = $best === null ? $percent : max($best, $percent);
    $results[] = [
        "score" => (int)$row["score"],
        "total" => (int)$row["total"],
        "percent" => $percent,
        "created_at" => $row["created_at"]
    ];
}

$count = count($results);

echo json_encode([
    "loggedIn" => true,
    "username" => $_SESSION["username"] ?? "User",
    "count" => $count,
    "average" => $count ? round($totalPercent / $count, 1) : 0,
    "best" => $best ?? 0,
    "results" => $results
]);
?>