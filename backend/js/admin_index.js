var $table="Admin";
var $arrFields={'#':'a_no','登入帳號':'a_id','建立日期':'a_c_date','最後登錄日期':'a_l_date','功能':''};
var $extraFields="";	//原本資料表,額外需要的資料欄位
var $arrOtherFields="";	//需要再跟其他表要的欄位, 先定好名字, 欄位名稱==>[表格, 原本的欄位名稱, 現在table對映的欄位名稱]
var $arrFilterFields="";		//篩選項目, 欄位名稱==>[值, 資料類型] ==> 沒有任何條件
var $order_1=$_GET('order_1')==null?'a_no':$_GET('order_1');	//排序 欄位值
var $order_2=$_GET('order_2')==null?'d':$_GET('order_2');	//排序 d=desc, a=asc
var $arrButtons={'Edit':1,'Del':1,'View':0};	//功能要顯示那些
var $page=$_GET('page')==null?1:$_GET('page');
var $datarows=null;	//post後回傳所有資料

function page_init() {
	initListCommon();
	setTableHeader();
	getList();
}

function pageCustomization() {
}
