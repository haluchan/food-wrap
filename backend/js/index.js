var $reg = /[0-9A-Za-z]{3,20}/i;

$(function() {
   $('input').val(''); //clear input value

   $('.rippleria').rippleria({
      duration: 750, // aniamtion speed
      easing: 'linear', // custom easing effect
      color: '#d6d6d6' // custom color
   });

   $('i.input-feedback').each(function() {
      var $tmpT = 0,
         $tmpL = 0;
      var $objFor = $('#' + $(this).attr('icon-for'));
      var $paddingT = parseInt($objFor.css('padding-top'), 10),
         $paddingB = parseInt($objFor.css('padding-bottom'), 10),
         $paddingL = parseInt($objFor.css('padding-left'), 10),
         $paddingR = parseInt($objFor.css('padding-right'), 10);

      $tmpT = $objFor.position().top + (($objFor.height() + $paddingT + $paddingB) - $(this).height()) / 2;
      $tmpL = $objFor.position().left + ($objFor.width() + $paddingL + $paddingR) - $(this).width() - 5;

      $(this).css({
         'top': $tmpT,
         'left': $tmpL
      });
      $(this).show();
   });

   $('input').on('keypress', function(e) {
      if (e.keyCode == 13) {
         $("#btn_login").trigger("click");
      }
   });

   $('#btn_login').on('click', function() {
      var $id = $.trim($('#id').val());
      var $pwd = $.trim($('#pwd').val());

      if ($id.match($reg) === null) {
         if (!$('#id').hasClass('error')) {
            $('#id').addClass('error');
         }
      } else {
         $('#id').removeClass('error');
      }
      if ($pwd.match($reg) === null) {
         if (!$('#pwd').hasClass('error')) {
            $('#pwd').addClass('error');
         }
      } else {
         $('#pwd').removeClass('error');
      }

      if (!$('input').hasClass('error')) {
         $.post("func.php", {
            func: 'AdminLogin',
            id: $id,
            pwd: $pwd
         }, function(data) {
            if (data.OK == 1) {
               window.location.href = "content.html";
            } else {
               $('input').val('');
               alert('登入帳號或密碼錯誤, 請重新輸入');
            }
         }, "json");
      }
   });
});
