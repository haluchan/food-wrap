$(function() {

	goPage('user/index.html');

	$('.rippleria').rippleria({
	  duration: 750,	// aniamtion speed
	  easing: 'linear',	// custom easing effect
	  color: '#d6d6d6'	// custom color
	});

	$('#toggle-menu').on('click',function() {
		if ($('*').hasClass('exp')) {	//==> go col
			$('header .logo a img').attr('src','img/logo_s.png');
			$('*').removeClass('exp');
			$('*').addClass('col');
			$('#container .exp-nav').hide();
			$('#container .col-nav').show();
		} else {						//go exp
			$('header .logo a img').attr('src','img/logo.png');
			$('*').removeClass('col');
			$('*').addClass('exp');
			$('#container .exp-nav').show();
			$('#container .col-nav').hide();
		}
	});

	//左側選單
	$('#container aside li').on('click',function() {
		$('#content img.help').remove();
		if ($(this)[0].hasAttribute('link')) {
			$('#container aside li').removeClass('select');
			$(this).addClass('select');
			goPage($(this).attr('link')+"/index.html");
		}
		if ($(this).attr('link')=="sms") {
			$('iframe').attr('scrolling','yes');
		} else {
			$('iframe').attr('scrolling','no');
		}
	});

	//iFrame Load ==> 調整 iFrame height
	$('#container #page').load(function() {
		setIFrameHeight();
	});

	//Logout 管理員身份
	$('#bu_signout').on('click',function() {
		$.post("func.php",{func:'AdminLogout'},function(data) {
			window.location.href="index.html";
		},"json");
	});

	//取得管理員身份
	$.post("func.php",{func:'GetAdminInfo'},function(data) {
		if (data.OK==1) {
			$('header span.admin-name').append(data.a_name);
			$('#container aside').show();
		} else {
			alert('登入後閒置時間過久, 請重新登入');
			window.location.href="index.html";
		}
	},"json");

});

//iFrame go page
function goPage($url) {
	$('#container #page').attr('src', $url);
}

function setIFrameHeight() {
	var $iframeid=document.getElementById("page"); //iframe id
	var $containerHeight=$(window).height()-$('header').height()-2;
	var $iframeheight=0;
	var $tmp=0;

	if (document.getElementById) {
		if ($iframeid && !window.opera) {
			if ($iframeid.contentDocument && $iframeid.contentDocument.body.offsetHeight) {
				$tmp=$('iframe').contents().find("#container").height();	//iframe container height
				$tmp=$tmp+80;	//footer height
				/*
				$iframeheight = $iframeid.contentDocument.body.offsetHeight;
				if ($tmp>$iframeheight) {
					$iframeheight=$tmp;
				}
				*/
				$iframeheight=$tmp;
			} else if ($iframeid.Document && $iframeid.Document.body.scrollHeight) {
				$iframeheight = $iframeid.Document.body.scrollHeight;
      		}

			if ($iframeheight<$(window).height()) {
				$iframeheight=$containerHeight;
			}
			$iframeid.height = $iframeheight;
    	}
   	}
}
