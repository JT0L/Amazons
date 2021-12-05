const cont = document.querySelector('.container');


// ---------------- array containing current state of the game ----------------------------
var board =  new Array(8);

for(var i = 0; i < 8; i++){
    board[i] = new Array(8);
}

for(var i = 0; i < 8; i++){
    for(var j = 0; j < 8; j++){
        board[i][j] = 0;
    }
}

//--------------------------- initial conditions --------------------


board[0][0] = 2;
board[2][0] = 2;
board[4][0] = 2;


board[3][7] = 1;
board[5][7] = 1;
board[7][7] = 1;


//-----------------------------------------------------------------
