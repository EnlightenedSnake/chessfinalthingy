const chessBoardGrid = document.getElementsByClassName("chessboard-grid")[0],
          chessPiecesGrid = document.getElementsByClassName("chesspieces-grid")[0],
          dropdownBtn = document.getElementsByClassName("pastchessboarddorpbtn")[0],
          dropdownContainer = document.getElementsByClassName("dropdown-container")[0],
          pastchessboards = document.getElementsByClassName("pastchessboards"),
          kingdependBtns = Array.from(document.getElementsByClassName("kingdependentbtns-container")[0].children),
          aiTxt = document.getElementsByClassName("airesponsetxt")[0],
    	typeNameMap = new Map([["white-pawn",[0,0]],["white-knight",[0,1]],["white-bishop",[0,2]],["white-rook",[0,3]],["white-queen",[0,4]],["white-king",[0,5]],["black-pawn",[1,0]],["black-knight",[1,1]],["black-bishop",[1,2]],["black-rook",[1,3]],["black-queen",[1,4]],["black-king",[1,5]]]);
var chessboard = [[],[],[],[],[],[],[],[]],
        chesspieces= [[],[]],
        selectedPiece = "none",
        selectedColor = "none",
        kings = new Map([["white-king",[false,null]],["black-king",[false,null]]]);

for(let chessRow = 0; chessRow < 8; ++chessRow){
    for(let chessCol = 0, letters = ["a","b","c","d","e","f","g","h"]; chessCol < 8; ++chessCol){
        chessboard[chessCol][chessRow] = document.createElement("button");
        chessBoardGrid.appendChild(chessboard[chessCol][chessRow]);
        chessboard[chessCol][chessRow].id = letters[chessCol] + (8-chessRow);
        if((chessCol+chessRow)%2==0){
            chessboard[chessCol][chessRow].className = "chesssquare white nopiece";
        } else {
            chessboard[chessCol][chessRow].className = "chesssquare black nopiece";
        }
        if(chessCol == 0) {
            let numEle = document.createElement("div");
            numEle.className = "chessboard-number";
            numEle.innerText = (8-chessRow);
            chessboard[chessCol][chessRow].appendChild(numEle);
        }
        if(chessRow == 7) {
            let letterEle = document.createElement("div");
            letterEle.className = "chessboard-letter";
            letterEle.innerText = letters[chessCol];
            chessboard[chessCol][chessRow].appendChild(letterEle);
        }
    }
}
for(let pieceColor = 0, colors = ["white","black"]; pieceColor < 2; ++pieceColor){
    for(let pieceType = 0, types = ["pawn","knight","bishop","rook","queen","king"]; pieceType < 6; ++pieceType){
    chesspieces[pieceColor][pieceType] = document.createElement("button");
    chesspieces[pieceColor][pieceType].className = "chesssquare " + colors[pieceColor] + " " + colors[pieceColor] + "-" + types[pieceType]; //Add when added imgs for pieces
    chessPiecesGrid.appendChild(chesspieces[pieceColor][pieceType]);
    }
}
  
function unselectPiece(){
    if(selectedPiece != "none"){
        let pos = typeNameMap.get(selectedPiece);
    chesspieces[pos[0]][pos[1]].style.filter = "brightness(1)";
    selectedPiece = "none";
    }
}
function selectPiece(selectedPieceClasses){
    if(selectedPiece != "none") unselectPiece();

    selectedPiece = selectedPieceClasses[2];
    let pos = typeNameMap.get(selectedPieceClasses[2]);
    chesspieces[pos[0]][pos[1]].style.filter = "brightness(0.7)";
}
function checkTwoKings(){
    if (kings.get("white-king")[0] && kings.get("black-king")[0]){
        kingdependBtns.forEach(button => button.disabled = false);
    } else {
        kingdependBtns.forEach(button => button.disabled = true);
    }
}
function clearBoard(){
    chessboard.forEach(chessCol => {
        chessCol.forEach(square => {
            square.classList.replace(square.classList[2], "nopiece");
        });
    });
    kings.set("white-king", [false,null]);
    kings.set("black-king", [false,null]);

}
function viewOnlyScreen(){
    chessPiecesGrid.style.visibility = "hidden";
    dropdownContainer.style.visibility = "hidden";
    kingdependBtns[0].parentElement.style.visibility = "hidden";
}

chessBoardGrid.addEventListener("click", (event) => {
    const chessSquare = event.target.closest(".chesssquare");
    if(selectedPiece != "none"){
        if(chessSquare.classList[2].slice(-4) == "king") kings.set(chessSquare.classList[2], [false,null]);
        if(selectedPiece.slice(-4) == "king"){
            if(kings.get(selectedPiece)[0]) kings.get(selectedPiece)[1].classList.replace(selectedPiece, "nopiece");
            kings.set(selectedPiece, [true, chessSquare]);
        }
        checkTwoKings();
        chessSquare.classList.replace(chessSquare.classList[2], selectedPiece);
        unselectPiece();
    }
    console.log(chessSquare.id);
});

chessBoardGrid.addEventListener("contextmenu", (event) => {
    const chessSquare = event.target.closest(".chesssquare");
    event.preventDefault();
    if(chessSquare.classList[2] != "nopiece"){
        console.log(chessSquare.classList[2]);
        selectPiece(chessSquare.classList);
    }
});

chessBoardGrid.addEventListener("auxclick", (event) => {
    if(event.button != 1) return;
    const chessSquare = event.target.closest(".chesssquare");
    event.preventDefault();
    if(chessSquare.classList[2] != "nopiece"){
        if(chessSquare.classList[2].slice(-4) == "king") {
            kings.set(chessSquare.classList[2], [false,null]);
            checkTwoKings();
        }
        chessSquare.classList.replace(chessSquare.classList[2], "nopiece");
    }
});

chessPiecesGrid.addEventListener("click", (event) => {
    const piece = event.target.closest(".chesssquare");
    if(piece) selectPiece(piece.classList);
});

dropdownBtn.onclick = () => {
    if(dropdownContainer.style.visibility == "hidden"){
        dropdownContainer.style.visibility = "visible";
    } else {
        dropdownContainer.style.visibility = "hidden";
    }
}

kingdependBtns[0].onclick = () => {
    if(selectedColor != "none"){
        let temp = document.createElement("button");
        temp.className = "pastchessboards";
        temp.innerText = "Chessboard #" + pastchessboards.length;
        pastchessboards[0].insertAdjacentElement("afterend",temp);
        viewOnlyScreen()
        selectedColor.classList.toggle('selected', false);
        selectedColor = "none";
        //ai button stuff 
    }
}

for(let numColor = 1; numColor < 3; ++numColor){
    kingdependBtns[numColor].onclick = () => {
        kingdependBtns[numColor].classList.toggle('selected', true);
        kingdependBtns[3-numColor].classList.toggle('selected',false);
        selectedColor = kingdependBtns[numColor];
    }
}

pastchessboards[0].parentElement.addEventListener("click", (event) => {
    const button = event.target.closest(".pastchessboards");
    console.log(button);
    if(button){
        if(button == pastchessboards[0]){
            clearBoard();
            chessPiecesGrid.style.visibility = "visible";
            dropdownContainer.style.visibility = "hidden";
            checkTwoKings();
            kingdependBtns[0].parentElement.style.visibility = "visible";
        } else {
            clearBoard();
            //Get chessboard from database along with AI response and project it
            viewOnlyScreen();
        }
    }
});