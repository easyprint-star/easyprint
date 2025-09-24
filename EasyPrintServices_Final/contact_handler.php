<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    if (!empty($name) && !empty($email) && !empty($message)) {
        // Placeholder for sending email later
        // Example: use PHPMailer here with your SMTP config

        header("Location: thankyou.html");
        exit;
    } else {
        echo "<p>Please fill out all fields.</p>";
    }
} else {
    echo "<p>Invalid request.</p>";
}
?>