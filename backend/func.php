<?php
ini_set('memory_limit', '-1');

session_start();

header("Content-Type:text/html; charset=utf-8");

define("CONFIG_DIR",dirname(__FILE__).'/../');
include_once CONFIG_DIR.'db.inc.php';
include_once CONFIG_DIR.'class/accesstoken.class.php';
include_once CONFIG_DIR.'class/common.class.php';

//PHP錯誤顯示設定
ini_set("display_errors", "Off"); // 顯示錯誤是否打開( On=開, Off=關 )
error_reporting(E_ALL & ~E_NOTICE);

//設定時區 並 取得目前時間
date_default_timezone_set("Asia/Taipei");
$nowdate = date('Y/m/d H:i:s');

//class init
$accesstoken=new AccessToken();	//access_token
$common=new Common();

//variable init
$listcount=20;
$json=null;

if (strcmp($_SERVER['HTTP_HOST'],"wwwosc.ad2iction.com")==0) {	//只接受本機傳送資料
	if (isset($_POST['func'])) {
		$func=trim($_POST['func']);

		$db=new Database();

		if (!(strcmp($func,"AdminLogin")==0)) {	//如果不是登入頁, 則都需要 check 是不是管理員身份
			if (!$common->checkAdminIdentification($accesstoken,$_SESSION['token'])) {
				$json=array('OK'=>'0');
			}
		}

		if ($json==null) {
			switch ($func) {
				case "AdminLogin":
					if (isset($_POST['id']) && isset($_POST['pwd'])) {
						$id=$common->replaceParameter($_POST['id']);
						$pwd=sha1($common->replaceParameter($_POST['pwd']));

						$db->query('SELECT a_no FROM Admin WHERE a_id=:a_id AND a_pwd=:a_pwd');
						$db->bind(':a_id', $id);
						$db->bind(':a_pwd', $pwd);
						$rows = $db->resultset();

						if ($db->rowCount()==1) {	//找到資料
							$_SESSION['a_no']=$rows[0]['a_no'];
                     $_SESSION['a_id']=$id;

							//產生 Totken
							$_SESSION['token']=$accesstoken->grante_token($func);

							$json=array('OK'=>'1');
						} else {
							$json=array('OK'=>'0');
						}
					}
					break;
				case "GetAdminInfo":
					$json=array('OK'=>'1', 'a_id'=>$_SESSION['a_id']);
					break;
				case "AdminLogout":
					$common->clearAllSession();
					$json=array('OK'=>'1');
					break;
				case "IsAdmin":
					$json=array('OK'=>'1');
					break;
				case "PageList":
					if (isset($_POST['table']) && isset($_POST['fields']) && isset($_POST['arrFilterFields']) && isset($_POST['arrOtherFields']) && isset($_POST['order']) && isset($_POST['page'])) {
						if (strlen(trim($_POST['table']))>0 && strlen(trim($_POST['fields']))>0) {
							$table=$common->replaceParameter($_POST['table']);
							$tableprefix=$common->getTablePrefix($table);
							$fields=$common->replaceParameter($_POST['fields']);
							if (is_array($_POST['arrOtherFields'])) {
								$arrOtherFields=(array)($_POST['arrOtherFields']);
							} else {
								$arrOtherFields='';
							}
							if (is_array($_POST['arrFilterFields'])) {
								$arrFilterFields=(array)($_POST['arrFilterFields']);
							} else {
								$arrFilterFields='';
							}
							//$arrOtherFields=(strlen(trim($_POST['arrOtherFields']))>0) ? (array)($_POST['arrOtherFields']) : '';
							//$arrFilterFields=(strlen(trim($_POST['arrFilterFields']))>0) ? (array)($_POST['arrFilterFields']) : '';
							$filterFieldsNeedOtherTable='';
							$filterFieldsNeedOtherTableRule='';

							//需要再跟其他表要欄位
							if (is_array($arrOtherFields) & count($arrOtherFields)>0) {
								$sqlStr_other="";
								foreach($arrOtherFields as $key=>$value) {
									$othertableprefix=$common->getTablePrefix($value[0]);

									$sqlStr_other=$sqlStr_other.",(SELECT ".$value[1]." FROM ".$value[0]." O WHERE O.".$othertableprefix."_no=".$value[2].") AS ".$key;
								}
							}

							//Filter 條件
							if (is_array($arrFilterFields) & count($arrFilterFields)>0) {
								$sqlStr_filter="";
								foreach($arrFilterFields as $key=>$value) {
									$othertableprefix=$common->getTablePrefix($value[0]);

									if (strlen(trim($value[0]))>0) {
										if (count($value)==2) {	//一般單純搜尋
											if (strlen($sqlStr_filter)==0) {
												$sqlStr_filter=' WHERE ';
											} else {
												$sqlStr_filter=$sqlStr_filter.' AND ';
											}

											if (strcmp(strtolower($value[1]),'int')==0) {
												$sqlStr_filter=$sqlStr_filter." ".trim($key)."=".trim($value[0]);
											} else {
												$sqlStr_filter=$sqlStr_filter." ".trim($key)."='".trim($value[0])."'";
											}
										} else {	//關鍵字搜尋 (會有 $value[2] 的值, 用","分隔要搜尋的值) ==> 只有 string 才會有關鍵字搜尋
											if (count($value)==5) {	//filter 有用到其他表
												$filterFieldsNeedOtherTable=$filterFieldsNeedOtherTable.','.$value[3];
												if (strlen($sqlStr_filter)>0) {
													$filterFieldsNeedOtherTableRule=$filterFieldsNeedOtherTableRule.' AND ';
												}
												$filterFieldsNeedOtherTableRule=$filterFieldsNeedOtherTableRule.$value[4];
											}
											$arrKeywordFields=explode(',',$value[2]);
											if (strlen($sqlStr_filter)==0) {
												$sqlStr_filter=' WHERE ';
											} else {
												$sqlStr_filter=$sqlStr_filter.' AND ';
											}
											if (count($arrKeywordFields)>=2) {
												$sqlStr_filter=$sqlStr_filter.' ( ';
											}
											if (count($arrKeywordFields)>=2) {
												$sqlStr_filter=$sqlStr_filter.' ) ';
											}
										}
									}
								}
							}
						}


						//總筆數
						$sqlStr_total=$sqlStr_total.',(SELECT count(*) FROM '.$table.$filterFieldsNeedOtherTable.' '.$sqlStr_filter;
						if (strlen($filterFieldsNeedOtherTableRule)>0) {
							if (strlen($sqlStr_filter)==0) {
								$sqlStr_total=$sqlStr_total.' WHERE '.$filterFieldsNeedOtherTableRule;
							} else {
								$sqlStr_total=$sqlStr_total.$filterFieldsNeedOtherTableRule;
							}
						}
						$sqlStr_total=$sqlStr_total.') as totalrecords FROM '.$table.$filterFieldsNeedOtherTable.' ';

						if (strlen(trim($_POST['order']))>0) {
							$arrOrder=explode(",",$common->replaceParameter($_POST['order']));
							$sqlStr_order=' ORDER BY '.$arrOrder[0];
							switch ($arrOrder[1]) {
								case "a":
									$sqlStr_order=$sqlStr_order." ASC";
									break;
								case "d":
									$sqlStr_order=$sqlStr_order." DESC";
									break;
							}
						} else {
							$sqlStr_order="";
						}

						if (is_numeric(trim($_POST['page']))) {
							$page=(int)$_POST['page'];
							$sqlStr_page=$sqlStr_page." LIMIT ".($page-1)*$listcount.",".$listcount;
						} else {
							$sqlStr_page="";
						}

						$sqlStr='SELECT '.$fields.$sqlStr_other.$sqlStr_total.$sqlStr_filter;
						if (strlen($filterFieldsNeedOtherTableRule)>0) {
							if (strlen($sqlStr_filter)==0) {
								$sqlStr=$sqlStr.' WHERE '.$filterFieldsNeedOtherTableRule;
							} else {
								$sqlStr=$sqlStr.$filterFieldsNeedOtherTableRule;
							}
						}
						$sqlStr=$sqlStr.$sqlStr_order.$sqlStr_page;
						//echo $sqlStr.'**********';
						$db->query($sqlStr);
						$rows = $db->resultset();
						$totalpages=ceil($rows[0]['totalrecords']/$listcount);

						$json=array('OK'=>1, 'totalpages'=>$totalpages, 'rows'=>$rows);
					} else {
						$json=array('OK'=>0);
					}
					break;
				case "CountRecords":
					if (isset($_POST['table']) && isset($_POST['field']) && isset($_POST['value']) && isset($_POST['out'])) {
						$table=$common->replaceParameter($_POST['table']);
						$tableprefix=$common->getTablePrefix($table);
						$field=$common->replaceParameter($_POST['field']);
						$value=$common->replaceParameter($_POST['value']);
						$out=$common->replaceParameter($_POST['out']);	//需要排除特定編號, 若有多筆, 以"," 隔開? (0=不需要
						if (countRecords($table,$field,$value,$tableprefix.'_no',$out)>0) {
							$json=array('OK'=>'1');		//有重覆的記錄了
						} else {
							$json=array('OK'=>'0');
						}
					}
					break;
				case "PageInsert":
					if (isset($_POST['table']) && isset($_POST['fields'])) {
						$table=$common->replaceParameter($_POST['table']);
						$tableprefix=$common->getTablePrefix($table);
						$arrFields=(array)$_POST['fields'];

						$requiredOK=1;	//必填的都要填
						foreach($arrFields as $key=>$value) {
							if ((int)$value[1]==1) {	//必填欄位
								if (strlen($value[0])==0) {
									$requiredOK=0;
									break;
								}
							}
						}

						if ($requiredOK==0) {	//有必填的沒填
							$json=array('OK'=>'-1');
						} else {
							$fieldName=implode(',',array_keys($arrFields));
							$fieldNameParameter=str_replace(',',',:',$fieldName);


							$db->query("INSERT INTO ".$table."(".$fieldName.",".$tableprefix."_c_date,".$tableprefix."_l_date) VALUES(:".$fieldNameParameter.",'".$nowdate."','".$nowdate."')");

							foreach($arrFields as $key=>$value) {
								if (strcmp($table,"Admin")==0 && strcmp($key,"a_pwd")==0) {
									$db->bind(':'.$key, sha1($value[0]), $value[2]);
								} else {
									$db->bind(':'.$key, $value[0], $value[2]);
								}
							}

							executeLoop($db);
							$json=array('OK'=>'1');
						}
					} else {
						$json=array('OK'=>'0');
					}
					break;
				case "DelData":
					if (isset($_POST['table']) && isset($_POST['no'])) {
						$table=$common->replaceParameter($_POST['table']);
						$tableprefix=$common->getTablePrefix($table);
						if (is_numeric(trim($_POST['no']))) {
							$no=(int)$_POST['no'];
						}

						$db->query('DELETE FROM '.$table.' WHERE '.$tableprefix.'_no=:no');
						$db->bind(':no', $no,PDO::PARAM_INT);
						executeLoop($db);

						if (strcmp($table,'Admin')==0 && $_SESSION['a_no']==$no) {
							$common->clearAllSession();	//自己砍了自己管理員帳號
						}

						$json=array('OK'=>'1');
					} else {
						$json=array('OK'=>'0');
					}
					break;
				case "PageSingleData":
					if (isset($_POST['table']) && isset($_POST['no'])) {
						$table=$common->replaceParameter($_POST['table']);
						$tableprefix=$common->getTablePrefix($table);
						$no=(int)$_POST['no'];

						$sqlStr="SELECT *";

						$sqlStr=$sqlStr." FROM ".$table." WHERE ".$tableprefix."_no=:no";

						//echo $sqlStr;

						$db->query($sqlStr);
						$db->bind(':no', $no, PDO::PARAM_INT);

						$rows = $db->resultset();
						$json=array('OK'=>1, 'rows'=>$rows);
					} else {
						$json=array('OK'=>'0');
					}
					break;
				case "PageEdit":
					if (isset($_POST['table']) && isset($_POST['fields']) && isset($_POST['no'])) {
						$table=$common->replaceParameter($_POST['table']);
						$tableprefix=$common->getTablePrefix($table);
						$arrFields=(array)$_POST['fields'];
						$no=(int)$_POST['no'];

						$requiredOK=1;	//必填的都要填
						foreach($arrFields as $key=>$value) {
							if ((int)$value[1]==1) {	//必填欄位
								if (strlen($value[0])==0) {
									$requiredOK=0;
									break;
								}
							}
						}

						if ($requiredOK==0) {	//有必填的沒填
							$json=array('OK'=>'-1');
						} else {
							$fieldName=implode(',',array_keys($arrFields));
							$fieldNameParameter=str_replace(',',',:',$fieldName);

							$sqlStr="UPDATE ".$table." SET";

							foreach($arrFields as $key=>$value) {
										if (strcmp($table,"Admin")==0 && strcmp($key,"a_pwd")==0) {
											if (strlen($value[0])>0) {
												$sqlStr=$sqlStr." ".$key."=:".$key.",";
											}
										} else {
											$sqlStr=$sqlStr." ".$key."=:".$key.",";
										}
							}

							$sqlStr=$sqlStr.$tableprefix."_c_date='".$nowdate."',";
							$sqlStr=$sqlStr.$tableprefix."_l_date='".$nowdate."'";

							$sqlStr=$sqlStr." WHERE ".$tableprefix."_no=".$no;
							$db->query($sqlStr);
							//echo $sqlStr;


							foreach($arrFields as $key=>$value) {
										if (strcmp($table,"Admin")==0 && strcmp($key,"a_pwd")==0) {
											if (strlen($value[0])>0) {
												$db->bind(':'.$key, sha1($value[0]), $value[2]);
											}
										} else {
											$db->bind(':'.$key, $value[0], $value[2]);
										}
							}

							executeLoop($db);

							$json=array('OK'=>'1');
						}
					} else {
						$json=array('OK'=>'0');
					}
					break;
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

function countRecords($varTable, $varField, $varValue, $varOutId, $varOut) {
	$db=new Database();
	$sqlStr="SELECT a_id FROM ".$varTable." WHERE ".$varField."=:value";
	if (!($varOut==0)) {
		$sqlStr=$sqlStr." AND ".$varOutId." NOT IN(".$varOut.")";
	}
	$db->query($sqlStr);
	$db->bind(':value', $varValue);
	executeLoop($db);
	return $db->rowCount();
}
?>
