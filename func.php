<?php
/*
* Function 說明
**************************************************
* Input : type('d'|'m'), data(json)
* Output : ok (-2=非活動期間; -1=有資料未填; 0=有格式錯誤; 1=成功)
* Output : field (ok=-0 & -1 才有, 有問題的欄位)
**************************************************
*/
ini_set('memory_limit', '-1');

header("Content-Type:text/html; charset=utf-8");

include_once 'db.inc.php';
include_once 'class/common.class.php';

//PHP錯誤顯示設定
ini_set("display_errors", "Off"); // 顯示錯誤是否打開( On=開, Off=關 )
error_reporting(E_ALL & ~E_NOTICE);

//設定時區 並 取得目前時間
date_default_timezone_set("Asia/Taipei");
$nowDateTime = date('Y-m-d H:i:s');
$nowDate = date('Y-m-d');

//class init
$common=new Common();

//format
$mobileFormat="/(^09[0-9]{8})/";		//Mobile
$telFormat="/(^[0-9]{2,3}-[0-9]{6,8})/";		//Tel
$emailFormat="/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/";	//Email
$scoreFormat="/(^[0-9])/";		//分數

$json=null;

//***** Define information -- 活動期間
//$startDate = "2018-06-01 10:00:00";	//正式為2018-07-07 10:00
//$endDate = "2018-07-25 23:59:59"; //***本日仍在活動中

if (strcmp($_SERVER['HTTP_HOST'],"wwwosc.ad2iction.com")==0) {	//只接受本機傳送資料
   if (isset($_POST['func'])) {
   	$func=trim($_POST['func']);

      if (strcmp($func,"submit")==0) {
         $data=(array)$_POST['data'];

         $check_status=1;  //必填及格式檢查結果 (1=通過, 0=有問題)
         $fields=array();

/*
         //檢查是否在活動期間
         if (strtotime($startDate) > strtotime($nowDateTime)) {		//活動未開始
            $check_status=0;
         } else if (strtotime($nowDateTime) > strtotime($endDate)) {	//活動截止
            $check_status=0;
         }
*/


         if ($check_status==0) { //不在活動期間
            $json=array('ok'=>-2,'S'=>$startDate, 'enddate'=>strtotime($endtDate),'now'=>strtotime($nowDateTime));
         } else {
            //檢查所有欄位是否有填
            foreach($data as $key=>$value) {
               $data[$key]=trim($value);
               if (strlen($data[$key])==0) {
                  array_push($fields,$key);
                  $check_status=0;
               }
            }


            if ($check_status==0) {  //有空值
               $json=array('ok'=>-1, 'fields'=>$fields);
            } else {
               //格式檢查
               if (!preg_match($mobileFormat, $data['tel'])) {
   					array_push($fields, 'tel');
                  $check_status=0;
   				}
               if (strlen($data['mail'])==0) {
   					array_push($fields, 'mail');
                  $check_status=0;
   				}

               if ($check_status==0) {  //格式有錯
                  $json=array('ok'=>0, 'fields'=>$fields);
               } else {
                  $db=new Database();

                  //新增參加者資料
                  $db->query("INSERT INTO User(u_name,u_tel,u_mail,u_c_date) VALUES(:u_name,:u_tel,:mail,'".$nowDateTime."')");

                  $db->bind(':u_name', $data['name']);
                  $db->bind(':u_tel', $data['tel']);
                  $db->bind(':u_mail', $data['mail']);

                  executeLoop($db);

                  $json=array('ok'=>1);
               }
            }
         }
      }
      echo json_encode($json);
   }
}

function executeLoop($db) {
	try {
		$db->execute();
	} catch (PDOException $e) {
		$db=new Database();
		executeLoop($db);
	}
}
?>
