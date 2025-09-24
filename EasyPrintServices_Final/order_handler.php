<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/uploads/';
        $fileName = basename($_FILES['file']['name']);
        $targetPath = $uploadDir . $fileName;
        if (move_uploaded_file($_FILES['file']['tmp_name'], $targetPath)) {
            header("Location: thankyou.html");
            exit;
        } else {
            echo "<p>Sorry, there was an error uploading your file.</p>";
        }
    } else {
        echo "<p>No file uploaded or an error occurred.</p>";
    }
} else {
    echo "<p>Invalid request.</p>";
}
?>