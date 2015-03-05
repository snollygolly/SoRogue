var Engine = {
  FPS: 30,
  WIDTH: 1024,
  HEIGHT: 768,

  assetsToLoader: [
    "img/Rogue.json",
    "img/start-button.png"
  ],
  sprites: {
    button: {
      sprite: null,
      name: "img/start-button.png",
      x: 100,
      y: 500
    },
  },
  stage: null,
  renderer: null,
  animator: null,

  init: function() {
    $(window).keypress(function(e) {
        var code = e.which;
        if (((code >= 65) && (code <= 90)) || ((code >= 97) && (code <= 122)) || code == 32 || code == 13) {
          $(Engine).trigger("keypress", [code]);
        }
    })
    //now get ready for the stage and such
    Engine.renderer = new PIXI.autoDetectRenderer(Engine.WIDTH, Engine.HEIGHT);
    document.body.appendChild(Engine.renderer.view);
    Engine.stage = new PIXI.Stage;

    // create a new loader
    var loader = new PIXI.AssetLoader(Engine.assetsToLoader);

    // use callback
    loader.onComplete = onAssetsLoaded;

    //begin load
    loader.load();

    function onAssetsLoaded(){
      console.log("all assets loaded");
      rS = new rStats( {
        values: {
            frame: { caption: 'Total frame time (ms)' },
            fps: { caption: 'Framerate (FPS)' },
            render: { caption: 'WebGL Render (ms)' }
        }
      } );
      //add the button
      Engine.sprites.button.sprite = Engine.createSprite(Engine.sprites.button.name, Engine.sprites.button.x, Engine.sprites.button.y);

      // make the button interactive..
      Engine.sprites.button.sprite.interactive = true;

      //event listeners for the button
      Engine.sprites.button.sprite.click = function(data) {
        $(Engine).trigger("ready");
      };
      Engine.sprites.button.sprite.tap = function(data) {
        $(Engine).trigger("ready");
      };

      Engine.prepareStage();
    }
  },
  prepareStage: function() {
    //used to set the main menu
    Engine.stage.addChild(Engine.sprites.button.sprite);
    //draw it on the stage
    Engine.renderer.render(Engine.stage);
  },
  hideMenu: function() {
    Engine.stage.removeChild(Engine.sprites.button.sprite);
  },
  createSprite: function(path, x, y) {
    var sprite = PIXI.Sprite.fromImage(path);
    sprite.x = x;
    sprite.y = y;
    return sprite;
  },
  startAnimation: function() {
    Engine.stopAnimation();
    Engine.animator = setInterval(Engine.animate, Engine.FPS);
  },
  stopAnimation: function() {
    clearInterval(Engine.animator);
  },
  animate: function() {
    rS( 'frame' ).start();
    rS( 'FPS' ).frame();
    //trigger the frame for anyone watching
    $(Engine).trigger("frame");
    rS( 'render' ).start();
    //render the stage
    Engine.renderer.render(Engine.stage);
    rS( 'render' ).end();
    rS( 'frame' ).end();
    rS().update();
  },

  utility: {
    getRandomInt: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }
};
