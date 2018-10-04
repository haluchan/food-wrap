<?php
/**
 * Created by PhpStorm.
 * User: halu
 * Date: 2018/9/20
 * Time: 12:31
 */
//ob_start();
//session_start();
date_default_timezone_set("Asia/Taipei");
header("Content-Type:text/html;charset=utf-8");

$postdata = file_get_contents("php://input",'r');
$request = json_decode($postdata);
$nowDateTime = date('Y-m-d H:i:s');

try{
  //連線到資料庫
  require_once("dbinfo.php");
  //取得前端送的資料
//  $pdo->beginTransaction();
  $Name = $request->name;
  $Mail = $request->mail;
  $Tel = $request->tel;


  //準備好指令
  $sql = "INSERT INTO User( u_name , u_tel , u_mail ,u_c_date) VALUES(:memName , :memTel ,:memMail ,:memDate)";
  //編譯該指令
  $actSignUp = $pdo->prepare( $sql );

  //帶入實際參數資料
  // $actSignUp->bindValue(1, $memId);
  // $actSignUp->bindValue(2, $memPsw);
  $actSignUp->bindValue(":memName", $Name);
  $actSignUp->bindValue(":memTel", $Tel);
  $actSignUp->bindValue(":memMail", $Mail);
  $actSignUp->bindValue(":memDate", $nowDateTime);

  //執行該指令
  $actSignUp->execute();

  echo "ok";

}catch( PDOException $e){
//  $pdo->rollback();//有錯的話回覆不寫入
  echo "資料庫操作失敗,原因：",$e->getMessage(),"<br>";
  echo "行號：",$e->getLine(),"<br>";
}