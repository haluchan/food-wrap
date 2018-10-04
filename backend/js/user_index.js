var $table="User";
var $arrFields={'#':'u_no','姓名':'u_name','電話':'u_tel','信箱':'u_mail','參加日期':'u_c_date'};
var $extraFields="";
var $arrOtherFields="";
var $arrFilterFields="" //需要再跟其他表要的欄位, 先定好名字, 欄位名稱==>[表格, 原本的欄位名稱, 現在table對映的欄位名稱]
//var $arrFilterFields="";	//篩選項目, 欄位名稱==>[值, 資料類型,複合欄位關鍵值搜尋] ==> 沒有任何條件
var $order_1=$_GET('order_1')==null?'u_no':$_GET('order_1');	//排序 欄位值
var $order_2=$_GET('order_2')==null?'d':$_GET('order_2');	//排序 d=desc, a=asc
var $arrButtons={'Edit':0,'Del':0};	//功能要顯示那些
var $page=$_GET('page')==null?1:$_GET('page');
var $datarows=null;	//post後回傳所有資料

function page_init() {

	initListCommon();
	setTableHeader();
	getList();
}

function pageCustomization() {
   $('.bu_export').on('click',function() {
		window.open("export.php","_blank");
	});
}
