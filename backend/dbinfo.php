<?php
/**
 * Created by PhpStorm.
 * User: halu
 * Date: 2018/9/20
 * Time: 12:30
 */

$dns = "mysql:host=106.187.52.106;dbname=ad2_kureha;port=3306;charset=utf8";
$user = "ad2_outsource";
$password = "GJTSdJ9Q5rnGnLbc";
$options = array( PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION);
$pdo = new PDO($dns, $user, $password, $options);


//$dsn = "mysql:host=127.0.0.1;dbname=foodwarp;port=8889;charset=utf8";
//$user = "root";
//$password = "root";
//$options = array( PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION);
//$pdo = new PDO($dsn, $user, $password, $options);

//try {
//  $pdo = new PDO($dns, $user, $password, $options);
//  echo "连接成功";
//}
//catch(PDOException $e)
//{
//  echo $e->getMessage();
//}