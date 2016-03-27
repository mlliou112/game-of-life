var c = document.getElementById("mainCanvas");
var ctx = c.getContext("2d");
ctx.fillStyle = '#FF0000';
ctx.fillRect(0,0,10,10);
var rect = c.getBoundingClientRect();

var colors = {
    cell : {
        live : '#FF0000',
        dead : '#FFFFFF'
    }
}

var liveCellList = {
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

    if (!liveCellList.isLive(xsq,ysq)) {
        console.log("Selected was DEAD");
        ctx.fillStyle = colors.cell.live;
        liveCellList.addCell(xsq,ysq);
    } else {
        console.log("Selected was ALIVE");
        ctx.fillStyle = colors.cell.dead;
        liveCellList.delCell(xsq,ysq);
    }

    ctx.fillRect(xsq, ysq, 10, 10);
    // console.log("X/10: " + event.clientX / 10 + " Y/10: " + event.clientY / 10);
}



