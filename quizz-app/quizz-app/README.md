# Ultimate Quiz Platform

A small PHP/MySQL quiz web app built for XAMPP. Users can register, log in, create quizzes, take quizzes, view results, check statistics, and see a leaderboard.

## Features

- User registration and login
- Database-backed quiz creation
- Database-backed quiz listing
- Quiz taking with progress tracking
- Result review page
- User statistics
- Leaderboard
- Quick API quiz button with an external trivia API and local dummy-data fallback

## Requirements

- XAMPP with Apache and MySQL/MariaDB
- PHP 8+
- A MySQL database named `quiz_app`

## Setup

1. Copy this folder into your XAMPP `htdocs` folder.
2. Start Apache and MySQL from XAMPP.
3. Create the database by importing [database/quiz_app.sql](database/quiz_app.sql) in phpMyAdmin.
4. Check the database credentials in [php/db.php](php/db.php).
5. Open the app in your browser.

Example local URL:

```text
http://127.0.0.1:8080/quizz-app/index.html
```

Your XAMPP may use a different Apache port, such as `80` or `8080`.

## Database Connection

The current app uses:

```php
new mysqli("localhost", "root", "", "quiz_app");
```

If MySQL rejects `root` with no password, update [php/db.php](php/db.php) with the correct local MySQL username and password.

## Quick API Quiz

The "Start a Quiz Right Away!" button calls:

```text
php/quickQuiz.php?amount=5
```

That endpoint:

- Handles the HTTP request from the client app
- Uses simple PHP classes to normalize quiz data
- Includes CORS headers and an OPTIONS preflight handler
- Tries to load questions from Open Trivia DB
- Falls back to local dummy questions if the external API is unavailable

## GitHub Note

Commit this application folder, not the raw MySQL data folder from `xampp/mysql/data/quiz_app`.
