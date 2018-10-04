$(function() {

  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    console.log('ios');
    // reiFrameSize();
    GEvent('活動首頁');

    $(window).on('load',function(){
      $('.teachGIF img').removeAttr('src', '');
      console.log('ok');
      $('.page2-start-btn').on('click touchstart',function (e){
        e.preventDefault();
        $('.page2').css('display','none');
        $('.page3').css('display','block');
        GEvent('遊戲說明');
      });
    });

    $('.page3-ok-btn').on('click touchstart',function (){
      // $('.teachGIF').append('<img src="img/demo.gif?a='+ Math.random() +'">').fadeIn(200);
      $('.teachGIF').find('img').attr("src", "img/demo.gif");
      $('.teachGIF').fadeIn(200);
      setTimeout(function(){
        $('.page3').css('display','none');
        $('.teachGIF img').removeAttr('src', '');
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

    $('.shop').on('click touchstart',function (e) {
      e.preventDefault();
      window.open('https://www.google.com');
      GEvent('網路商城');
    });

    $('.more-btn').on('click touchstart',function (e) {
      e.preventDefault();
      window.open('https://www.google.com');
      GEvent('好切立刻買');
    });


    $('.share-btn').on('click touchstart',function (e) {
      e.preventDefault();
      GEvent('fb分享');
      shareFB();
    });
    $('.raffle-btn').on('click touchstart',function (e) {
      e.preventDefault();
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
    $('.x-btn').on('click',function () {
      $('.nav').fadeOut(150);
    });
    $('.manu-btn').on('click',function () {
      $('.nav').fadeIn(150);
      GEvent('選單');
    });
    $('#gift').on('click',function () {
      $('.page').css('display','none');
      $('.detail-page').css('display','block');
      $('.nav').fadeOut(150);
      GEvent('獎品詳情');
    });

    $('#first-page').on('click',function () {
      $('.page').css('display','none');
      $('.page2').css('display','block');
      $('.nav').fadeOut(150);
      GEvent('回活動首頁');
    });


    $('#checkB').on('click',function () {
      console.log('check');
      if($('#checkB')[0].checked){
        $('.check').css('background-image',"url(img/v.png)")
      }else{
        $('.check').css('background-image',"url(img/checkbox.png)")
      }
    });
    $('.ruleo').on('click',function () {
      $('.rules').fadeIn(150);
      $('.nav-bottom').css('display','none');
      $('.nav').css('background-image',"img/boundaryBg.png");
      GEvent('活動辦法');
    });
    $('#cancel').on('click',function () {
      $('.rules').fadeOut(150);
      $('.nav-bottom').css('display','inline-block')
    });
    $('#top').on('click',function () {
      window.scrollTo(0,0)
    })


  }else{
    $('.pc').css('display','block');
    $('.container').css('display','none');
    console.log('pc');
  }

  function chackOrientation() {
    console.log(window.orientation);
    switch(window.orientation) {
      case 90 || -90:
        $('#revert').css('display','block');
        $('body').css('background-color','#ffffff');
        $('.container').css('display','none');
        console.log('landscape');
        break;
      default:
        $('#revert').css('display','none');
        $('.container').css('display','block');
        console.log('portrait');
        break;
    }

  }
  function shareFB() {
    var localURL = location.href;
    var myUrl = 'http://www.facebook.com/share.php?u=' + encodeURIComponent("https://wwwosc.ad2iction.com/18/kureha/index.html");
    window.open(myUrl, 'window', 'width=550, height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1');

  }

  function reiFrameSize(){

    var $iframes = $("iframe" );

    $iframes.each(function () {
      $( this ).data( "ratio", this.height / this.width )
      // Remove the hardcoded width &#x26; height attributes
        .removeAttr( "width" )
        .removeAttr( "height" );
    });

// Resize the iframes when the window is resized
    $( window ).resize( function () {
      $iframes.each( function() {
// Get the parent container&#x27;s width
        var width = $( this ).parent().width();
        $( this ).width( width -14 )
          .height( width * $( this ).data( "ratio" ) );
      });
// Resize to fix all iframes on page load.
    }).resize();

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



