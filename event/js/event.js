setTimeout(function () {
  GEvent('動態插頁2');
  $('.promo').fadeOut(300);
  $('.page1').fadeIn(300);
},4100);
$(".page1-start-btn").on('click touchstart', function(){
  window.open("https://wwwosc.ad2iction.com/18/kureha");
  GEvent('立即挑戰');
});