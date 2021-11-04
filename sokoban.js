window.addEventListener('DOMContentLoaded', () => {
    tileMap = tileMap01; 
    startGame(tileMap);
});

let blocksDone = 0;
let tileGoals = []; 

function startGame(tileMap) {
    drawPreviewMaps();
    setGameBoardGrid("game-board", tileMap.width, "2.25rem")
    drawGameBoard(tileMap)
    updateScore();
    startTimer();
}

function setGameBoardGrid(divName ,width, gridSize) {
	document.getElementById(divName).style.gridTemplateColumns = "repeat(" + width +", "+ gridSize +")";
}

function drawPreviewMap(tileMap) {

    let node = document.createElement("DIV");
    node.classList.add("map");
    document.getElementById("map-navigation").appendChild(node);

    mapDivs = document.getElementsByClassName("map");
    lastMapDiv = mapDivs[mapDivs.length-1];
    lastMapDiv.style.gridTemplateColumns = "repeat(" + tileMap.width +", "+ "1.5rem" +")"
}

function drawPreviewMaps() {
    tileMaps.forEach(map => {
        drawPreviewMap(map);
    })
}

function updateScore() {
	document.getElementById("score").textContent = blocksDone + "/" + tileGoals.length;
}

document.addEventListener('keydown', keyEvent);
    
function keyEvent(event) {

    event.preventDefault();
    
	switch(event.keyCode) {
		case 37: 
            getPositions(1)
		    break;

		case 38: 
            getPositions(tileMap.width)
		    break;

		case 39: 
            getPositions(-1)
		    break;

		case 40: 
            getPositions(-tileMap.width)
		    break;

		default:
		    console.log("Use arrow keys"); 
		}
}

function drawGameBoard(tileMap) {

    let tileIdCount = 0;
	for(let i = 0; i<tileMap.height; i++) {

		for(let j = 0; j<tileMap.width; j++) {

			tileIdCount++;
			let tile = getTileType(tileMap.mapGrid[i][j])
			addTileToGameBoard(tile, tileIdCount);
            
            if(tile === Entities.Block || tile === Entities.Character) {
                addTileSpace(tileIdCount)
            }

            if(tile === Tiles.Goal) {
				tileGoals.push(tileIdCount);
            }
		}
	} 
}

function getTileType(tile) {
    switch(tile[0]) {
        case "W":
            return Tiles.Wall;
        case "B":
            return Entities.Block;
        case "G":
            return Tiles.Goal;
        case "P":
            return Entities.Character;
        case ".":
            return Tiles.Space;
        case " ":
            return "background";
        default:
            throw "No matching tile";
    }
}

function addTileToGameBoard(className, id) {
	let node = document.createElement("DIV");
	node.classList.add(className);
	node.id = id;
	document.getElementById("game-board").appendChild(node);
}

function addTileSpace(idNum) {
	document.getElementById(idNum).classList.add("tile-space");
}

function getPlayerPosition() {
	return document.getElementsByClassName("entity-player")[0].id;
}

function getPositions(position) {
	let playerPosition = getPlayerPosition();
	let oldPosition =  document.getElementById(playerPosition);
	let newPosition = document.getElementById(playerPosition-position);
	let newPositionPlusOne = document.getElementById(playerPosition-position-position);

	move(newPosition, oldPosition, newPositionPlusOne);
}

function move(newPosition, oldPosition, newPositionPlusOne) {

    if(newPosition.classList == Tiles.Space || newPosition.classList == Tiles.Goal) {
        
        moveCharacter(newPosition, oldPosition);
    } 
    else if(newPosition.classList.contains(Entities.Block)) {
        tryMoveBlock(newPosition, oldPosition, newPositionPlusOne);
    }
}

function moveCharacter(newPosition, oldPosition) {
    newPosition.classList.add(Entities.Character);
    oldPosition.classList.remove(Entities.Character);
}

function moveBlock(newPosition, oldPosition, newPositionPlusOne) {
    newPosition.classList.add(Entities.Character);
	oldPosition.classList.remove(Entities.Character);
	newPositionPlusOne.classList.add(Entities.Block);
    newPosition.classList.remove(Entities.Block);
    newPosition.classList.remove(Entities.BlockDone);
}

function tryMoveBlock(newPosition, oldPosition, newPositionPlusOne) {

 	if (!newPositionPlusOne.classList.contains(Entities.Block) && !newPositionPlusOne.classList.contains(Tiles.Wall)) {
		moveBlock(newPosition, oldPosition, newPositionPlusOne)

		if(newPositionPlusOne.classList.contains(Tiles.Goal)) {
            newPositionPlusOne.classList.add(Entities.BlockDone);
			newPosition.classList.remove(Entities.BlockDone);
		}

        checkVictory();
	}
}

function checkVictory() {
    blocksDone = countBlocksAtGoal();
    updateScore();
    if (blocksDone === tileGoals.length) {
        document.getElementById("score-text").textContent = " level complete!";
        stopTimer();
    } 
}

function countBlocksAtGoal() {
    let blocksAtGoal = 0;
    tileGoals.forEach(id => {
        if (document.getElementById(id).classList.contains(Entities.BlockDone)) {
            blocksAtGoal++;
        }
    });
    return blocksAtGoal;
}

function resetMap() {
    let node = document.getElementById("game-board");

    while (node.firstChild) {
        node.removeChild(node.lastChild);
    }

    tileGoals = [];
    blocksDone = 0;
    drawGameBoard(tileMap01)
    updateScore();
    stopTimer();
    resetTimer();
}
    



