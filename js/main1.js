var currentMove=0;
var algo;
var whiteMove;
var openingBook = [];
var previousMoves=[];
var tempPreviousMoves={};
var whiteMovesArray= [];

function readTextFile(file) {     
  var rawFile = new XMLHttpRequest();

  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if(rawFile.readyState === 4) {
      if(rawFile.status === 200 || rawFile.status == 0) {
        var content = rawFile.responseText;
        var tempMovesArray = content.split('\n');
        // tempMovesArray = [
        //   "scandinavian defense  1.d4 d5  2.b2 b5",
        //   "queen's gambit  1.d5 d6  2.b3 b8  3.b5 b8"
        // ]
        var moveParser=/(\d+)\.\s?([KQNBRO]?[a-h]?x?[a-h]?[1-8]?[KQNBRO-]*x?[a-h]?[1-8]?\+?)?\s?\n?([a-h]?x?[a-h]?[1-8]?[KQNBRO-]*x?[a-h]?x?[a-h]?[1-8]?\+?\#?)?/;

        for(var i=0; i<tempMovesArray.length;i++) {
          var currentOpening = tempMovesArray[i].split('  ');
          // ["scandinavian defense", "1.d5 d6", "2.b3 b8", "3.b5 b8"]
          // var tempOpeningName = currentOpening.shift();
          // Save the name in a variable
          var tempOpening = {
            name: 'Opening',
            moves: []
          };
          // console.log("opening"+currentOpening);
          // console.log("currentOpening:"+currentOpening);
          // Save the rest of the row in an array
          // ["1.d5 d6", "2.b3 b8", "3.b5 b8"]
          var tempRow = currentOpening;
          // console.log("tempRow"+tempRow);
          for(var j=0; j<tempRow.length;j++) {
            var regexResult=tempRow[j].match(moveParser);
            // console.log(regexResult);
            // regexResult = [0: '1.d4 d5', 1:'1', 2:'d4', 3:'d5'
            // console.log(regexResult);
            var tempMove = {
              index: regexResult[1],
              whiteMove: regexResult[2],
              blackMove: regexResult[3]
            };
            // tempMove = {
            //   index: 1,
            //   whiteMove: 'd4',
            //   blackMove: 'd5'
            // }

            tempOpening.moves.push(tempMove);
          }
          openingBook.push(tempOpening);
          // console.log("openingBook");
          // console.log(openingBook);
        }
      }
    }
  }
  rawFile.send(null); 
}

readTextFile("file:///C:/Users/wyn/Desktop/chessBot/PGN/moves1.txt");
function findOpening(){
  var openingFound=undefined;
  // console.log("openingBook");
  // console.log(openingBook);
  if(whiteMove){
    console.log("opening book");
    console.log(openingBook);
    for(var i = 0;i<openingBook.length;i++){
      // console.log("whiteMove");
      // console.log(whiteMove);
      if(openingBook[i].moves[currentMove].whiteMove==whiteMove){
        
        console.log("passed");
        console.log(openingBook[i]);
        openingFound=openingBook[i];
        for(var j = 0;j<whiteMovesArray.length;j++){
          // console.log(whiteMovesArray[j]);
          // console.log(openingBook[i].moves[j].whiteMove);
          if(whiteMovesArray[j]!=openingBook[i].moves[j].whiteMove){
            console.log("Am intrat in if");
            openingFound=undefined;
            // console.log("openingul gasit:");
            // console.log(openingBook[i]);
            // return openingBook[i];
          }
        }  
      } else {
        console.log("Keep looking for an opening");
      }
    }
    console.log(openingFound);
    if(typeof openingFound != 'undefined'){
      console.log("openingFound");
      console.log(openingFound);
      return openingFound;
    }
    return;
  }
}
const makeMove = function(mode, skill=3) {
  if (game.game_over() === true) {
    console.log('game over');
    return;
  }
  // algo = 1;

  // if (algo === 1) {
  //   var move = calcBestMove(skill, game, game.turn())[1];
  // } 
    
  // console.log(game.turn()+" a facut mutarea asta "+move);   
  // game.move(openingBook.);
  
  console.log("mode:",mode);

  var opening;

  if(mode == 1) {
    if(typeof opening == 'undefined') {
      opening = findOpening();
      console.log("CAUT UN OPENING");
    console.log("opening: ");
    console.log(opening);
    // console.log("opening moves[currentMove]: ");
    // console.log(opening.moves[currentMove]);
    // console.log("opening.moves[currentMove].whiteMove");
    // console.log(opening.moves[currentMove].whiteMove);
    }
    console.log("sunt inca aici");

    console.log(opening);
    // console.log(opening.moves[currentMove].whiteMove);
    if(opening && opening.moves[currentMove].whiteMove == whiteMove ) {
        game.move(opening.moves[currentMove].blackMove);
      // tempPreviousMoves.blackMove=opening.moves[currentMove].blackMove;
      currentMove++;
      console.log("blackmove:");
      console.log(opening.moves[currentMove].blackMove);
      // console.log("tempPreviousMovesBLACK");
      // console.log("opening moves black");
      // console.log(opening.moves[currentMove - 1].blackMove);
    } else {
      console.log("am intrat pe else/ AI");
      var move = calcBestMove(skill, game, game.turn())[1];
      console.log("black move:" + move);
      game.move(move);
      // console.log("tempPreviousMovesBLACK");
      tempPreviousMoves.blackMove=move;
      // console.log(tempPreviousMoves.blackMove);
      currentMove++;
      algo = 2;
    }
  }
  if(mode == 2 && game.turn() == 'b') {
    console.log("A intrat AI-ul in functiune");
    var move = calcBestMove(skill, game, game.turn())[1];
    game.move(move);
    console.log("A intrat AI-ul in functiune");
  }
  // console.log(opening.moves[currentMove]);
  board.position(game.fen());
}

var counter=0;
const onDrop = function(source, target) {
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q' 
  });
  if (move === null) {
    return 'snapback';
  }
  if((source=="e1") && (target=="g1") && (game.get(target).type=="k")) {
    console.log("Fac rocada");
    whiteMove="O-O";
    whiteMovesArray[currentMove] = whiteMove;
    currentMove++;
  // }
  // else if(target){

  } 
  else {
    whiteMove=target;
    var pieceName=game.get(whiteMove);
    console.log("white a mutat:"+target);
    var pieceType=pieceName.type;
    if(pieceType!='p') {
      pieceType=pieceType.toUpperCase();
      whiteMove=pieceType+whiteMove;
      whiteMovesArray[currentMove] = whiteMove;
      console.log(whiteMovesArray);
    }else{
      whiteMovesArray[currentMove] = whiteMove;
    }
  }
  counter++;
  window.setTimeout(function() {
    if(typeof algo == 'undefined') {
      algo = 1;
    }
    console.log("algo:",algo);
    makeMove(algo, 3);
  }, 250);
}
