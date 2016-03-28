var c = document.getElementById("mainCanvas");
var ctx = c.getContext("2d");
var rect = c.getBoundingClientRect();

var colors = {
    cell : {
        live : '#FF0000',
        dead : '#FFFFFF'
    }
}
var liveCellList = {};
var CellList = {
    addCell : function(xpos, ypos) {
        if (liveCellList[xpos] == undefined) {
            liveCellList[xpos] = [ypos];  
        } else {
            liveCellList[xpos].push(ypos);
        }
    },
    delCell : function(xpos, ypos) {
        var idx = liveCellList[xpos].indexOf(ypos);
        liveCellList[xpos].splice(idx, 1);
    },
    isLive : function(xpos, ypos) {
        if (liveCellList[xpos] == undefined) {
            return false;
            // Cell is in list
        } else if (liveCellList[xpos].indexOf(ypos) != -1) {
            return true;
        } else {
            return false;
        }
    }
}


function toGridx(xpos) {
    var xSq = ((xpos - rect.left) / 10 >> 0) * 10;
    return String(xSq);
}

function toGridy(ypos) {
    var ySq = ((ypos - rect.left) / 10 >> 0) * 10;
    return String(ySq);
}

function selectCell(event) {
    var xsq = toGridx(event.clientX);
    var ysq = toGridy(event.clientY);

    if (!CellList.isLive(xsq,ysq)) {
        // console.log("Selected was DEAD");
        ctx.fillStyle = colors.cell.live;
        CellList.addCell(xsq,ysq);
    } else {
        // console.log("Selected was ALIVE");
        ctx.fillStyle = colors.cell.dead;
        CellList.delCell(xsq,ysq);
    }

    // fill in the rectangle
    console.log(xsq,ysq);
    ctx.fillRect(xsq, ysq, 10, 10);
}
var cellListNeighbors = {};

function nextState() {
    //Take live cell list, loop through all live cells.
    // make another variable cellListNeighbors. Everything starts with 0.
    // add 10 to itself, and 1 to neighbors.
    // liveCellList = {'1': ['1']}
    // { 2: {1:5, 3:12}, 3:{0:1, 3:10}}
    var value = 0;
    var key = '';
    var delta = [-10, 0, 10]
    cellListNeighbors = {};
    for (var i in liveCellList) {
        for (var j = 0; j < liveCellList[i].length; j++) {
            for (var k = 0; k < 3; k++){
                for (var l = 0; l < 3; l++){
                    // if cell is alive, use value 10 instead
                    value = (delta[k] == 0 && delta[l] == 0) ? 10 : 1;
                    // if it doesn't exist yet should equal 10
                    if (cellListNeighbors[String(Number(i) + delta[k])] == undefined) {
                        // console.log(String(Number(i) + delta[k]));
                        // console.log("doesn't exist");
                        // console.log(String(Number(i) + delta[k]) + " is assigned " + key + " and " + value);
                        cellListNeighbors[String(Number(i) + delta[k])] = {};
                        cellListNeighbors[String(Number(i) + delta[k])][String(Number(liveCellList[i][j]) + delta[l])] = value;
                    }
                    // if first exists AND second doesn't either
                    else if (cellListNeighbors[String(Number(i) + delta[k])][String(Number(liveCellList[i][j]) + delta[l])] == undefined){
                        // console.log(String(Number(i) + delta[k]), Number(liveCellList[i][j]) + delta[l]);
                        // console.log("first exist, second doesn't");
                        // console.log(Number(i) + delta[k], Number(liveCellList[i][j]) + delta[l])
                        cellListNeighbors[String(Number(i) + delta[k])][String(Number(liveCellList[i][j]) + delta[l])] = value;
                    } 
                    // if it does exist, then add 10 to existing.
                    else {
                        console.log("NEVER");
                        cellListNeighbors[String(Number(i) + delta[k])][String(Number(liveCellList[i][j]) + delta[l])] += value;
                    }
                }
            }
        }
    }
    for (i in cellListNeighbors) {
        for (j in cellListNeighbors[i]){
            // if live and more than 3 neighbors you stay alive
            if (cellListNeighbors[i][j] > 13 || 
                (cellListNeighbors[i][j] < 12 && cellListNeighbors[i][j] > 9)) {
                ctx.fillStyle = colors.cell.dead;
                CellList.delCell(i, j);
                ctx.fillRect(i, j, 10, 10);
            } else if (cellListNeighbors[i][j] == 3) {
                console.log("hereeeee");
                ctx.fillStyle = colors.cell.live;
                CellList.addCell(i, j);
                ctx.fillRect(i, j, 10, 10);
            }
        }
    }
}




