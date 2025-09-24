<?php
if (isset($_FILES['files'])) {
    $uploadDir = "uploads/";

    // Create uploads folder if not exists
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $files = $_FILES['files'];
    $total = count($files['name']);

    echo "<h2>📂 Upload Results</h2><ul>";

    for ($i = 0; $i < $total; $i++) {
        $fileName = basename($files['name'][$i]);
        $targetPath = $uploadDir . $fileName;

        if ($files['error'][$i] === UPLOAD_ERR_OK) {
            if (move_uploaded_file($files['tmp_name'][$i], $targetPath)) {
                echo "<li>✅ " . htmlspecialchars($fileName) . " uploaded successfully.</li>";
            } else {
                echo "<li>❌ Failed to upload " . htmlspecialchars($fileName) . ".</li>";
            }
        } else {
            echo "<li>⚠️ Error with " . htmlspecialchars($fileName) . ".</li>";
        }
    }

    echo "</ul><a href='order.html'>Go Back</a>";
} else {
    echo "<h2>⚠️ No files selected.</h2>";
    echo "<a href='order.html'>Go Back</a>";
}
?>
