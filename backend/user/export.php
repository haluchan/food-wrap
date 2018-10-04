<?php
session_start();

header("Content-Type:text/html; charset=utf-8");

define("CONFIG_DIR",dirname(__FILE__).'/../../');
include_once CONFIG_DIR.'db.inc.php';
include_once CONFIG_DIR.'class/accesstoken.class.php';
include_once CONFIG_DIR.'class/common.class.php';

//PHP錯誤顯示設定
ini_set("display_errors", "Off"); // 顯示錯誤是否打開( On=開, Off=關 )
error_reporting(E_ALL & ~E_NOTICE);

//class init
$accesstoken=new AccessToken();	//access_token
$common=new Common();
if ($common->checkAdminIdentification($accesstoken,$_SESSION['token'])) {
	$db=new Database();

	//獲取數據
	//產生欄位

	$filename="UserData.xls";
	header("Content-Type: text/csv; charset=utf8");
	header("Content-Type: application/vnd.ms-excel;charset=UTF-8");
	header("Content-Disposition: attachment; filename=$filename");
	header("Pragma: no-cache");
	header("Expires: 0");

	echo '<table border="1px"><tr>';

	//產生標頭
	/*
	echo "<td>".iconv("UTF-8",'big5','編號')."</td>";
	echo "<td>".iconv("UTF-8",'big5','姓名')."</td>";
	echo "<td>".iconv("UTF-8",'big5','電話')."</td>";
	echo "<td>".iconv("UTF-8",'big5','信箱')."</td>";
	echo "<td>".iconv("UTF-8",'big5','參加日期')."</td>";
	*/
	echo "<td>#</td>";
	echo "<td>Name</td>";
	echo "<td>Mobile</td>";
	echo "<td>Mail</td>";
	echo "<td>Join Date</td>";	

	$db->query('select * from User ORDER BY u_no DESC');
	$rows = $db->resultset();

	foreach($rows as $row){
		echo "<tr>";
      echo "<td>".$row['u_no']."</td>";
		echo "<td>".convertSpecialCharToUniCode($row['u_name'])."</td>";
		echo "<td>#".$row['u_tel']."</td>";
		echo "<td>".convertSpecialCharToUniCode($row['u_mail'])."</td>";
		echo "<td>".$row['u_c_date']."</td>";
      echo "</tr>";
	}

	echo '</table>';
	$db=null;
}

function convertSpecialCharToUniCode($str) {
	$arrStr=preg_split('/(?<!^)(?!$)/u',$str);
	$unicode_html='';

	$unicode_html = '&#' . base_convert(bin2hex(iconv("utf-8", "ucs-4", $arrStr[0])), 16, 10) . ';';

	if (count($arrStr)>1) {
		array_shift($arrStr);
		$unicode_html = $unicode_html.convertSpecialCharToUniCode(implode('',$arrStr));
	} else {
		return $unicode_html;
	}

	return $unicode_html;
}
?>
