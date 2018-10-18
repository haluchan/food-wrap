var gameFlag = false;


function game() {
  var countDownNumber = 60;
  var countdownid;
  var score = 0;
  var flag = false;
  gameFlag = true;

  var section = document.querySelector('#game');
  var vw = window.innerWidth;
  var vh = window.innerHeight;
  var sizeX = ((vw / 640));
  var sc = 640 / 998;
  var Graphics = PIXI.Graphics;
  var sizeY = ((sizeX * 998) / 998);
  divScale(sizeX, sizeY);

  var Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Style = new PIXI.TextStyle,
    Text = new PIXI.Text;

  var state, dashIcon, timeIcon, btn, foodWrap, foodWrapN, table, sister,foodScene, v1, v2, v3, v4, v5, v1f, v2f, v3f, v4f, v5f,backgroundScene,playScene,titleScene, timerText ,scoreText ,touchScene, mobileArray,look, warp , success,pg , remind,btnArray;
  var app = new Application({
      width: 640,
      height: 998,
      antialiasing: false,
      transparent: true,
      resolution: 1,
      backgroundColor: 0xffffff
    }
  );
  section.appendChild(app.view);
  loader
    .add("img/game.json")
    .add("img/tIcon.json")
    .add("img/btn.json")
    .load(setup);



  function setup() {
    pg = PIXI.sound.Sound.from('audio/saran-wrap-cut1.mp3');
  backgroundScene = new Container();
    playScene = new Container();
    titleScene = new Container();
    foodScene = new Container();
    touchScene = new Container();
    table =  new Sprite(
      resources["img/game.json"].textures["table.png"]
    );


    titleScene.y = 47;

    tStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 48,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#5e3612']
    });

    timerText = new PIXI.Text( countDownNumber +'s',tStyle);
    timerText.x = 139;
    timerText.y = 10;
    scoreText = new PIXI.Text('0',tStyle);
    scoreText.x = 329;
    scoreText.y = 10;
    timeIcon =  new Sprite(
      resources["img/game.json"].textures["time-icon.png"]
    );
    timeIcon.x = 51;

    dashIcon =  new Sprite(
      resources["img/game.json"].textures["dash-icon.png"]
    );
    dashIcon.x = 240;

    remind = new Sprite(
      resources["img/game.json"].textures["remind.png"]
    );
    remind.x = 150;
    remind.y = 660;
    remind.visible = false;

    v1 = PIXI.Texture.fromImage('v1.png');
    v2 = PIXI.Texture.fromImage('v2.png');
    v3 = PIXI.Texture.fromImage('v3.png');
    v4 = PIXI.Texture.fromImage('v4.png');
    v5 = PIXI.Texture.fromImage('v5.png');
    v1f = PIXI.Texture.fromImage('v1f.png');
    v2f = PIXI.Texture.fromImage('v2f.png');
    v3f = PIXI.Texture.fromImage('v3f.png');
    v4f = PIXI.Texture.fromImage('v4f.png');
    v5f = PIXI.Texture.fromImage('v5f.png');
    look = new Sprite(v1);
    success = new Sprite(
      resources["img/game.json"].textures["title-done.png"]
    );
    success.x = 365;
    success.y = 61;

    success.visible = false;

    foodScene.x = 78;
    foodScene.y = 205;


    foodWrap = PIXI.Texture.fromImage('food-wrap.png');


    foodWrapN = PIXI.Texture.fromImage('food-wrap-n.png');
    foodWrapN.x = 500;


    warp = new Sprite(foodWrap);
    warp.y = 158;

    btnArray = [];

    for (var j = 1; j < 90; j++) {
      btnArray.push(PIXI.Texture.fromFrame('btn' + j + '.png'));
    }

    btn = new PIXI.extras.AnimatedSprite(btnArray);

    // btn = new Sprite(
    //   resources["img/game.json"].textures["btn.png"]
    // );
    btn.x = 484;
    btn.y = 250;
    btn.animationSpeed = 0.7;
    btn.play();

    sister = new Sprite(
      resources["img/game.json"].textures["sister.png"]
    );
    sister.x = 500;
    sister.y = 130;
    sister.visible = false;

    mobileArray = [];

    for (var i = 0; i < 17; i++) {
      mobileArray.push(PIXI.Texture.fromFrame('icon' + i + '.png'));
    }

    var anim = new PIXI.extras.AnimatedSprite(mobileArray);

    anim.x = 130;
    anim.y = 240;
    anim.animationSpeed = 0.25;
    anim.visible = false;


    btn.interactive = true;
    btn.buttonMode = true;
    btn.on('touchstart',function () {
      sister.visible = true ;
      // btn.visible = false;
      anim.visible = true;
      anim.play();

      if(window.DeviceOrientationEvent){

        window.addEventListener('deviceorientation',function (event) {
          console.log(Math.round(event.gamma));
          if(!flag){
            // event.gamma >= -72 && event.gamma  <= -70 && event.alpha < 200
            // Math.round(event.gamma) >= -72 && Math.round(event.gamma)  <= -70
            if( Math.round(event.gamma) <= -45  ){
              sister.visible = false;
              anim.visible = false;
              packageFood(score);
              score++;
              if(score >= 5){
                score = 5
              }
              success.visible = true;
              flag = true;
            }
          }
        },false);
      }
    });
    btn.on('touchend',function () {
      flag = false;
      // btn.visible = true;
      sister.visible = false ;
      anim.visible = false;
      success.visible = false;
      remind.visible = false;
      warp.x = 0;
      warp.texture = foodWrap;
      reNew(score);
    });




    //Scene
    foodScene.addChild(look);
    touchScene.addChild(warp,btn ,anim);
    titleScene.addChild(timeIcon, timerText, dashIcon, scoreText );
    backgroundScene.addChild(table,titleScene,foodScene, touchScene ,sister,anim , success,remind);
    app.stage.addChild(backgroundScene);


    countdown();
    state = play;

    //Start the game loop
    app.ticker.add(delta => gameLoop(delta));



  }
  function gameLoop(delta) {

    //Update the current game state:
    state(delta);

  }

  function stop(){

  }

  function play(delta){

    scoreText.text = score;

    if(countDownNumber === 0){
      timerText.text = countDownNumber + "s";

    }else{
      timerText.text = countDownNumber + "s";
    }

  }
  var firstPage = document.querySelector("#first-page");
  firstPage.addEventListener('click',function () {
    var stop = true;
    countdown(stop);
    removeGame();
  },false);

  var gift = document.querySelector("#gift");
  gift.addEventListener('click',function () {
    var stop = true;
    countdown(stop);
    removeGame();
  },false);


  function packageFood(state) {

    switch(state) {
      case 0:
        pg.play();
        look.texture = v1f;
        warp.texture = foodWrapN;
        remind.visible = true;
        break;
      case 1:
        pg.play();
        look.texture = v2f;
        warp.texture = foodWrapN;
        remind.visible = true;
        break;
      case 2:
        pg.play();
        look.texture = v3f;
        warp.texture = foodWrapN;
        remind.visible = true;
        break;
      case 3:
        pg.play();
        look.texture = v4f;
        warp.texture = foodWrapN;
        remind.visible = true;
        break;
      case 4:
        pg.play();
        look.texture = v5f;
        warp.texture = foodWrapN;
        remind.visible = true;
        break;
    }
  }

  function reNew(score) {

    switch(score) {
      case 1:
        look.texture = v2;
        break;
      case 2:
        look.texture = v3;
        break;
      case 3:
        look.texture = v4;
        break;
      case 4:
        look.texture = v5;
        break;
      case 5:
        $('.page4').css('display','none');
        $('.page5').css('display','block');
        $('.success').css('display','block');
        $('.fail').css('display','none');
        var point = 60 - countDownNumber;
        $('#scoreP').html(point+'<span>秒</span>');
        var stop = true;
        countdown(stop);
        removeGame();
        replay();
        GEvent('觀看廣告');
        break;
    }
  }

  function countdown(stop){

    if (countDownNumber === 0){
      $('.page4').css('display','none');
      $('.page5').css('display','block');
      $('.success').css('display','none');
      $('.fail').css('display','block');
      removeGame();
      replay();
      clearTimeout(countdownid);
      GEvent('觀看廣告');
    }else if(stop){
        clearTimeout(countdownid);
    }else{
      countDownNumber--;
      if(countdownid){
        clearTimeout(countdownid);
      }
      countdownid = setTimeout(countdown,1000);
    }
    return countDownNumber
  }

  function removeGame() {
    loader.reset();
    app.ticker.stop();
    app.stage.removeChild(backgroundScene,playScene,titleScene,foodScene,touchScene);
    app.stage.destroy({children:true, texture:true, baseTexture:true});
    PIXI.utils.destroyTextureCache();
    removeCanvase();
  }

  function replay(){
    var video2 = document.getElementById('myVideo2');
    video2.pause();
    video2.currentTime = '0';
    video2.play();
  }

}

function onDragStart(event) {
  this.data = event.data;
  this.alpha = 1;
  this.dragging = true;
}

function removeCanvase() {

  var canvas = document.getElementsByTagName('canvas')[0];
  if(canvas !== undefined){
    var canvasParent = document.querySelector('#game');
    canvasParent.removeChild(canvas);
  }
}

function divScale(sizeX, sizeY) {
  var game = document.querySelector("#game");
  game.style.transform = "scale(" + sizeX + "," + sizeY + ")";

}

var again = document.querySelector("#again");
//
// again.addEventListener('click',function () {
//   $('.page6').css('display','none');
//   $('.page4').css('display','block');
//   game();
//   GEvent('再玩一次');
// },false);

again.addEventListener('touchstart',function () {
  $('.page6').css('display','none');
  $('.page4').css('display','block');
  game();
  GEvent('再玩一次');
},false);


