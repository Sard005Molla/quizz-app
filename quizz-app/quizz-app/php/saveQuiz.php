<?php
session_start();
include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$title = $data["title"];
$questions = $data["questions"];
$user_id = 1;

$conn->query("INSERT INTO quizzes (title, user_id) VALUES ('$title', $user_id)");
$quiz_id = $conn->insert_id;

foreach($questions as $q){
    $question = $q["question"];
    $a = $q["options"][0];
    $b = $q["options"][1];
    $c = $q["options"][2];
    $d = $q["options"][3];
    $correct = $q["correct"];

    $conn->query("INSERT INTO questions 
    (quiz_id, question, a, b, c, d, correct)
    VALUES ($quiz_id,'$question','$a','$b','$c','$d',$correct)");
}

echo "Saved";
?>