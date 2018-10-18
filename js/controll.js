$(function() {

  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Safari/i.test(navigator.userAgent) ) {
    console.log('ios');
    GEvent('活動首頁');
    chackOrientation();
    $(window).on('load',function(){
      // $('.tgif').removeAttr('src', '');
    });
    $('.page2-start-btn').on('touchstart',function (){
      $('.page2').css('display','none');
      $('.page3').css('display','block');
      GEvent('遊戲說明');
    });

    $('.page3-ok-btn').on('touchstart',function (){
      // $('.teachGIF').append('<img src="img/demo.gif?a='+ Math.random() +'">').fadeIn(200);
      $('.teachGIF').find('img').eq(1).attr("src", "img/animated.png");
      $('.teachGIF').fadeIn(200);
      $('.teachGIF-p').fadeIn(200);
      setTimeout(function(){
        $('.page3').css('display','none');
        $('.tgif').removeAttr('src', '');
        $('.teachGIF').css('display','none');
        $('.page4').css('display','block');
        game();
        GEvent('開始遊戲');
      },4800)
    });
    $("#myVideo2").on('ended', function(){
      $('.page5').css('display','none');
      $('.page6').css('display','block');
      GEvent('遊戲結果');
    });

    $('.shop').on('touchstart',function () {
      window.open('https://www.fongkong.com.tw/product/14');
      GEvent('網路商城');
    });

    $('.more-btn').on('touchstart',function () {
      window.open('https://www.fongkong.com.tw/product/14');
      GEvent('好切立刻買');
    });


    $('.share-btn').on('touchstart',function () {
      GEvent('fb分享');
      shareFB();
    });
    $('.raffle-btn').on('touchstart',function () {
      $('.page6').css('display','none');
      $('.page7').css('display','block');
      GEvent('抽千元家用品');
    });


    $('.page7-sent').on('click touchstart' , function (e) {
      e.preventDefault();
      var name = $('input[name="name"]').val();
      var phone = $('input[name="phone"]').val();
      var mail = $('input[name="email"]').val();

      checkdata(name, phone, mail);
      GEvent('送出參加者資料');

    });

    //nav
    $('.x-btn').on('touchstart',function () {
      $('.nav').fadeOut(150);
    });
    $('.manu-btn').on('touchstart',function () {
      $('.nav').fadeIn(150);
      GEvent('選單');
    });
    $('#gift').on('touchstart',function () {
      $('.page').css('display','none');
      $('.detail-page').css('display','block');
      $('.nav').fadeOut(150);
      GEvent('獎品詳情');
    });

    $('#first-page').on('touchstart',function () {
      $('.page').css('display','none');
      $('.page2').css('display','block');
      $('.nav').fadeOut(150);
      GEvent('回活動首頁');
    });


    $('#checkB').on('touchstart',function () {
      console.log('check');
      if($('#checkB')[0].checked){
        $('.check').css('background-image',"url(img/v.png)")
      }else{
        $('.check').css('background-image',"url(img/checkbox.png)")
      }
    });
    $('.ruleo').on('touchstart',function () {
      $('.rules').fadeIn(150);
      $('.nav-bottom').css('display','none');
      $('.nav').css('background-image',"img/boundaryBg.png");
      GEvent('活動辦法');
    });
    $('#cancel').on('touchstart',function () {
      $('.rules').fadeOut(150);
      $('.nav-bottom').css('display','inline-block')
    });
    $('#top').on('touchstart',function () {
      window.scrollTo(0,0)
    })

  }else{
    $('.pc').css('display','block');
    $('.container').css('display','none');
    console.log('pc');
  }

  function chackOrientation() {
    // console.log(window.orientation);
    window.addEventListener("orientationchange", function() {
      console.log(screen.orientation.angle);
      if(screen.orientation.angle > 80 && screen.orientation.angle < 110){
        $('.revert').css('display','block');
        $('.container').css('display','none');
        // console.log('landscape');
      }else if(screen.orientation.angle > -80 && screen.orientation.angle < -110){
        $('.revert').css('display','block');
        $('.container').css('display','none');
        // console.log('landscape');
      }else{
        $('.revert').css('display','none');
        $('.container').css('display','block');
        // console.log('portrait');
      }
    }, false);


  }
  function shareFB() {
    var myUrl = 'http://www.facebook.com/share.php?u=' + encodeURIComponent("https://wwwosc.ad2iction.com/18/kureha/index.html");
    window.open(myUrl, 'window', 'width=550, height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1');

  }


  function sentData(fname, fphone, fmail) {

    $.ajax({
      method: "POST",
      url: "./backend/getdata.php",
      data: JSON.stringify({
        name:fname,
        tel:fphone,
        mail:fmail
      }),
      success:function (r) {
        if (r == 'ok') {
          alert('成功送出，感謝您參加【楓康保鮮膜】活動');
          $('.page7').css('display','none');
          $('.page6').css('display','block');
        } else {
        }
      },
      error: function () {

      }
    });


  }
  function checkdata(name, phone, mail) {

    var mailfrom = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var phonefrom =/09[0-9]{8}/;

    if ( name === "") {
      alert("請輸入名字");
      return false;
    } else if (!phonefrom.test(phone)) {
      alert("手機格式有誤");
      return false;
    } else if(!mailfrom.test(mail)) {
      alert("E-mail格式有誤");
      return false;
    }else if($('#checkB')[0].checked !== true){
      alert("請勾選同意送出個人資料");
      return false;
    }else{
      sentData(name, phone, mail);
      console.log("sent");
      return true;
    }

  }

});

if(isWebview()) {
  $('.inapp').css('display','block');
  $('.page2').css('display','none');
}else{
  $('.page2').css('display','block');
}
function isWebview() {
  var useragent = navigator.userAgent;
  var regex = '/(WebView|(iPhone|iPod|iPad)(?!.*Safari\/)|Android.*(wv|.0.0.0))/gi';
  return Boolean(useragent.match(regex));
}
