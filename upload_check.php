<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';

echo "=== PHP Upload Configuration ===\n";
echo "upload_max_filesize: " . ini_get('upload_max_filesize') . "\n";
echo "post_max_size: " . ini_get('post_max_size') . "\n";
echo "max_execution_time: " . ini_get('max_execution_time') . " seconds\n";
echo "max_input_time: " . ini_get('max_input_time') . " seconds\n";
echo "memory_limit: " . ini_get('memory_limit') . "\n";
echo "max_file_uploads: " . ini_get('max_file_uploads') . "\n";

echo "\n=== Server Information ===\n";
echo "Server: " . $_SERVER['SERVER_SOFTWARE'] . "\n";
echo "PHP Version: " . PHP_VERSION . "\n";
echo "PHP INI File: " . php_ini_loaded_file() . "\n";
?>