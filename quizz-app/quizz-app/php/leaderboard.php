<?php
header("Content-Type: application/json");
include "db.php";

$sql = "
SELECT users.username,
       COUNT(results.id) AS attempts,
       ROUND(AVG(results.score / results.total * 100), 1) AS avg_score,
       ROUND(MAX(results.score / results.total * 100), 1) AS best_score
FROM results
JOIN users ON results.user_id = users.id
WHERE results.total > 0
GROUP BY users.id, users.username
ORDER BY avg_score DESC, best_score DESC, attempts DESC
LIMIT 10
";

$res = $conn->query($sql);
$data = [];

while ($row = $res->fetch_assoc()) {
    $data[] = [
        "username" => $row["username"],
        "attempts" => (int)$row["attempts"],
        "avg_score" => (float)$row["avg_score"],
        "best_score" => (float)$row["best_score"]
    ];
}

echo json_encode($data);
?>