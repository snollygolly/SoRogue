var tileData = {};
var puzzleData = {
  dimensions: {
    height: 35,
    width: 30
  },
  map: []
};

var selectedTile = 0;
var locked = false;

var lastClicked;

//var totalTiles = 100;
var totalTiles = 2122;

$( document ).ready(function() {
    console.log("DOM loaded");
    tileData.tiles = generateTiles(totalTiles);
    puzzleData.map = generateMap(puzzleData.dimensions.height * puzzleData.dimensions.width);
		var grid = clickableGrid(puzzleData.dimensions.height,puzzleData.dimensions.width,function(el,row,col,i){
  		if (locked == true){return;}
	    console.log("You clicked on item #:",i);
	    puzzleData.map[i] = selectedTile;
			el.innerHTML = "<img src='" + getTileArt(selectedTile) + "'>";
		});
		//document.body.appendChild(grid);
		$("#game").append(grid);
		$("#game").on('dragstart', function(event) {event.preventDefault();});
		var tiles = clickableTiles(200,30,function(el,i){
		    console.log("You clicked on tile #:",i);
			el.className='clicked';
			if (lastClicked) lastClicked.className='';
			lastClicked = el;
			selectedTile = i;
		});
		//document.body.appendChild(grid);
		$("#tiles").append(tiles);
		$("#tiles").on('dragstart', function(event) { event.preventDefault();});

    echo.init({
      offset: 100,
      throttle: 250,
      unload: false,
      callback: function (element, op) {
        //console.log(element, 'has been', op + 'ed')
      }
    });

});


function clickableGrid( rows, cols, callback ){
console.log("drawing grid");
    var i=0;
    var grid = document.createElement('table');
    grid.className = 'grid';
    for (var r=0;r<rows;++r){
        var tr = grid.appendChild(document.createElement('tr'));
        for (var c=0;c<cols;++c){
            var cell = tr.appendChild(document.createElement('td'));
            //console.log("getTileArt: " + getTileArt(mapData[i]) + " - mapData: " + mapData[i] + " - i: " + i);
            cell.innerHTML = "<img src='" + getTileArt(puzzleData.map[i]) + "'>";
            $(cell).on('dragstart', function(event) {
              console.log("drag");
            });
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
            cell.innerHTML = "<img src='/img/loading.gif' data-echo='" + getTileArt(i) + "'>";
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