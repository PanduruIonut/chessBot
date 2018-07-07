var currentMove=0;
var algo;
var whiteMove;
var openingBook = [];
var previousMoves=[];
var tempPreviousMoves={};
var whiteMovesArray= [];
var path = document.location.pathname;
var dir = path.substring(0, path.lastIndexOf('/'));

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
        // 1]
        var moveParser=/(\d+)\.\s?([KQNBRO]?[a-h]?x?[a-h]?[1-8]?[KQNBRO-]*x?[a-h]?[1-8]?\+?)?\s?\n?([a-h]?x?[a-h]?[1-8]?[KQNBRO-]*x?[a-h]?x?[a-h]?[1-8]?\+?\#?)?/;

        for(var i=0; i<tempMovesArray.length;i++) {
          var currentOpening = tempMovesArray[i].split('  ');
          // ["scandinavian defense", "1.d5 d6", "2.b3 b8", "3.b5 b8"]
          // Save the name in a variable
          var tempOpening = {
            name: 'Opening',
            moves: []
          };
          // Save the rest of the row in an array
          // ["1.d5 d6", "2.b3 b8", "3.b5 b8"]
          var tempRow = currentOpening;
          for(var j=0; j<tempRow.length;j++) {
            var regexResult=tempRow[j].match(moveParser);
            // regexResult = [0: '1.d4 d5', 1:'1', 2:'d4', 3:'d5'
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
        }
      }
    }
  }
  rawFile.send(null); 
}

readTextFile("file://" + dir + "/PGN/moves1.txt");

function findOpening(){
  var openingFound=undefined;
  if(whiteMove){
    for(var i = 0;i<openingBook.length;i++){
      if(openingBook[i].moves[currentMove].whiteMove==whiteMove){
        openingFound=openingBook[i];
        for(var j = 0;j<whiteMovesArray.length;j++){
          if(whiteMovesArray[j]!=openingBook[i].moves[j].whiteMove){
            openingFound=undefined;
          }
        }
        if(typeof openingFound != "undefined") {
          return openingFound;
        } 
      } else {
        console.log("Keep looking for an opening");
      }
    }
    return;
  }
}
const makeMove = function(mode, skill=3) {
  if (game.game_over() === true) {
    console.log('game over');
    return;
  }
    
  var opening;

  if(mode == 1) {
    if(typeof opening == 'undefined') {
      opening = findOpening();
      console.log("opening final: ", opening);
    }
    if(opening && opening.moves[currentMove].whiteMove == whiteMove ) {
      game.move(opening.moves[currentMove].blackMove);
      currentMove++;
    } else {
      console.log("Am intrat pe else/ AI");
      var t0 = performance.now();
      var move = calcBestMove(skill, game, game.turn())[1];
      var t1 = performance.now();
      console.log("Took " + (t1 - t0) + " milliseconds.")
      console.log("black move:" + move);
      game.move(move);
      tempPreviousMoves.blackMove=move;
      currentMove++;
      algo = 2;
    }
  }
  if(mode == 2 && game.turn() == 'b') {
    console.log("AI-ul gandeste...");
    var t0 = performance.now();
    var move = calcBestMove(skill, game, game.turn())[1];
    var t1 = performance.now();
    console.log("It took " + (t1 - t0) + " milliseconds.")

    game.move(move);
    console.log("A intrat AI-ul in functiune");
    console.log("black move:", move);
  }
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
    whiteMove="O-O";
    whiteMovesArray[currentMove] = whiteMove;
    currentMove++;
  } else {
    wm=target;
    var pieceName=game.get(wm);
    var pieceType=pieceName.type;
    if(pieceType!='p') {
      pieceType=pieceType.toUpperCase();
      whiteMove=pieceType+wm;
      whiteMovesArray[currentMove] = whiteMove;
    } else {
      whiteMove=wm;
      whiteMovesArray[currentMove] = whiteMove;
    }
  }
  counter++;
  window.setTimeout(function() {
    if(typeof algo == 'undefined') {
      algo = 1;
    }
    makeMove(algo, 3);
  }, 250);
}
