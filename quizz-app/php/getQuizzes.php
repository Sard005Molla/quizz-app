<?php
include "db.php";

$result = $conn->query("SELECT * FROM quizzes");

$data = [];

while($q = $result->fetch_assoc()){
    $quiz_id = $q["id"];

    $qs = $conn->query("SELECT * FROM questions WHERE quiz_id=$quiz_id");

    $questions = [];

    while($row = $qs->fetch_assoc()){
        $questions[] = [
            "question"=>$row["question"],
            "options"=>[$row["a"],$row["b"],$row["c"],$row["d"]],
            "correct"=>$row["correct"]
        ];
    }

    $data[] = [
        "id"=>$quiz_id,
        "title"=>$q["title"],
        "questions"=>$questions
    ];
}

echo json_encode($data);
?>