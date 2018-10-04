
function game() {


  var section = document.querySelector('#game');
  var vw = window.innerWidth;
  var vh = window.innerHeight;
  var sizeX = ((vw / 640));
  var sc = 640 / 1080;
  var Graphics = PIXI.Graphics;
  var sizeY = ((sizeX * 1080) / 1080);
  divScale(sizeX, sizeY);

  var Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;
  b = new Bump(PIXI);


  var state, boat, player, shark1, shark2, shark3, wave1, wave2, wave3, wave4, wave5, wave6, wave7, wave8, wave9,
    wave10, wave11, wave12, wave13, wave14, playScene, success, fail, chat3, chat2, chat1, Hinetlogo, shark1Scene,
    shark2Scene, shark3Scene, ocean1, ocean2, ocean3, s1d1, s1d2, s2d1, s3d1, playerDea, playerDeaScene, playerAlive,
    test, testScene, shark1NolScene, shark2NolScene, shark3NolScene, shark1RevertScene, shark2RevertScene,
    shark3RevertScene, s1d1R, s1d2R, s2d1R, s3d1R, playerDetection, shark1RDetection, shark1LDetection,
    shark2RDetection, shark2LDetection, shark3RDetection, shark3LDetection ,backgroundScene ,gameOverFailScene,gameOverSuccessScene ;

//Create a Pixi Application
  var app = new Application({
      width: 640,
      height: 1080,
      antialiasing: false,
      transparent: false,
      resolution: 1,
      backgroundColor: 0xC4EDFD
    }
  );

//Add the canvas that Pixi automatically created for you to the HTML document
  section.appendChild(app.view);
  // window.addEventListener("resize", onResize);
//To resize the canvas®
// app.renderer.resize(640, 1080);

//To change the background color
// app.renderer.backgroundColor = 0xC4EDFD;

  loader
    .add("img/game.json")
    .load(setup);


  function setup() {

    backgroundScene = new Container();
    playScene = new Container();
    gameOverFailScene = new Container();
    gameOverSuccessScene = new Container();
    shark1NolScene = new Container();
    shark2NolScene = new Container();
    shark3NolScene = new Container();
    shark1Scene = new Container();
    shark2Scene = new Container();
    shark3Scene = new Container();
    shark1RevertScene = new Container();
    shark2RevertScene = new Container();
    shark3RevertScene = new Container();
    ocean1 = new Container();
    ocean2 = new Container();
    ocean3 = new Container();
    playerDeaScene = new Container();
    playerAlive = new Container();
    testScene = new Container();

    var speedA = 0.2, speedB = 0.3, speedC = 0.4;


    Hinetlogo = new Sprite(
      resources["img/game.json"].textures["HinetLogo.png"]
    );

    Hinetlogo.x = 33.5;
    Hinetlogo.y = 14;

    boat = new Sprite(
      resources["img/game.json"].textures["boat.png"]
    );

    boat.x = 150;
    boat.y = 40;
    boat.vy = speedA;


    wave1 = new Sprite(
      resources["img/game.json"].textures["wave1.png"]
    );
    wave1.y = 198;

    wave1.vy = speedA;

    wave2 = new Sprite(
      resources["img/game.json"].textures["wave2.png"]
    );
    wave2.y = 254;

    wave2.vy = speedB;


    wave3 = new Sprite(
      resources["img/game.json"].textures["wave3.png"]
    );
    wave3.y = 278;

    wave3.vy = speedC;

    wave4 = new Sprite(
      resources["img/game.json"].textures["wave4.png"]
    );
    wave4.y = 340;
    wave4.vy = speedC;

    wave5 = new Sprite(
      resources["img/game.json"].textures["wave5.png"]
    );
    wave5.y = 400;
    wave5.vy = speedA;


    shark3 = new Sprite(
      resources["img/game.json"].textures["shark3L.png"]
    );
    shark3.x = 0;
    shark3.y = 0;

    shark3R = new Sprite(
      resources["img/game.json"].textures["shark3R.png"]
    );
    shark3.x = 0;
    shark3.y = 0;



    chat3 = new Sprite(
      resources["img/game.json"].textures["chat_3.png"]
    );
    chat3.x = 20;
    chat3.y = -100;

    chat3R = new Sprite(
      resources["img/game.json"].textures["chat_3.png"]
    );
    chat3R.x = 20;
    chat3R.y = -100;



    wave6 = new Sprite(
      resources["img/game.json"].textures["wave6.png"]
    );
    wave6.y = 432;
    wave6.vy = speedC;


    wave7 = new Sprite(
      resources["img/game.json"].textures["wave7.png"]
    );
    wave7.y = 519;
    wave7.vy = speedA;

    wave8 = new Sprite(
      resources["img/game.json"].textures["wave8.png"]
    );
    wave8.y = 564;
    wave8.vy = speedB;


    shark2 = new Sprite(
      resources["img/game.json"].textures["shark2R.png"]
    );
    shark2.x = 0;
    shark2.y = 0;

    shark2R = new Sprite(
      resources["img/game.json"].textures["shark2L.png"]
    );
    shark2.x = 0;
    shark2.y = 0;
    // shark2.anchor.set(0.5,0.5);
    // shark2.rotation = 1;


    chat2 = new Sprite(
      resources["img/game.json"].textures["chat_2.png"]
    );
    chat2.x = 0;
    chat2.y = -110;

    chat2L = new Sprite(
      resources["img/game.json"].textures["chat_2.png"]
    );
    chat2L.x = 0;
    chat2L.y = -110;

    wave9 = new Sprite(
      resources["img/game.json"].textures["wave9.png"]
    );
    wave9.y = 629;
    wave9.vy = speedC;


    wave10 = new Sprite(
      resources["img/game.json"].textures["wave10.png"]
    );
    wave10.y = 671;
    wave10.vy = speedB;


    wave11 = new Sprite(
      resources["img/game.json"].textures["wave11.png"]
    );
    wave11.y = 748;
    wave11.vy = speedA;


    shark1 = new Sprite(
      resources["img/game.json"].textures["shark1L.png"]
    );
    shark1.x = 0;
    shark1.y = 0;

    shark1R = new Sprite(
      resources["img/game.json"].textures["shark1R.png"]
    );
    shark1.x = 0;
    shark1.y = 0;


    chat1 = new Sprite(
      resources["img/game.json"].textures["chat_1.png"]
    );
    chat1.x = 60;
    chat1.y = -120;

    chat1R = new Sprite(
      resources["img/game.json"].textures["chat_1.png"]
    );
    chat1R.x = 60;
    chat1R.y = -120;


    wave12 = new Sprite(
      resources["img/game.json"].textures["wave12.png"]
    );
    wave12.y = 838;
    wave12.vy = speedC;


    wave13 = new Sprite(
      resources["img/game.json"].textures["wave13.png"]
    );
    wave13.y = 890;
    wave13.vy = speedA;


    wave14 = new Sprite(
      resources["img/game.json"].textures["wave14.png"]
    );
    wave14.y = 966;
    wave14.vy = speedC;



    player = new Sprite(
      resources["img/game.json"].textures["player-R.png"]
    );
    player.anchor.set(0.5);

    playerDea = new Sprite(
      resources["img/game.json"].textures["fail_player_r.png"]
    );
    playerDea.anchor.set(0.5);
    playerDea.x = 18;
    playerDea.y = -40;

    test = new Sprite(
      resources["img/game.json"].textures["player-R.png"]
    );


    b1d1 = new Graphics();
    b1d1.beginFill(0xFFFFFF, 0);
    b1d1.drawRect(0, 0, 280, 280);
    b1d1.endFill();
    b1d1.x = 200;
    b1d1.y = -60;

    s3d1 = new Graphics();
    s3d1.beginFill(0xFFFFFF, 0);
    s3d1.drawRect(0, 0, 46, 46);
    s3d1.endFill();
    s3d1.x = 10;
    s3d1.y = 10;

    s3d1R = new Graphics();
    s3d1R.beginFill(0xFFFFFF, 0);
    s3d1R.drawRect(0, 0, 46, 46);
    s3d1R.endFill();
    s3d1R.x = 190;
    s3d1R.y = 10;


    s2d1 = new Graphics();
    s2d1.beginFill(0xFFFFFF, 0);
    s2d1.drawRect(0, 0, 70, 70);
    s2d1.endFill();
    s2d1.x = 176;
    s2d1.y = 10;

    s2d1R = new Graphics();
    s2d1R.beginFill(0xFFFFFF, 0);
    s2d1R.drawRect(0, 0, 70, 70);
    s2d1R.endFill();
    s2d1R.x = 10;
    s2d1R.y = 10;


    s1d1 = new Graphics();
    s1d1.beginFill(0xFFFFFF, 0);
    s1d1.drawRect(0, 0, 70, 70);
    s1d1.endFill();
    s1d1.x = 10;
    s1d1.y = 30;

    s1d2 = new Graphics();
    s1d2.beginFill(0xFFFFFF, 0);
    s1d2.drawRect(0, 0, 70, 70);
    s1d2.endFill();
    s1d2.x = 50;
    s1d2.y = 50;

    s1d1R = new Graphics();
    s1d1R.beginFill(0xFFFFFF, 0);
    s1d1R.drawRect(0, 0, 70, 70);
    s1d1R.endFill();
    s1d1R.x = 204;
    s1d1R.y = 30;

    s1d2R = new Graphics();
    s1d2R.beginFill(0xFFFFFF, 0);
    s1d2R.drawRect(0, 0, 70, 70);
    s1d2R.endFill();
    s1d2R.x = 140;
    s1d2R.y = 60;


    s1 = new Graphics();
    s1.beginFill(0xFFFFFF, 0);
    s1.drawRect(0, 0, 10, 10);
    s1.endFill();
    s1.x = 67;
    s1.y = -53;

    s2 = new Graphics();
    s2.beginFill(0xFFFFFF, 0);
    s2.drawRect(0, 0, 10, 10);
    s2.endFill();
    s2.x = 30;
    s2.y = -62;

    s3 = new Graphics();
    s3.beginFill(0xFFFFFF, 0);
    s3.drawRect(0, 0, 10, 10);
    s3.endFill();
    s3.x = -53;
    s3.y = 60;

    s4 = new Graphics();
    s4.beginFill(0xFFFFFF, 0);
    s4.drawRect(0, 0, 10, 10);
    s4.endFill();
    s4.x = -78;
    s4.y = 30;

    s5 = new Graphics();
    s5.beginFill(0xFFFFFF, 0);
    s5.drawRect(0, 0, 10, 10);
    s5.endFill();
    s5.x = -30;
    s5.y = -32;


    shark3Scene.x = 461;
    shark3Scene.y = 416;
    // shark3Scene.x = 261;
    // shark3Scene.y = 416;
    shark3Scene.vx = 2;

    shark2Scene.x = 1;
    shark2Scene.y = 584;
    shark2Scene.vx = 2;

    shark1Scene.x = 400;
    shark1Scene.y = 760;
    // shark1Scene.x = 100;
    // shark1Scene.y = 760;
    shark1Scene.vx = 0.6;


    playScene.interactive = true;
    playScene.buttonMode = true;
    // playScene.anchor.set(0.5);
    playScene.x = 154;
    playScene.y = 890;
    playScene
      .on('pointerdown', onDragStart)
      .on('pointerup', onDragEnd)
      .on('pointerupoutside', onDragEnd)
      .on('pointermove', onDragMove);


    backgroundScene.addChild(Hinetlogo, boat, b1d1, wave1, wave2, wave3, wave4, wave5,);

    ocean1.addChild(wave6, wave7, wave8,);

    shark3NolScene.addChild(shark3, chat3, s3d1);
    shark3RevertScene.addChild(shark3R, chat3R, s3d1R);
    shark3RevertScene.visible = false;
    // shark3NolScene.visible = false;

    ocean2.addChild(wave9, wave10, wave11);

    shark2NolScene.addChild(shark2, chat2, s2d1);
    shark2RevertScene.addChild(shark2R, chat2L, s2d1R);
    shark2RevertScene.visible = false;
    // shark2NolScene.visible = false;

    ocean3.addChild(wave12, wave13, wave14);

    shark1NolScene.addChild(shark1, chat1, s1d1, s1d2);
    shark1RevertScene.addChild(shark1R, chat1R, s1d1R, s1d2R);
    shark1RevertScene.visible = false;
    // shark1NolScene.visible = false;

    playerDeaScene.addChild(playerDea);

    playerAlive.addChild(player, s1, s2, s3, s4, s5);

    playScene.addChild(playerDeaScene, playerAlive);

    playerDeaScene.visible = false;

    // testScene.addChild(test);

    playerDetection = [s1, s2, s3, s4, s5];
    shark1RDetection = [s1d1R, s1d2R];
    shark1LDetection = [s1d1, s1d2];
    shark2RDetection = [s2d1R];
    shark2LDetection = [s2d1];
    shark3RDetection = [s3d1R];
    shark3LDetection = [s3d1];


    testScene.setParent(backgroundScene);

    shark3NolScene.setParent(shark3Scene);
    shark3RevertScene.setParent(shark3Scene);

    ocean1.setParent(backgroundScene);

    shark2NolScene.setParent(shark2Scene);
    shark2RevertScene.setParent(shark2Scene);

    ocean2.setParent(backgroundScene);

    shark1NolScene.setParent(shark1Scene);
    shark1RevertScene.setParent(shark1Scene);

    ocean3.setParent(backgroundScene);


    playScene.setParent(backgroundScene);

    playerAlive.setParent(playScene);

    playerDeaScene.setParent(playScene);

    fail = new Sprite(
      resources["img/game.json"].textures["fail.png"]
    );
    fail.y = 384;
    gameOverFailScene.addChild(fail);


    success = new Sprite(
      resources["img/game.json"].textures["success.png"]
    );
    success.y = 384;



    gameOverSuccessScene.addChild(success);


    app.stage.addChild(backgroundScene, shark3Scene, ocean1, shark2Scene, ocean2, shark1Scene, ocean3, playScene);

    app.stage.addChild(gameOverFailScene);
    gameOverFailScene.visible = false;

    app.stage.addChild(gameOverSuccessScene);
    gameOverSuccessScene.visible = false;


    //Set the game state
    state = play;

    //Start the game loop
    app.ticker.add(delta => gameLoop(delta));


  }

  function gameLoop(delta) {

    //Update the current game state:
    state(delta);

  }

  function play(delta) {


    boat.y += boat.vy;

    boat.vy = loop(40, boat.y, boat.vy);

    wave1.y += wave1.vy;

    wave1.vy = loop(198, wave1.y, wave1.vy);

    wave2.y += wave2.vy;

    wave2.vy = loop(254, wave2.y, wave2.vy);

    wave3.y += wave3.vy;

    wave3.vy = loop(278, wave3.y, wave3.vy);

    wave4.y += wave4.vy;

    wave4.vy = loop(340, wave4.y, wave4.vy);

    wave5.y += wave5.vy;

    wave5.vy = loop(400, wave5.y, wave5.vy);

    wave6.y += wave6.vy;

    wave6.vy = loop(432, wave6.y, wave6.vy);

    wave7.y += wave7.vy;

    wave7.vy = loop(519, wave7.y, wave7.vy);

    wave8.y += wave8.vy;

    wave8.vy = loop(564, wave8.y, wave8.vy);

    wave9.y += wave9.vy;

    wave9.vy = loop(629, wave9.y, wave9.vy);

    wave10.y += wave10.vy;

    wave10.vy = loop(671, wave10.y, wave10.vy);

    wave11.y += wave11.vy;

    wave11.vy = loop(748, wave11.y, wave11.vy);

    wave12.y += wave12.vy;

    wave12.vy = loop(838, wave12.y, wave12.vy);

    wave13.y += wave13.vy;

    wave13.vy = loop(890, wave13.y, wave13.vy);

    wave14.y += wave14.vy;

    wave14.vy = loop(936, wave14.y, wave14.vy);


    shark1Scene.x += shark1Scene.vx;

    var shark1SceneHitsWall = contain(shark1Scene, {
      x: 300,
      y: 0,
      width: 640,
      height: 1080
    }, shark1NolScene, shark1RevertScene);

    if (shark1SceneHitsWall === "left" || shark1SceneHitsWall === "right") {
      shark1Scene.vx *= -1;
    }

    shark2Scene.x += shark2Scene.vx;

    var shark2SceneHitsWall = contain(shark2Scene, {
      x: 0,
      y: 0,
      width: 640,
      height: 1080
    }, shark2RevertScene, shark2NolScene);


    if (shark2SceneHitsWall === "right" || shark2SceneHitsWall === "left") {
      shark2Scene.vx *= -1;
    }

    shark3Scene.x += shark3Scene.vx;

    var shark3SceneHitsWall = contain(shark3Scene, {
      x: 0,
      y: 0,
      width: 640,
      height: 1080
    }, shark3NolScene, shark3RevertScene);

    if (shark3SceneHitsWall === "left" || shark3SceneHitsWall === "right") {
      shark3Scene.vx *= -1;
    }


    if (b.rectangleCollision(s1, b1d1)) {
      state = successScene;
    }

    if (shark1RevertScene.visible === false) {
      playerDetection.forEach(function (player) {
        shark1LDetection.forEach(function (shark) {
          gamefaillCollision(player, shark)
        })
      });
    } else {
      playerDetection.forEach(function (player) {
        shark1RDetection.forEach(function (shark) {
          gamefaillCollision(player, shark)
        })
      });
    }

    if (shark2RevertScene.visible === false) {
      playerDetection.forEach(function (player) {
        shark2LDetection.forEach(function (shark) {
          gamefaillCollision(player, shark)
        })
      });
    } else {
      playerDetection.forEach(function (player) {
        shark2RDetection.forEach(function (shark) {
          gamefaillCollision(player, shark)
        })
      });
    }

    if (shark3RevertScene.visible === false) {
      playerDetection.forEach(function (player) {
        shark3LDetection.forEach(function (shark) {
          gamefaillCollision(player, shark)
        })
      });
    } else {
      playerDetection.forEach(function (player) {
        shark3RDetection.forEach(function (shark) {
          gamefaillCollision(player, shark)
        })
      });
    }

  }


  function successScene() {
    gameOverSuccessScene.visible = true;
    loader.reset();
    app.ticker.stop();
    setTimeout(function () {
      document.querySelector("#game").style.display = "none";
      document.querySelector(".share").style.display = "block";
      app.stage.removeChild(backgroundScene,shark3Scene,ocean1,shark2Scene,ocean2,shark1Scene,ocean3,playScene,gameOverSuccessScene,gameOverFailScene);
      app.stage.destroy({children:true, texture:true, baseTexture:true});
      PIXI.utils.destroyTextureCache ();
      removeCanvase();
      GEvent('結果頁');
    }, 800);
    GEvent('挑戰成功');

  }

  function failScene() {
    gameOverFailScene.visible = true;
    playerDeaScene.visible = true;
    playerAlive.visible = false;
    loader.reset();

    app.ticker.stop();
    setTimeout(function () {
      document.querySelector("#game").style.display = "none";
      document.querySelector(".share").style.display = "block";
      app.stage.removeChild(backgroundScene,shark3Scene,ocean1,shark2Scene,ocean2,shark1Scene,ocean3,playScene,gameOverSuccessScene,gameOverFailScene);
      app.stage.destroy({children:true, texture:true, baseTexture:true});
      PIXI.utils.destroyTextureCache ();
      removeCanvase();
      GEvent('結果頁');
    }, 800);
    GEvent('挑戰失敗');

  }
  function gamefaillCollision(a, c) {
    if (b.rectangleCollision(a, c)) {
      state = failScene;

    }
  }

  function removeCanvase() {
    var canvas = document.getElementsByTagName('canvas')[0];
    var canvasParent = document.querySelector('#game');
    canvasParent.removeChild(canvas);
  }

  function onResize() {
    vw = window.innerWidth;
    vh = window.innerHeight;
    app.renderer.resize(vw, vh);

  }

}

//wave方向變換
function loop(oy, ny, vy) {

  var range = ny - oy;

  if (range > 0 && range <= 10) {
    ran = vy * 1;
  } else {
    ran = vy * -1;
  }

  return ran
}

function contain(sprite, container, scane1, scane2) {

  var collision = undefined;

  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision = "left";
    scane1.visible = false;
    scane2.visible = true;
  }

  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
    collision = "right";
    scane1.visible = true;
    scane2.visible = false;
  }

  return collision
}

//事件偵測
function onDragStart(event) {
  this.data = event.data;
  this.alpha = 1;
  this.dragging = true;
}

function onDragEnd() {
  this.alpha = 1;
  this.dragging = false;
  this.data = null;
}

function onDragMove() {
  if (this.dragging) {
    var newPosition = this.data.getLocalPosition(this.parent);
    this.x = newPosition.x;
    this.y = newPosition.y;
  }
}



function divScale(sizeX, sizeY) {
  var game = document.querySelector("#game");
  game.style.transform = "scale(" + sizeX + "," + sizeY + ")";

}



var again = document.querySelector("#again");
again.addEventListener('click',function () {
  game();
},false);
again.addEventListener('touchstart',function () {
  game();
},false);


