var $table="Admin";
var $arrFields={'a_id':['','1','string'],'a_pwd':['','1','string']};		//for every value =[true value, required(0=N,1=Y), data type]
var $reg=/[0-9A-Za-z]{3,20}/i;	//a_id,a_pwd
var $page=$_GET('page');
var $arrFilterFields=$_GET('arrFilterFields');

function page_init() {
	$('#bu_submit').on('click',function() {
		var $a_id=$.trim($('#a_id').val());
		var $a_pwd=$.trim($('#a_pwd').val());
		var $a_name=$.trim($('#a_name').val());
		var $a_company=$.trim($('#a_company').val());

		if ($a_id.match($reg)==null) {
			$('#a_id').addClass('error');
		} else {
			$('#a_id').removeClass('error');
		}

		if ($a_pwd.match($reg)==null) {
			$('#a_pwd').addClass('error');
		} else {
			$('#a_pwd').removeClass('error');
		}

		//檢查看看帳號在資料庫中有沒有重覆
		$.post("../func.php",{func:'CountRecords', table:$table, field:'a_id', value:$a_id, out:0},function(data) {
			if (data.OK>0) {
				$('#a_id').addClass('error');
				alert('帳號已有人使用, 請改用其他帳號');
			} else {
				if (!$('input').hasClass('error')) {
					$.each( $arrFields, function( $key, $val ) {
						$arrFields[$key][0]=eval('$'+$key);
					});

					pageInsert();
				}
			}
		},"json");
	});
}
