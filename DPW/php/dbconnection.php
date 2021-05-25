<?php
function OpenCon()
 {
    $conn = new PDO('mysql:host=localhost;dbname=DPW', "app_usr", "password");
    return $conn;
 }
?>