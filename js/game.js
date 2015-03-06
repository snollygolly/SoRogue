var FRAME_TO_MS = (1000 / Engine.FPS);

var TILE_SIZE = 30;

var LEFT_OFFSET = 100;
var TOP_OFFSET = 100;

var MAP_WIDTH = 5;
var MAP_HEIGHT = 10;

//var MAP = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], [0,5,5,5,0,0,5,6,5,0,0,5,5,5,0]];
var MAP = [];
var currentMap = [];
var mapContainer = [];

//the main animator
var animator;

function makeMap(){
  var map = [];
  var offset_y = 57 * 33;
  var offset_x = 52;
  var i = 0;
  while (i < MAP_HEIGHT){
    console.log("drawing row: " + i);
    y = (i * 57) + offset_y;
    map.push(offset_x+y, offset_x+y+1, offset_x+y+2, offset_x+y+3, offset_x+y+4);
    i++;
  }
  MAP.push(map);
}

function init(){
  Engine.init();

  //when the engine has loaded all the sprites and is ready...
  $(Engine).on("ready", function(){
    prepareGame();
  });
  //when the user presses a key...
  $(Engine).on("keypress", function(e, code){
    handleInput(code);
  });
  //when a frame is ready to be animated
  $(Engine).on("frame", function(){
    animate();
  });

  makeMap();
}

function handleInput(key){
  var char = String.fromCharCode(key).toUpperCase();
  if (char == " "){
    //trap the space
    char = "-";
  }
}

function prepareLayers(total){
  var i = 0;
  while (i < total){
    mapContainer[i] = new PIXI.DisplayObjectContainer();
    // create an empty container
    mapContainer[i].position.x = 0;
    mapContainer[i].position.y = 0;
    Engine.stage.addChild(mapContainer[i]);
    i++;
  }
}

function prepareGame(){
  console.log("preparing game");
  prepareLayers(MAP.length);
  //to be used when entering the game from the main menu
  Engine.hideMenu();
  //behind the scenes, we stop it as well for safety
  Engine.startAnimation();
  resetGame();
  startGame();
}

function startGame(){
  //to be used between rounds, or after the game is prepared
  drawMap(MAP);
}

function resetGame(){
  //to get a blank slate after being init-ed
  clearMap();
}

function drawMap(m){
  //l is equal to the current layer
  var l = 0;
  //while the layer is less than all layers in the map
  while (l < m.length){
    //i is the index inside a specific layer
    var i = 0;
    //to make it a little easier to read
    var map = m[l];
    //make an empty array here
    currentMap[l] = [];
    //while index is less than total tiles
    while (i < map.length){
      //this works.
      var x = ((i % MAP_WIDTH) * TILE_SIZE) + LEFT_OFFSET;
      var y = (Math.floor(i / MAP_WIDTH) * TILE_SIZE) + TOP_OFFSET;
      var tile = createTile(map[i], x, y);
      currentMap[l].push(tile);
      mapContainer[l].addChild(tile);
      i++;
    }
    l++;
  }
}

function createTile(tileIndex, x, y){
  console.log("creating tile [index: t_" + tileIndex + " - " + x + ", " + y + "]");
  var tile = PIXI.Sprite.fromFrame("t_" + tileIndex);
  tile.width = tile.height = TILE_SIZE;
  tile.position.x = x;
  tile.position.y = y;
  tile.id = tileIndex;
  return tile;
}


function clearMap(){
  var l = 0;
  while (currentMap.length != 0){
    var map = currentMap.shift();
    while (map.length != 0){
      var tile = map.pop();
      mapContainer[l].removeChild(tile);
    }
    l++;
  }
}

function animate() {

}
