$('.promo').on('click touchstart',function (){
  GEvent('動態插頁2');
  $('.promo').css('display','none');
  $('.page1').css('display','block');
});
$(".page1-start-btn").on('click', function(){
  window.open("https://wwwosc.ad2iction.com/18/kureha");
  GEvent('立即挑戰');
});