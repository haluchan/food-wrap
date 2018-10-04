var $arrFolder = {
   'admin': '管理員管理',
   'user': '登錄資料管理'
};
var $arrPage = {
   'index': '列表',
   'insert': '新增',
   'edit': '編輯'
};
var $i = 0;
$j = 0;

var $datarows=null;

//取得 URL 特定參數
function $_GET($param) {
   var $vars = {};
   window.location.href.replace(/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
         function(m, key, value) { // callback
      $vars[key] = value !== undefined
         ? value
         : '';
   });

   if ($param) {
      return $vars[$param]
         ? $vars[$param]
         : null;
   }
   return $vars;
}

$(function() {
   if ($('footer').length===0)
      $('footer').empty().append('@catchdesign 2017');

   var eventTitle = '';
   switch (toNumber($_GET('e_no'))) {
      case 1:
         eventTitle = '【百優＋怡麗絲爾】';
         break;
      case 2:
         eventTitle = '【東京櫃周年】';
         break;
      case 3:
         eventTitle = '【心機彩粧】';
         break;
      case 4:
         eventTitle = '【驅黑淨白】';
         break;
   }

   if (getCurentPageName()==='mms') {
      $('h1').empty().append(eventTitle + $arrFolder[getCurrentFolderName()] + " > ");
   } else {
      $('h1').empty().append(eventTitle + $arrFolder[getCurrentFolderName()] + " > " + $arrPage[getCurentPageName()]);
   }

   $('.rippleria').rippleria({
      duration: 750, // aniamtion speed
      easing: 'linear', // custom easing effect
      color: '#d6d6d6' // custom color
   });

   $.post("../func.php", {
      func: 'IsAdmin'
   }, function(data) {
      if (data.OK == 1) {
         page_init();
      } else {
         alert('登入後閒置時間過久, 請重新登入');
         window.parent.location.href = "../index.html";
      }
   }, "json");

	$('i.input-feedback, i.input-reset').each(function() {
		var $tmpT=0,$tmpL=0;
		var $objFor=$('#'+$(this).attr('icon-for'));
		var $paddingT=parseInt($objFor.css('padding-top'),10),$paddingB=parseInt($objFor.css('padding-bottom'),10),$paddingL=parseInt($objFor.css('padding-left'),10),$paddingR=parseInt($objFor.css('padding-right'),10);

		$tmpT=$objFor.position().top+(($objFor.height()+$paddingT+$paddingB)-$(this).height())/2;
		$tmpL=$objFor.position().left+($objFor.width()+$paddingL+$paddingR)-$(this).width()-5;

		$(this).css({'top':$tmpT, 'left':$tmpL});
		$(this).show();
	});

   if (getCurentPageName() == "insert" || getCurentPageName() == "edit") {
      initBuCancel();
   }
});

function getCurrentFolderName() {
   var folderPathName = window.location.href;
   var arrFolder = folderPathName.replace(/\/$/, '').split('/');
   return arrFolder[arrFolder.length - 2];
}

function getCurentPageName() {
   var pagePathName = window.location.pathname;
   var arrPage = pagePathName.substring(pagePathName.lastIndexOf("/") + 1).split(".");
   return arrPage[0];
}

/********** Page List *********************/
function initListCommon() {
   $('#loading').empty();
   $('#loading').append('<div class="spinner">');
   for ($i = 1; $i <= 5; $i++) {
      $('#loading .spinner').append('<div class="rect' + $i + '"></div>');
   }

   $('.bu_insert').on('click', function() {
      parent.goPage(getCurrentFolderName() + "/insert.html?page=" + $page + '&e_no=' + toNumber($_GET('e_no')));
   });
}

//產生表頭
function setTableHeader() {
   //有篩選條件
   if ($('input, select').hasClass('filter')) {
      $.each($arrFilterFields, function($key, $val) {
         $('#' + $key + '.filter').val($val[0]); //設定目前的篩選條件為何?
      });
      $('button.bu_search').on('click',function() {
         $.each($arrFilterFields, function($key, $val) {
            if ($('#' + $key + '.filter').length) {
               $arrFilterFields[$key][0] = $('#' + $key + '.filter').val();
            }
         });
         $page=1;
         getList(); //重新讀取List
      });
   }

   //清除文字框的搜尋條件
   $('.input-reset').on('click',function() {
      $('#'+$(this).attr('icon-for')).val('');
   });

   $.each($arrFields, function($key, $val) {
      if ($val.length > 0) {
         //if ($val == getTablePrefix() + "_show" || $val == getTablePrefix() + "_order" || $val == getTablePrefix() + "_req_total") {
         if ($val == getTablePrefix() + "_show" || $val == getTablePrefix() + "_order") {
            var isEditable = '';
            //if ($val == getTablePrefix() + "_show" || $val == getTablePrefix() + "_order" || $val == getTablePrefix() + "_req_total") {
            if ($val == getTablePrefix() + "_show" || $val == getTablePrefix() + "_order") {
               isEditable = 'editable';
            }
            $('table.list thead').append('<th class="bu ' + isEditable + '" order="' + $val + '">' + $key + '</th>');
         } else {
            $('table.list thead').append('<th class="bu" order="' + $val + '">' + $key + '</th>');
         }
      } else {
         $('table.list thead').append('<th>' + $key + '</th>');
      }
   });

   $('table.list thead th[order=' + $order_1 + ']').addClass('select');

   $('table.list th').on('click', function() {
      if ($(this).attr('order') != null && !(getCurrentFolderName() === "preorder-single" || getCurrentFolderName() === "coupon-single")) {
         $page = 1; //因為變更排序條件, 所以需重設為第1頁

         if ($(this).attr('order') == $order_1) { //相同欄位
            $order_2 = ($order_2 == 'd')
               ? 'a'
               : 'd';
         } else { //改排序其他欄位
            $order_1 = $(this).attr('order');
            $order_2 = 'd';
         }

         $('table.list th').removeClass('select');
         $(this).addClass('select');

         getList();
      }
   });
}

//取回資料List
function getList() {
   $('#loading').show();
   $('table.list').hide();

   $.post("../func.php", {
      func: 'PageList',
      table: $table,
      fields: getArrFieldsStr(),
      arrFilterFields: $arrFilterFields,
      arrOtherFields: $arrOtherFields,
      order: ($order_1 + "," + $order_2),
      page: $page
   }, function(data) {
      $datarows = data.rows;
      $('table.list tbody').empty();

      if (toNumber(data.OK) == 1) {
         for ($i = 0; $i < data.rows.length; $i++) {
            $('table.list tbody').append('<tr></tr>');
            $.each($arrFields, function($key, $val) {
               //if ($val == getTablePrefix() + "_show" || $val == getTablePrefix() + "_order" || $val == getTablePrefix() + "_req_total") {
               if ($val == getTablePrefix() + "_show" || $val == getTablePrefix() + "_order") {
                  var $control = '',
                     isEditable = '';
                  	$control=$val.substr(2,$val.length-1);
                  isEditable = 'editable';
						$('table.list tbody tr:nth-child('+($i+1)+')').append('<td class="'+isEditable+'" type="edit" control="'+$control+'" no="'+eval('data.rows['+$i+'].'+getTablePrefix()+'_no')+'" data-role="'+$val+'" data-val="'+eval('data.rows['+$i+'].'+$val)+'"><span class="value">'+eval('data.rows['+$i+'].'+$val)+'</span></td>');
               } else {
                  if ($val.length > 0) {
                     $('table.list tbody tr:nth-child(' + ($i + 1) + ')').append('<td data-role="' + $val + '">' + eval('data.rows[' + $i + '].' + $val) + '</td>');
                  }

                  if ($key == "功能") {
                     $('table.list tbody tr:nth-child(' + ($i + 1) + ')').append('<td></td>');
                     if ($arrButtons['Edit'] == 1) {
                        $('table.list tbody tr:nth-child(' + ($i + 1) + ') td:last-child').append('<button class="bu_edit bu rippleria" no="' + eval('data.rows[' + $i + '].' + getTablePrefix() + '_no') + '"><i class="fa fa-pencil"></i><span>編輯</span></button>');
                     }

                     if ($arrButtons['Del'] == 1) {
                        if ($table == "Mandarin_201710_Admin") {
                           $('table.list tbody tr:nth-child(' + ($i + 1) + ') td:last-child').append('<button class="bu_del bu rippleria" index="' + $i + '" no="' + eval('data.rows[' + $i + '].' + getTablePrefix() + '_no') + '" title="' + eval('data.rows[' + $i + '].' + getTablePrefix() + '_id') + '"><i class="fa fa-trash"></i><span>刪除</span></button>');
                        } else {
                           $('table.list tbody tr:nth-child(' + ($i + 1) + ') td:last-child').append('<button class="bu_del bu rippleria" index="' + $i + '" no="' + eval('data.rows[' + $i + '].' + getTablePrefix() + '_no') + '" title="' + eval('data.rows[' + $i + '].' + getTablePrefix() + '_name') + '"><i class="fa fa-trash"></i><span>刪除</span></button>');
                        }
                     }

                     if ($arrButtons['View'] == 1) {
                        $('table.list tbody tr:nth-child(' + ($i + 1) + ') td:last-child').append('<button class="bu_view bu rippleria" no="' + eval('data.rows[' + $i + '].' + getTablePrefix() + '_no') + '"><i class="fa fa-eye"></i><span>檢視</span></button>');
                     }
                     //中獎者檢視 (在 prize_index 頁)
                     if ($arrButtons['Prizedetail'] == 1) {
                        $('table.list tbody tr:nth-child(' + ($i + 1) + ') td:last-child').append('<button class="bu_prizedetail bu rippleria" no="' + eval('data.rows[' + $i + '].' + getTablePrefix() + '_no') + '"><i class="fa fa-user-circle"></i><span>中獎者</span></button>');
                     }
                  }
               }
            });
         }

         $('table.list tbody td[type=edit]').on('dblclick', function() { //調整前台顯示狀態
            $(this).off('click'); //把 td 本身雙擊動作關閉

            if ($(this).attr('data-role') == getTablePrefix() + "_show") { //前台顯示狀態
               $type = "";
               if ($(this).attr('data-role') == getTablePrefix() + "_show") {
                  $type = "show";
               }

               //如果有其他雙擊的記錄, 就把 select 去掉, 顯示原有的狀態
               $('table.list tbody td[type=edit] select').remove();
               $('table.list tbody td[type=edit] span').show();

               $(this).children('span').hide();

               $(this).append('<select></select>');
               $(this).children('select').append('<option value="0">隱藏</option>');
               $(this).children('select').append('<option value="1">顯示</option>');

               $(this).children('select').get(0).selectedIndex = $(this).attr('data-val');
               $(this).children('select').focus();

               $(this).children('select').on('change', function() {
                  $.post("../func.php", {
                     func: 'ChangeStatus',
                     type: $type,
                     table: $table,
                     no: $(this).parent().attr('no'),
                     status: $(this).val()
                  }, function(data) {
                     var $obj = $('table.list tbody td[type=edit][no=' + data.no + '][control=' + $type + ']');
                     if (data.OK == 1) {
                        $obj.attr('data-val', data.result);
                        $obj.children('span').empty();
                        switch (data.result) {
                           case 0:
                              $obj.children('span').append('隱藏');
                              break;
                           case 1:
                              $obj.children('span').append('顯示');
                              break;
                        }
                     } else {
                        alert('顯示狀態更新失敗, 請重新再試一次');
                     }
                     $obj.children('select').remove();
                     $obj.children('span').show();

                     $obj.on('click');
                  }, "json");
               }).on('focusout', function() {
                  $(this).trigger('change');
               });
            }

            //if ($(this).attr('data-role') == getTablePrefix() + "_order" || $(this).attr('data-role') == getTablePrefix() + "_req_total") { //調整權重 或 可索取數量
            if ($(this).attr('data-role') == getTablePrefix() + "_order") { //調整權重
               $(this).children('span').hide();

					$title='';
					$pattern='';
               $type='';
					if ($(this).attr('data-role') == getTablePrefix() + "_order") {
						$pattern="[0-9]+([\.,][0-9]+)?";
						$title="只接受到小數點第2位的數字";
                  $type="order";
					}
               /*
               if ($(this).attr('data-role') == getTablePrefix() + "_req_total") {
						$pattern="[0-9]";
						$title="只接受整數";
                  $type="req_total";
					}
               */

               $(this).append('<input type="text" pattern="'+$pattern+'" title="'+$title+'" value="' + $(this).attr('data-val') + '">');
               $(this).children('input').focus();

               $(this).children('input').on('focusout', function() {
                  $.post("../func.php", {
                     func: 'ChangeStatus',
                     type: $type,
                     table: $table,
                     no: $(this).parent().attr('no'),
                     status: $(this).val()
                  }, function(data) {
                     var $obj = $('table.list tbody td[type=edit][no=' + data.no + '][control=order]');

                     if (data.OK == 1) {
                        if ($order_1 == getTablePrefix() + "_order") {
                           getList();
                        } else {
                           $obj.attr('data-val', data.result);

                           $obj.children('span').empty().append(data.result);
                        }
                     } else {
                        alert('權重更新失敗, 請重新再試一次');
                     }

                     if (!($order_1 == getTablePrefix() + "_order") || data.OK == 0) {
                        $obj.children('input').remove();
                        $obj.children('span').show();

                        $obj.on('click');
                     }
                  }, "json");
               }).on('keypress', function(e) {
                  if (e.keyCode == 13) {
                     $(this).trigger('focusout');
                  }
               });
            }
         });
      }

      $('table.list tbody button').on('click', function() {
         if ($(this).hasClass('bu_edit')) {
            parent.goPage(getCurrentFolderName() + '/edit.html?no=' + $(this).attr('no') + "&e_no="+$_GET('e_no')+"&page=" + $page + "&order_1=" + $order_1 + "&order_2=" + $order_2 + "&arrFilterFields=" + encodeURIComponent(JSON.stringify($arrFilterFields)));
         }
         if ($(this).hasClass('bu_del')) {
            if ($(this).hasClass('disabled')) {
               alert('【#' + $(this).attr('no') + ' - ' + $(this).attr('title') + '】己有人登記, 無法刪除');
            } else {
               delSingleData($table, $(this).attr('no'), $(this).attr('title'));
            }
         }
         if ($(this).hasClass('bu_view')) {
            parent.goPage(getCurrentFolderName() + '/view.html?no=' + $(this).attr('no') + "&e_no="+$_GET('e_no')+"&page=" + $page + "&order_1=" + $order_1 + "&order_2=" + $order_2 + "&arrFilterFields=" + encodeURIComponent(JSON.stringify($arrFilterFields)));
         }
         if ($(this).hasClass('bu_goTester')) {
            if (getCurrentFolderName()==='store') {
               window.location.href='../tester/index.html?e_no='+$_GET('e_no')+'&s_no='+$(this).attr('no');
            }
            if (getCurrentFolderName()==='store_1') {
               window.location.href='../tester_1/index.html?e_no='+$_GET('e_no')+'&s_no='+$(this).attr('no');
            }
         }
         if ($(this).hasClass('bu_mms')) {
            if ($(this).hasClass('disabled')) {
               //alert('【#' + $(this).attr('no') + ' - ' + $(this).attr('title') + '】己失領取資格, 無法再發送簡訊');
            } else {
               window.location.href='mms.html?no=' + $(this).attr('no') + "&e_no="+$_GET('e_no')+"&page=" + $page + "&order_1=" + $order_1 + "&order_2=" + $order_2 + "&arrFilterFields=" + encodeURIComponent(JSON.stringify($arrFilterFields));
            }
         }
      });

      pageCustomization(); //針對特定欄位特制化顯示內容

      setPager(data.totalpages); //秀分頁`

      $('#loading').hide();
      $('table.list').show();

      setTimeout(setIFrameHeight, 500); //1000=1sec
   }, "json");
}

function delSingleData($table, $no, $title) {
   if (confirm('確定刪除【#' + $no +'】的記錄嗎?')) {
      $.post("../func.php", {
         func: 'DelData',
         table: $table,
         no: $no
      }, function(data) {
         if (data.OK == 1) {
            alert('成功刪除');
            getList();
         } else {
            alert('刪除失敗');
         }
      }, "json");
   }
}

function getArrFieldsStr() {
   var $tmp = '';
   $.each($arrFields, function($key, $val) {
      var $ommited = 0; //外部欄位需要省略
      $.each($arrOtherFields, function($key_1, $val_1) {
         if ($key_1 === $val) {
            $ommited = 1;
         }
      });

      if ($ommited === 0 && $val.length > 0) {
         if ($tmp.length == 0) {
            $tmp = $val;
         } else {
            $tmp = $tmp + ',' + $val;
         }
      }
   });

   if ($extraFields.length>0) {
      $tmp=$tmp+','+$extraFields;
   } else {
      $tmp=$tmp+$extraFields;
   }

   return $tmp;
}

//處理頁數
function setPager($totalpages) {
   var $perPagesShow = ($totalpages>10)?10:$totalpages;
   var $prevPage = ($page > 1)
      ? parseInt($page, 10) - 1
      : 1;
   var $nextPage = ($page < $totalpages)
      ? parseInt($page, 10) + 1
      : $totalpages;
   var $arrPage = [];
   var $tmp = 0;

   if ($totalpages <= 1) {
      $('.pager').empty();
   } else {
      $('.pager').empty();

      $('.pager').append('<span class="bu" page="1"><i class="fa fa-fast-backward"></i></span>');
      $('.pager').append('<span class="bu" page=' + $prevPage + '><i class="fa fa-backward"></i></span>');

      if (toNumber($totalpages) > 6) {
         if ($page > 6) {
            if (($totalpages - parseInt($page, 10)) >= 4) {
               for ($i = (parseInt($page, 10) - 5); $i < $page; $i++) {
                  $arrPage.push($i);
               }
               $tmp = ((parseInt($page, 10) + 4) < $totalpages)
                  ? (parseInt($page, 10) + 4)
                  : $totalpages;
               for ($i = ($page); $i <= $tmp; $i++) {
                  $arrPage.push($i);
               }
            } else {
               for ($i = ($totalpages - 9); $i <= $totalpages; $i++) {
                  $arrPage.push($i);
               }
            }
         } else {
            for ($i = 1; $i <= $perPagesShow; $i++) {
               $arrPage.push($i);
            }
         }
      } else {
         for ($i = 1; $i <= $totalpages; $i++) {
            $arrPage.push($i);
         }
      }

      for ($i = 0; $i < $arrPage.length; $i++) {
         if ($arrPage[$i] == $page) {
            $('.pager').append('<span class="bu select" page="' + $arrPage[$i] + '">' + $arrPage[$i] + '</span>');
         } else {
            $('.pager').append('<span class="bu" page="' + $arrPage[$i] + '">' + $arrPage[$i] + '</span>');
         }
      }

      $('.pager').append('<span class="bu" page=' + $nextPage + '><i class="fa fa-forward"></i></span>');
      $('.pager').append('<span class="bu" page=' + $totalpages + '><i class="fa fa-fast-forward"></i></span>');

      $('.pager').append('<span class="specialPage">第&nbsp;<input type="text" class="numbersOnly">&nbsp;頁&nbsp;<button class="bu">前往</button>');

      $('.pager span:not(.specialPage)').on('click', function() {
         $page = $(this).attr('page');

         getList();
      });

      $('.pager button').on('click', function() {
         if ($('.pager input').val() <= $totalpages) {
            $page = $('.pager input').val();
         }

         getList();
      });
   }
}

//reset parent iframe height
function setIFrameHeight() {
   parent.setIFrameHeight();
}

/********** Page Insert *********************/
function pageInsert() {
   $.post("../func.php", {
      func: 'PageInsert',
      table: $table,
      fields: $arrFields
   }, function(data) {
      if (data.OK == 1) {
         alert("成功新增");
      } else {
         alert("新增失敗, 請再重新新增");
      }
      parent.goPage(getCurrentFolderName() + '/index.html'+location.search);
   }, "json");
}

/********** Page Edit *********************/
function pageShowData() {
   $.post("../func.php", {
      func: 'PageSingleData',
      table: $table,
      no: $no,
      arrOtherFields: $arrOtherFields
   }, function(data) {
      if (data.ok == 0) {
         alert('查無資料');
         parent.goPage(getCurrentFolderName() + '/index.html'+location.search);
      } else {
         $rows = data.rows[0]

         $('input, span, textarea').each(function(index) {
            if (!$(this).hasClass('nodata')) {
               switch ($(this).attr('type')) {
                  case 'radio':
							if ($(this).val()==$rows[$(this).attr('id')]) {
								$('input,span, textarea').get(index).checked = true;
							} else {
								$(this).removeAttr('checked');
							}
							break;
                  case 'hidden':
                  case 'textarea':
                  case 'text':
                  case 'data':
                     if ($(this).attr('type')=="data") {	//View
                        if ($(this).attr('id')==getTablePrefix()+"_show") {
                           if ($rows[$(this).attr('id')]==0) {
                              $(this).empty().append('隱藏');
                           } else {
                              $(this).empty().append('顯示');
                           }
                        } else if ($(this).attr('id')==getTablePrefix()+"_is_exchange") {
                           if ($rows[$(this).attr('id')]==0) {
                              $(this).empty().append('未領取');
                           } else {
                              $(this).empty().append('可領取');
                           }
                        } else if ($(this).attr('id')==getTablePrefix()+"_is_valid") {
                           if ($rows[$(this).attr('id')]==0) {
                              $(this).empty().append('不可兌換');
                           } else {
                              $(this).empty().append('可兌換');
                           }
                        } else {
                           if (getCurentPageName()=="view") {	//for textarea ==> @view page
                              $(this).empty().append(formatTextAreaString($rows[$(this).attr('id')]));
                           } else {
                              $(this).empty().append($rows[$(this).attr('id')]);
                           }
                        }
                     } else {	//Insert & Edit
                        $(this).val($rows[$(this).attr('id')]);
                     }
                     break;
               }
            }
         });
         if ($table == "Mandarin_201710_Prize") {
            pageCustomization($rows); //針對特定欄位特制化顯示內容
         }

         setTimeout(setIFrameHeight, 500); //1000=1sec
      }
   }, "json");
}
function pageEdit() {
   $.post("../func.php", {
      func: 'PageEdit',
      e_no: $_GET('e_no'),
      no: $no,
      table: $table,
      fields: $arrFields
   }, function(data) {
      if (data.OK == 1) {
         alert("成功編輯");
      } else {
         if ($table==='Store' && toNumber(data.OK)===-1) {
            if (getCurrentFolderName()==='store') {
               alert('總數不可小於登記數量 (目前登記數量 : '+data.apply+')');
            }
            if (getCurrentFolderName()==='store_1') {
               alert('總數不可小於登記數量，目前登記數量如下\r\n驅黑 : '+data.apply_1+'&nbsp/&nbsp;眼膜 : '+data.apply_2+'&nbsp/&nbsp;乳霜 : '+data.apply_3+'&nbsp/&nbsp;淡斑 : '+data.apply_4+'&nbsp/&nbsp;潔顏 : '+data.apply_5);
            }
         } else {
            alert("編輯失敗, 請再重新編輯");
         }
      }
      if (!(toNumber(data.OK)===-1)) {
         parent.goPage(getCurrentFolderName() + '/index.html'+location.search);
      }
   }, "json");
}

/********** Common ********************/
//$defaultValue==0 ==> 預設第一個
function getCityList($obj, $defaultValue) {
   $defaultValue = (typeof $defaultValue !== 'undefined') ?  $defaultValue : '';    //default value
   $type = (typeof $type !== 'undefined') ?  $type : 'all';    //default value

   $.post("../func.php", {
      func: 'CityList',
   }, function(data) {
      $datarows = data.rows;
      for ($i = 0; $i < $datarows.length; $i++) {
         $obj.append('<option value="'+$datarows[$i].c_no+'">'+$datarows[$i].c_name+'</option>');
      }
      if ($defaultValue==='') {   //預設第一個選項
         $obj.prop("selectedIndex", 0);
      } else {
         $obj.val($defaultValue);
      }
   }, "json");
}

//只會針對該活動有櫃點的城市列出
//$defaultValue==0 ==> 預設第一個
function getCityListByEvent($obj, $defaultValue) {
   $defaultValue = (typeof $defaultValue !== 'undefined') ?  $defaultValue : '';    //default value
   $type = (typeof $type !== 'undefined') ?  $type : 'all';    //default value

   $.post("../func.php", {
      func: 'CityListByEvent',
      no: toNumber($_GET('e_no')),
   }, function(data) {
      $datarows = data.rows;
      for ($i = 0; $i < $datarows.length; $i++) {
         $obj.append('<option value="'+$datarows[$i].c_no+'">'+$datarows[$i].c_name+'</option>');
      }
      if ($defaultValue==='') {   //預設第一個選項
         $obj.prop("selectedIndex", 0);
      } else {
         $obj.val($defaultValue);
      }
   }, "json");
}

function initBuCancel() {
   $('#bu_cancel').on('click', function() {
      parent.goPage(getCurrentFolderName() + '/index.html'+location.search);
   });
}

function getTablePrefix() {
   $prefix='';
   if ($table.substr(-5)==='Admin') {
      $prefix='a';
   }
   if ($table.substr(-4)=='User') {
      $prefix='u';
   }
   return $prefix;
}

function isiOS() {
   var isiOS = (navigator.userAgent.indexOf('iPhone') != -1) || (navigator.userAgent.indexOf('iPod') != -1) || (navigator.userAgent.indexOf('iPad') != -1)
   return isiOS;
}

$('.numbersOnly').keyup(function() {
   if (this.value != this.value.replace(/[^0-9\.]/g, '')) {
      this.value = this.value.replace(/[^0-9\.]/g, '');
   }
});

function toNumber(strNumber) {
   return + strNumber;
}
