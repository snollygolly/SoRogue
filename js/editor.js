var blanks = [38,38,169,169,338,338,341,341,341,341,341,387,413,442,468,477,496,496,496,550,606,663,663,670,831,831,1000,1000,1007,1051,1051,1051,1165,1165,1266,1266,1266,1331,1331,1331,1331,1331,1335,1343,1343,1348,1348,1353,1353,1358,1358];

var spriteRows = 200;
var spriteCols = 57;

var tileData = {};
var puzzleData = {
  dimensions: {
    height: 10,
    width: 10
  },
  layers: 3,
  map: []
};

var selectedTile = 0;
var locked = false;

var lastClicked;
var dragging = false;

//var totalTiles = 100;
var totalTiles = 1450;

$( document ).ready(function() {
    console.log("DOM loaded");
    tileData.tiles = generateTiles(totalTiles);
    puzzleData.map = generateMap(puzzleData.dimensions.height * puzzleData.dimensions.width);
    //draw all the layers of the map
    var z = 0;
    while (z < puzzleData.layers){
      var grid = clickableGrid(puzzleData.dimensions.height,puzzleData.dimensions.width, z,function(el,row,col,i){
    		if (locked == true){return;}
  	    console.log("You clicked on item #:",i);
  	    puzzleData.map[i] = selectedTile;
        $(el).removeClass();
        $(el).addClass("t_" + selectedTile);
  		});
      $("#game").append(grid);
      z++;
    }
    drawLayers(puzzleData.layers);
		//document.body.appendChild(grid);
		$("#game").on('dragover', function(event) {event.preventDefault();});
    $("#submit_map").on("click", function (event){
      event.preventDefault();
      mapJSON = formatMap(puzzleData);
      console.log(mapJSON);
    });
		var tiles = clickableTiles(spriteRows,spriteCols,function(el,i){
		    console.log("You clicked on tile #:",i);
			$(el).addClass("clicked");
			if (lastClicked) $(lastClicked).removeClass("clicked");
			lastClicked = el;
			selectedTile = i;
		});
    $(document).on('mousedown', function(event) {
      console.log("mouse down");
      event.preventDefault();
      dragging = true;
    });
    $(document).on('mouseup', function(event) {
      console.log("mouse up");
      event.preventDefault();
      dragging = false;
    });
    $(document).on('mouseover', function(event) {
      if (dragging === true){
        console.log("dragging pos:" + selectedTile);
        if ($(event.target).parents('#game').length) {
          puzzleData.map[$(event.target).attr("data-index")] = selectedTile;
          $(event.target).removeClass();
          $(event.target).addClass("t_" + selectedTile);
        }
      }
    });
		//document.body.appendChild(grid);
		$("#tiles").append(tiles);
		$("#tiles").on('dragstart', function(event) { event.preventDefault();});

    echo.init({
      offset: 100,
      throttle: 250,
      unload: false,
      domElement: "tiles",
      callback: function (element, op) {
        //console.log(element, 'has been', op + 'ed')
      }
    });

});

function drawLayers(total){
  while (total > 0){
    $(".layers_ul").append("<li><a href='#' class='layer_a' data-index='" + (total-1) + "'>" + "Layer " + total + "</a></li>");
    total--;
  }
}

function clearLayers(){
  $(".layers_ul").html();
}

function formatMap(data){
  json = JSON.stringify(data);
  return json;
}

function clickableGrid( rows, cols, z, callback ){
console.log("drawing grid");
    var i=0;
    var grid = document.createElement('table');
    grid.className = 'grid';
    grid.className += ' z_' + String(z);
    for (var r=0;r<rows;++r){
        var tr = grid.appendChild(document.createElement('tr'));
        for (var c=0;c<cols;++c){
            var cell = tr.appendChild(document.createElement('td'));
            cell.setAttribute("class", "t_" + puzzleData.map[i]);
            cell.setAttribute("data-index", i);
            //console.log("getTileArt: " + getTileArt(mapData[i]) + " - mapData: " + mapData[i] + " - i: " + i);
            cell.addEventListener('click',(function(el,r,c,i){
                return function(){
                    callback(el,r,c,i);
                }
            })(cell,r,c,i),false);
            i++;
        }
    }
    return grid;
}

function clickableTiles( rows, cols, callback ){
console.log("drawing tiles");
    var i=0;
    var grid = document.createElement('table');
    grid.className = 'tilegrid';
    for (var r=0;r<rows;++r){
    	if (i >= tileData.tiles.length){break;}
	    var tr = grid.appendChild(document.createElement('tr'));
	    for (var c=0;c<cols;++c){
        var cell = tr.appendChild(document.createElement('td'));
        cell.setAttribute("class", "t_" + i);
        cell.addEventListener('click',(function(el,i){
            return function(){
                callback(el,i);
            }
        })(cell,i),false);
        i++;
        if (i >= tileData.tiles.length){break;}
      }
    }
    return grid;
}


function giveAlert(type, text, dismissable){
	$("#alerts").prepend('<div class="alert alert-' + type + ' ' + ((dismissable == true)?'alert-dismissable':'') + '">' + ((dismissable == true)?'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>':'') + text + '</div>');
}

function getTileArt(id){
	//give me the id for the map, and i'll tell you what tile to use
	path = "img/sprites/";
	id = parseInt(id);
	if (typeof tileData.tiles[id] == 'undefined'){
		path += "error.png";
	}else{
		path += tileData.tiles[id].file;
	}
	return path;
}

function getTileInfo(id){
	//give me the id for the map, and i'll tell you what tile to use
	id = parseInt(id);
	if (typeof tileData.tiles[id] === 'undefined'){
		$("#tileinfo").html("Error");
	}else{
		if (typeof tileData.tiles[id].cache === 'undefined'){
			//$.getJSON( "/api/v1/all/getTileInfo/" + id, function( data ) {
				//we got the tile, now get the game
				tileData.tiles[id].cache = "Tile #" + id;
				$("#tileinfo").html(data.content);
			//});
		}else{
			$("#tileinfo").html(tileData.tiles[id].cache);
		}

	}
}

function generateTiles(total){
  var i = 0;
  var tiles = [];
  while (i < total){
    var tile = {};
    tile.file = "sheet_" + i + ".png";
    tiles.push(tile);
    i++;
  }
  return tiles;
}

function generateMap(total){
  return new Array(total+1).join('1').split('').map(parseFloat);
}
