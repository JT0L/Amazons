// possible tiles states:
// 0 - empty
// 1 - white pawn
// 2 - black pawn
// 3 - fire
// 4 - available

var aim = 0;
var turn = 1;
const side = 90;
const x0 = (window.innerWidth-8*side)/2;
const y0 = 200;
var possibleSquares = [];  // in this array there are (x, y) pairs
var possibleSquareWinCondition = [];
var xChosen = null;
var yChosen = null;


function checkTileType(x,y){ // checks if tile with coordinates x, y is white or black
    if((x+y)%2){
        squareType = "squareB"
    } else{
        squareType = "squareW"
    }
    return squareType
}


const clearBoard = () =>{ // cleans board
    let i;
    let j;
    for(i=0; i<=7; i++){
        for(j=0; j<=7; j++){
            const s2 = document.getElementById(`${i}-${j}b`);
            if(s2!=null){
                s2.remove();
            }
            const s1 = document.getElementById(`${i}-${j}`); 
            if(s1!=null){
                s1.remove();
            }
        }
    }

}


const drawBoard = () => {  // function drawing the board
    clearBoard();
    let i;
    let j;
    for(i=0; i<=7; i++){
        for(j=0; j<=7; j++){

            squareType = checkTileType(i, j)

            switch(board[i][j]){
                case 0:  // empty
                        cont.innerHTML += `
                        <div class="${squareType}" id="${i}-${j}" style="height: ${side}px; width: ${side}px; position:absolute; left: ${x0+i*side}px; top: ${y0+j*side}px;"></div>
                        `;
                        break;
                case 1: // white pawn
                        cont.innerHTML += `
                        <div class="${squareType}" id="${i}-${j}" style="height: ${side}px; width: ${side}px; position:absolute; left: ${x0+i*side}px; top: ${y0+j*side}px;">
                        <div class="pW" id="${i}-${j}b" style="transform: translate(0%, +15%); margin: auto;"></div>
                        </div>
                        `;
                        break;
                case 2: // black pawn
                        cont.innerHTML += `
                        <div class="${squareType}" id="${i}-${j}" style="height: ${side}px; width: ${side}px; position:absolute; left: ${x0+i*side}px; top: ${y0+j*side}px;">
                        <div class="pB" id="${i}-${j}b" style="transform: translate(0%, +15%); margin: auto;"></div>
                        </div>
                        `;
                        break;
                case 3: // fire
                        cont.innerHTML += `
                        <div class="squareFire" id="${i}-${j}" style="height: ${side}px; width: ${side}px; position:absolute; left: ${x0+i*side}px; top: ${y0+j*side}px;"></div>
                        `;
                        break;
                case 4: // available
                        break;               

             }
        }
    }

};


const makeMove = (id) => { // 
 const x = Number(id[0]);
 const y = Number(id[2]);

 if(board[x][y]==turn){  // if on tile board[x][y] there is current player's pawn, then show possible moves (white always plays on odd turn)
    getMoves(x,y,0);
    xChosen=x;
    yChosen=y;
    aim=1;
 }

}

const getMoves = (x,y,type) =>{ // possible types 0 - green dot, 1 red dot, 2 nothing, only checks for possibles tiles.
    // delta is direction of movement
    let delta = {x:-1, y:-1};  //diagonally left, up
    lineSearch(x,y,delta,type);
    delta = {x:-1, y:1}; // diagonally left, down
    lineSearch(x,y,delta,type);
    delta = {x:1, y:-1};  // diagonally right, up
    lineSearch(x,y,delta,type);
    delta = {x:1, y:1};  // diagonally right, down
    lineSearch(x,y,delta,type);
    delta = {x:0, y:1};  // down
    lineSearch(x,y,delta,type);
    delta = {x:0, y:-1};  // up
    lineSearch(x,y,delta,type);
    delta = {x:-1, y:0};  // left
    lineSearch(x,y,delta,type);
    delta = {x:1, y:0};  // right
    lineSearch(x,y,delta,type);
}


// lineSearch finds possible squares and also updates graphics in showDot
const lineSearch = (x,y,delta,type) => { // possible types 0 - green dot, 1 red dot, 2 nothing, only checks for possibles tiles
    do{
        x+=delta.x;
        y+=delta.y;
        if(x>=0 && x<=7 && y>=0 && y<=7 && board[x][y]==0){
            var square = {x:x,y:y};                             // goes through this line highligthing tiles until it meets some obstacle
            possibleSquares.push(square);


            switch(type){
                case 0:   // need to show green dots
                    showDot(x,y,'pG');
                    break;
                case 1: // need to show red dots
                    showDot(x,y,'pR');
                    break;
                case 2:  // doesn't show anything else, only checks possible moves for game logic
                    possibleSquareWinCondition.push(square);
                    break;
        }

        } else{  // it means something is blocking line and we have to stop
            break;
        }

    }while(1);

}



const showDot = (x,y,dotType) => {  // shows possible turn dot
    const s = document.getElementById(`${x}-${y}`);
    s.remove(); // first removes old tiles

    squareType = checkTileType(x, y)
        
    cont.innerHTML += `
                            <div class="${squareType}" id="${x}-${y}" style="height: ${side}px; width: ${side}px; position:absolute; left: ${x0+x*side}px; top: ${y0+y*side}px;">
                            <div class="${dotType}" id="${x}-${y}b" style="transform: translate(0%, +57%); margin: auto;"></div>
                            </div>
                            `;

};


const changePlaceofPiece = (x_dest,y_dest) => { // changes position of the piece
    if(xChosen==null || yChosen==null){
        drawBoard();
    }else{

        const s2 = document.getElementById(`${xChosen}-${yChosen}b`);
        s2.remove();
        const s1 = document.getElementById(`${xChosen}-${yChosen}`); // removes pawn's old position
        s1.remove();
        normalField(xChosen,yChosen); // fills the gap after old position

        const t = board[xChosen][yChosen]; // gets type of pawn

        board[x_dest][y_dest]=t;
        updatePiece(x_dest,y_dest,t);

        board[xChosen][yChosen]=0; // updates information in the array
        aim = 2;

        while(possibleSquares.length){  // empties possible moves array
            possibleSquares.pop();
        }
    }
};


const updatePiece = (x,y,t) =>{  // updates graphics for tile - now with the piece
    squareType = checkTileType(x,y)

    if (t==1){
        pType = "pW"
    } else{
        pType = "pB"
    }

    cont.innerHTML += `
    <div class="${squareType}" id="${x}-${y}" style="height: ${side}px; width: ${side}px; position:absolute; left: ${x0+x*side}px; top: ${y0+y*side}px;">
    <div class="${pType}" id="${x}-${y}b" style="transform: translate(0%, +15%); margin: auto;"></div>
    </div>
    `;

} 

const normalField  = (x,y) =>{
    squareType = checkTileType(x,y)

    cont.innerHTML += `
    <div class="${squareType}" id="${x}-${y}" style="height: ${side}px; width: ${side}px; position:absolute; left: ${x0+x*side}px; top: ${y0+y*side}px;"></div>
    `;

}


const shootArrow = (x_Arrow,y_Arrow) => { // board now remembers that this tile is blocked
        board[x_Arrow][y_Arrow]=3;
}


cont.addEventListener('click', (e) => {
    e.preventDefault();
    switch(aim){
    case 0: // player didn't choose a piece
        makeMove(e.target.id);
        break;
    
    case 1: // piece is chosen, tiles are higlighted
        let x = Number(e.target.id[0]);  // clicked tile's coordinates
        let y = Number(e.target.id[2]);
        var check = 0;

        possibleSquares.forEach(s => {  //check if clicked tile is possible
        if(s.x==x && s.y==y){
            changePlaceofPiece(x,y);
            xChosen=x;
            yChosen=y;
            check=1;
            drawBoard();
            getMoves(xChosen,yChosen,1); // next step, shows possible squares to shoot arrow for new position
            aim=2;
        }
         }); 
         

        // if check == 0 then player chose not allowed tile and we have to go back to the previous situation(again choosing tile to move)
        if(check==0){
            xChosen=null;
            yChosen=null;
        aim=0;

        while(possibleSquares.length){
            possibleSquares.pop();
        }

        drawBoard();
        }
        break;

    case 2: // now red dots(tiles available to shoot an arrow) are being displayed
        const xArrow = Number(e.target.id[0]);  // clicked tile's coordinates
        const yArrow = Number(e.target.id[2]);
        var check = 0;

        possibleSquares.forEach(el=>{  // checking if chosen is possible
            if(el.x==xArrow && el.y==yArrow){
                shootArrow(xArrow,yArrow);

                xChosen=null;
                yChosen=null;
                aim=0;
                if(turn==1){
                    checkIfEnd(2);
                    turn=2;
                    aim=0;
                }else{
                    checkIfEnd(1);
                    turn=1;
                    aim=0;
                }
                drawBoard();

            }

        });
        

        break;
    }   
});


const checkIfEnd = (player) =>{
    let i;
    let j;
    let numberOfPossibleMoves = 0;
    for(i=0; i<=7; i++){
        for(j=0; j<=7; j++){
            if(board[i][j]==player){
                while(possibleSquareWinCondition.length){
                    possibleSquareWinCondition.pop();
                }
                getMoves(i,j,2);
                numberOfPossibleMoves += possibleSquareWinCondition.length;
            }
        }
    }

    if(numberOfPossibleMoves==0){
        if(turn==2){
            alert('Black has won!'); 
        } else{
            alert('White has won!');
        }
    }

};

drawBoard(); // now we display board for the first time