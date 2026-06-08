<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

class ApiQuestion
{
    public string $question;
    public array $options;
    public int $correct;

    public function __construct(string $question, array $options, int $correct)
    {
        $this->question = $question;
        $this->options = $options;
        $this->correct = $correct;
    }

    public function toArray(): array
    {
        return [
            "question" => $this->question,
            "options" => $this->options,
            "correct" => $this->correct
        ];
    }
}

class QuizApi
{
    private int $amount;

    public function __construct(int $amount)
    {
        $this->amount = max(5, min($amount, 10));
    }

    public function getQuiz(): array
    {
        $questions = $this->fetchExternalQuestions();

        if (count($questions) === 0) {
            $questions = $this->dummyQuestions();
        }

        return [
            "id" => 0,
            "title" => "Quick API Quiz",
            "source" => "api",
            "questions" => array_map(fn($question) => $question->toArray(), $questions)
        ];
    }

    private function fetchExternalQuestions(): array
    {
        $url = "https://opentdb.com/api.php?amount={$this->amount}&type=multiple";
        $context = stream_context_create([
            "http" => [
                "timeout" => 4
            ]
        ]);
        $response = @file_get_contents($url, false, $context);

        if ($response === false) {
            return [];
        }

        $data = json_decode($response, true);

        if (!isset($data["results"]) || !is_array($data["results"])) {
            return [];
        }

        $questions = [];

        foreach ($data["results"] as $item) {
            if (!isset($item["question"], $item["correct_answer"], $item["incorrect_answers"])) {
                continue;
            }

            $correctAnswer = html_entity_decode($item["correct_answer"], ENT_QUOTES | ENT_HTML5);
            $options = array_map(
                fn($answer) => html_entity_decode($answer, ENT_QUOTES | ENT_HTML5),
                $item["incorrect_answers"]
            );
            $options[] = $correctAnswer;
            shuffle($options);

            $questions[] = new ApiQuestion(
                html_entity_decode($item["question"], ENT_QUOTES | ENT_HTML5),
                $options,
                array_search($correctAnswer, $options, true)
            );
        }

        return $questions;
    }

    private function dummyQuestions(): array
    {
        return [
            new ApiQuestion("Which HTTP method is commonly used to request data from an API?", ["POST", "GET", "DELETE", "PATCH"], 1),
            new ApiQuestion("What does CORS help control?", ["Database passwords", "Cross-origin browser requests", "CSS animations", "File names"], 1),
            new ApiQuestion("What is middleware usually used for?", ["Running code between request and response", "Drawing page icons", "Changing monitor brightness", "Deleting HTML"], 0),
            new ApiQuestion("What format do many web APIs return?", ["JSON", "PNG only", "MP3", "DOCX"], 0),
            new ApiQuestion("Where are this app's saved quizzes loaded from?", ["The quiz_app database", "The browser history", "A Word document", "The image folder"], 0)
        ];
    }
}

$amount = isset($_GET["amount"]) ? (int) $_GET["amount"] : 5;
$api = new QuizApi($amount);

echo json_encode($api->getQuiz());
?>
