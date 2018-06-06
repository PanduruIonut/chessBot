'use strict';

var currentMove = 0;
var algo = void 0;
var whiteMove;
var openingBook = [];
var previousMoves = [];
var tempPreviousMoves = {};
var whiteMovesArray= [];
var blackMovesArray= [];

function readTextFile(file) {
  var rawFile = new XMLHttpRequest();

  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        var content = rawFile.responseText;
        var tempMovesArray = content.split('\n');
        // tempMovesArray = [
        //   "scandinavian defense  1.d4 d5  2.b2 b5",
        //   "queen's gambit  1.d5 d6  2.b3 b8  3.b5 b8"
        // ]
        var moveParser = /(\d+)\.\s?([KQNBRO]?[a-h]?x?[a-h]?[1-8]?[KQNBRO-]*x?[a-h]?[1-8]?\+?)?\s?\n?([a-h]?x?[a-h]?[1-8]?[KQNBRO-]*x?[a-h]?x?[a-h]?[1-8]?\+?\#?)?/;

        for (var i = 0; i < tempMovesArray.length; i++) {
          var currentOpening = tempMovesArray[i].split('  ');
          // ["scandinavian defense", "1.d5 d6", "2.b3 b8", "3.b5 b8"]
          // let tempOpeningName = currentOpening.shift();
          // Save the name in a variable
          var tempOpening = {
            name: 'ghvhgvh',
            moves: []
          };
          // console.log("opening"+currentOpening);
          // console.log("currentOpening:"+currentOpening);
          // Save the rest of the row in an array
          // ["1.d5 d6", "2.b3 b8", "3.b5 b8"]
          var tempRow = currentOpening;
          // console.log("tempRow"+tempRow);
          for (var j = 0; j < tempRow.length; j++) {
            var regexResult = tempRow[j].match(moveParser);
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
  };
  rawFile.send(null);
}

readTextFile("file:///C:/Users/wyn/Desktop/chessBot/PGN/moves1.txt");
function findOpening() {
  // console.log("openingBook");
  // console.log(openingBook);
  if (whiteMove) {
    for (var i = 0; i < openingBook.length; i++) {
      // console.log("white moved:");
      // console.log(whiteMovesArray[i]);
      // console.log(tempPreviousMoves);
      // console.log(tempPreviousMoves.index[0].whiteMove);
      // console.log("previousMoves");
      // console.log(previousMoves);
      if (openingBook[i].moves[currentMove].whiteMove == whiteMove) {
        // console.log(openingBook[i]);
        for (var j = 0; j < openingBook[i].moves.length; j++) {
          // console.log("prev");
          // console.log(previousMoves[j]);
          if (whiteMovesArray[j] == openingBook[i].moves[j].whiteMove) {
            // console.log("openingul gasit:");
            // console.log(openingBook[i]);
            return openingBook[i];
          }
          else{
            return 0;
          }
        }
      }
    }
    return 0;
  }
}
var makeMove = function makeMove(mode) {
  var skill = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;

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

  console.log("mode:", mode);

  var opening = void 0;

  if (mode == 1) {
    if (typeof opening == 'undefined') {
      opening = findOpening();
      console.log("CAUT UN OPENING");
      // console.log("opening: ");
      // console.log(opening);
      // console.log("opening moves[currentMove]: ");
      // console.log(opening.moves[currentMove]);
      // console.log("opening.moves[currentMove].whiteMove");
      // console.log(opening.moves[currentMove].whiteMove);
    }
    console.log("sunt inca aici");

    console.log(opening);
    // console.log(opening.moves[currentMove].whiteMove);
    if (opening && opening.moves[currentMove].whiteMove == whiteMove) {
      game.move(opening.moves[currentMove].blackMove);
      tempPreviousMoves.blackMove = opening.moves[currentMove].blackMove;
      blackMovesArray[currentMove] = opening.moves[currentMove].blackMove;
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
      tempPreviousMoves.blackMove = move;
      blackMovesArray[currentMove] = move;
      // console.log(tempPreviousMoves.blackMove);
      currentMove++;
      algo = 2;
    }
  }
  if (mode == 2 && game.turn() == 'b') {
    console.log("A intrat AI-ul in functiune");
    var _move = calcBestMove(skill, game, game.turn())[1];
    game.move(_move);
    console.log("A intrat AI-ul in functiune");
  }
  // console.log(opening.moves[currentMove]);
  board.position(game.fen());
};

function checkNotation(whiteMove){
    var pieceName = game.get(whiteMove);
    var pieceType = pieceName.type;
    if (pieceType != 'p') {
      pieceType = pieceType.toUpperCase();
      whiteMove = pieceType + whiteMove;
      tempPreviousMoves.index = currentMove;
      tempPreviousMoves.whiteMove = whiteMove;
      whiteMovesArray[currentMove] = whiteMove;
      // previousMoves.push(tempPreviousMoves);
      currentMove++;

    }
    else{
      tempPreviousMoves.index = currentMove;
    tempPreviousMoves.whiteMove = whiteMove;
    previousMoves.push(tempPreviousMoves);
    whiteMovesArray[currentMove] = tempPreviousMoves.whiteMove;
    // blackMovesArray[currentMove] = tempPreviousMoves.blackMove;
    }
  }


var counter = 0;
var onDrop = function onDrop(source, target) {
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });
  if (move === null) {
    return 'snapback';
  }
  if (source == "e1" && target == "g1" && game.get(target).type == "k") {
    console.log("Fac rocada");
    whiteMove = "O-O";
    previousMoves.index = currentMove;
    previousMoves.whiteMove = whiteMove;
    whiteMovesArray[currentMove] = whiteMove;
    currentMove++;
    // }
    // else if(target){
  } else {
    whiteMove = target;
    checkNotation(whiteMove);
    // tempPreviousMoves.index = currentMove;
    // tempPreviousMoves.whiteMove = whiteMove;
    // previousMoves.push(tempPreviousMoves);
    // whiteMovesArray[currentMove] = tempPreviousMoves.whiteMove;
    // blackMovesArray[currentMove] = tempPreviousMoves.blackMove;
    // console.log("am facut push");
    // console.log(previousMoves);
    console.log("white moves:");
    console.log(whiteMovesArray);
    console.log("black moves");
    console.log(blackMovesArray);
    // console.log("am intrat pe else"+" mutarea:"+whiteMove);
    console.log("white a mutat:" + target);
      }


  counter++;
  window.setTimeout(function () {
    // bookMove();
    if (typeof algo == 'undefined') {
      algo = 1;
    }
    console.log("algo:", algo);
    makeMove(algo, 3);
  }, 250);
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2pzL21haW4xLmpzIl0sIm5hbWVzIjpbImN1cnJlbnRNb3ZlIiwiYWxnbyIsIndoaXRlTW92ZSIsIm9wZW5pbmdCb29rIiwicHJldmlvdXNNb3ZlcyIsInRlbXBQcmV2aW91c01vdmVzIiwicmVhZFRleHRGaWxlIiwiZmlsZSIsInJhd0ZpbGUiLCJYTUxIdHRwUmVxdWVzdCIsIm9wZW4iLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZWFkeVN0YXRlIiwic3RhdHVzIiwiY29udGVudCIsInJlc3BvbnNlVGV4dCIsInRlbXBNb3Zlc0FycmF5Iiwic3BsaXQiLCJtb3ZlUGFyc2VyIiwiaSIsImxlbmd0aCIsImN1cnJlbnRPcGVuaW5nIiwidGVtcE9wZW5pbmciLCJuYW1lIiwibW92ZXMiLCJ0ZW1wUm93IiwiaiIsInJlZ2V4UmVzdWx0IiwibWF0Y2giLCJ0ZW1wTW92ZSIsImluZGV4IiwiYmxhY2tNb3ZlIiwicHVzaCIsInNlbmQiLCJmaW5kT3BlbmluZyIsImNvbnNvbGUiLCJsb2ciLCJtYWtlTW92ZSIsIm1vZGUiLCJza2lsbCIsImdhbWUiLCJnYW1lX292ZXIiLCJvcGVuaW5nIiwibW92ZSIsImNhbGNCZXN0TW92ZSIsInR1cm4iLCJib2FyZCIsInBvc2l0aW9uIiwiZmVuIiwiY291bnRlciIsIm9uRHJvcCIsInNvdXJjZSIsInRhcmdldCIsImZyb20iLCJ0byIsInByb21vdGlvbiIsImdldCIsInR5cGUiLCJwaWVjZU5hbWUiLCJwaWVjZVR5cGUiLCJ0b1VwcGVyQ2FzZSIsIndpbmRvdyIsInNldFRpbWVvdXQiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsY0FBWSxDQUFoQjtBQUNBLElBQUlDLGFBQUo7QUFDQSxJQUFJQyxTQUFKO0FBQ0EsSUFBSUMsY0FBYyxFQUFsQjtBQUNBLElBQUlDLGdCQUFjLEVBQWxCO0FBQ0EsSUFBSUMsb0JBQWtCLEVBQXRCOztBQUVBLFNBQVNDLFlBQVQsQ0FBc0JDLElBQXRCLEVBQTRCO0FBQzFCLE1BQUlDLFVB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QUNGO0FBQ0E7QUFFQyxHQVZELE1BV0s7QUFDSEUsZ0JBQVVrRCxNQUFWO0FBQ0EvQyxzQkFBa0J5QixLQUFsQixHQUF3QjlCLFdBQXhCO0FBQ0FLLHNCQUFrQkgsU0FBbEIsR0FBNEJBLFNBQTVCO0FBQ0NFLGtCQUFjNEIsSUFBZCxDQUFtQjNCLGlCQUFuQjtBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQUlxRCxZQUFVbEIsS0FBS2dCLEdBQUwsQ0FBU3RELFNBQVQsQ0FBZDtBQUNBaUMsWUFBUUMsR0FBUixDQUFZLG1CQUFpQmdCLE1BQTdCO0FBQ0EsUUFBSU8sWUFBVUQsVUFBVUQsSUFBeEI7QUFDQSxRQUFHRSxhQUFXLEdBQWQsRUFBbUI7QUFDakJBLGtCQUFVQSxVQUFVQyxXQUFWLEVBQVY7QUFDQTFELGtCQUFVeUQsWUFBVXpELFNBQXBCO0FBQ0FHLHdCQUFrQnlCLEtBQWxCLEdBQXdCOUIsV0FBeEI7QUFDRkssd0JBQWtCSCxTQUFsQixHQUE0QkEsU0FBNUI7QUFDQ0Usb0JBQWM0QixJQUFkLENBQW1CM0IsaUJBQW5CO0FBQ0E7QUFDRjs7QUFFRDRDO0FBQ0FZLFNBQU9DLFVBQVAsQ0FBa0IsWUFBVztBQUMzQjtBQUNBLFFBQUcsT0FBTzdELElBQVAsSUFBZSxXQUFsQixFQUErQjtBQUM3QkEsYUFBTyxDQUFQO0FBQ0Q7QUFDRGtDLFlBQVFDLEdBQVIsQ0FBWSxPQUFaLEVBQW9CbkMsSUFBcEI7QUFDQW9DLGFBQVNwQyxJQUFULEVBQWUsQ0FBZjtBQUNELEdBUEQsRUFPRyxHQVBIO0FBUUQsQ0FqREQiLCJmaWxlIjoibWFpbjEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgY3VycmVudE1vdmU9MDtcclxubGV0IGFsZ287XHJcbnZhciB3aGl0ZU1vdmU7XHJcbmxldCBvcGVuaW5nQm9vayA9IFtdO1xyXG52YXIgcHJldmlvdXNNb3Zlcz1bXTtcclxudmFyIHRlbXBQcmV2aW91c01vdmVzPXt9O1xyXG5cclxuZnVuY3Rpb24gcmVhZFRleHRGaWxlKGZpbGUpIHsgICAgIFxyXG4gIGxldCByYXdGaWxlID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gIHJhd0ZpbGUub3BlbihcIkdFVFwiLCBmaWxlLCBmYWxzZSk7XHJcbiAgcmF3RmlsZS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZihyYXdGaWxlLnJlYWR5U3RhdGUgPT09IDQpIHtcclxuICAgICAgaWYocmF3RmlsZS5zdGF0dXMgPT09IDIwMCB8fCByYXdGaWxlLnN0YXR1cyA9PSAwKSB7XHJcbiAgICAgICAgbGV0IGNvbnRlbnQgPSByYXdGaWxlLnJlc3BvbnNlVGV4dDtcclxuICAgICAgICBsZXQgdGVtcE1vdmVzQXJyYXkgPSBjb250ZW50LnNwbGl0KCdcXG4nKTtcclxuICAgICAgICAvLyB0ZW1wTW92ZXNBcnJheSA9IFtcclxuICAgICAgICAvLyAgIFwic2NhbmRpbmF2aWFuIGRlZmVuc2UgIDEuZDQgZDUgIDIuYjIgYjVcIixcclxuICAgICAgICAvLyAgIFwicXVlZW4ncyBnYW1iaXQgIDEuZDUgZDYgIDIuYjMgYjggIDMuYjUgYjhcIlxyXG4gICAgICAgIC8vIF1cclxuICAgICAgICBjb25zdCBtb3ZlUGFyc2VyPS8oXFxkKylcXC5cXHM/KFtLUU5CUk9dP1thLWhdP3g/W2EtaF0/WzEtOF0/W0tRTkJSTy1dKng/W2EtaF0/WzEtOF0/XFwrPyk/XFxzP1xcbj8oW2EtaF0/eD9bYS1oXT9bMS04XT9bS1FOQlJPLV0qeD9bYS1oXT94P1thLWhdP1sxLThdP1xcKz9cXCM/KT8vO1xyXG5cclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0ZW1wTW92ZXNBcnJheS5sZW5ndGg7aSsrKSB7XHJcbiAgICAgICAgICBsZXQgY3VycmVudE9wZW5pbmcgPSB0ZW1wTW92ZXNBcnJheVtpXS5zcGxpdCgnICAnKTtcclxuICAgICAgICAgIC8vIFtcInNjYW5kaW5hdmlhbiBkZWZlbnNlXCIsIFwiMS5kNSBkNlwiLCBcIjIuYjMgYjhcIiwgXCIzLmI1IGI4XCJdXHJcbiAgICAgICAgICAvLyBsZXQgdGVtcE9wZW5pbmdOYW1lID0gY3VycmVudE9wZW5pbmcuc2hpZnQoKTtcclxuICAgICAgICAgIC8vIFNhdmUgdGhlIG5hbWUgaW4gYSB2YXJpYWJsZVxyXG4gICAgICAgICAgbGV0IHRlbXBPcGVuaW5nID0ge1xyXG4gICAgICAgICAgICBuYW1lOiAnZ2h2aGd2aCcsXHJcbiAgICAgICAgICAgIG1vdmVzOiBbXVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwib3BlbmluZ1wiK2N1cnJlbnRPcGVuaW5nKTtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiY3VycmVudE9wZW5pbmc6XCIrY3VycmVudE9wZW5pbmcpO1xyXG4gICAgICAgICAgLy8gU2F2ZSB0aGUgcmVzdCBvZiB0aGUgcm93IGluIGFuIGFycmF5XHJcbiAgICAgICAgICAvLyBbXCIxLmQ1IGQ2XCIsIFwiMi5iMyBiOFwiLCBcIjMuYjUgYjhcIl1cclxuICAgICAgICAgIGxldCB0ZW1wUm93ID0gY3VycmVudE9wZW5pbmc7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInRlbXBSb3dcIit0ZW1wUm93KTtcclxuICAgICAgICAgIGZvcihsZXQgaj0wOyBqPHRlbXBSb3cubGVuZ3RoO2orKykge1xyXG4gICAgICAgICAgICBsZXQgcmVnZXhSZXN1bHQ9dGVtcFJvd1tqXS5tYXRjaChtb3ZlUGFyc2VyKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVnZXhSZXN1bHQpO1xyXG4gICAgICAgICAgICAvLyByZWdleFJlc3VsdCA9IFswOiAnMS5kNCBkNScsIDE6JzEnLCAyOidkNCcsIDM6J2Q1J1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZWdleFJlc3VsdCk7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wTW92ZSA9IHtcclxuICAgICAgICAgICAgICBpbmRleDogcmVnZXhSZXN1bHRbMV0sXHJcbiAgICAgICAgICAgICAgd2hpdGVNb3ZlOiByZWdleFJlc3VsdFsyXSxcclxuICAgICAgICAgICAgICBibGFja01vdmU6IHJlZ2V4UmVzdWx0WzNdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIC8vIHRlbXBNb3ZlID0ge1xyXG4gICAgICAgICAgICAvLyAgIGluZGV4OiAxLFxyXG4gICAgICAgICAgICAvLyAgIHdoaXRlTW92ZTogJ2Q0JyxcclxuICAgICAgICAgICAgLy8gICBibGFja01vdmU6ICdkNSdcclxuICAgICAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAgICAgdGVtcE9wZW5pbmcubW92ZXMucHVzaCh0ZW1wTW92ZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBvcGVuaW5nQm9vay5wdXNoKHRlbXBPcGVuaW5nKTtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwib3BlbmluZ0Jvb2tcIik7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhvcGVuaW5nQm9vayk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJhd0ZpbGUuc2VuZChudWxsKTsgXHJcbn1cclxuXHJcbnJlYWRUZXh0RmlsZShcImZpbGU6Ly8vQzovVXNlcnMvd3luL0Rlc2t0b3AvY2hlc3NCb3QvUEdOL21vdmVzMS50eHRcIik7XHJcbmZ1bmN0aW9uIGZpbmRPcGVuaW5nKCl7XHJcbiAgLy8gY29uc29sZS5sb2coXCJvcGVuaW5nQm9va1wiKTtcclxuICAvLyBjb25zb2xlLmxvZyhvcGVuaW5nQm9vayk7XHJcbiAgaWYod2hpdGVNb3ZlKXtcclxuICAgIGZvcihsZXQgaSA9IDA7aTxvcGVuaW5nQm9vay5sZW5ndGg7aSsrKXtcclxuICAgICAgY29uc29sZS5sb2coXCJwcmV2aW91c01vdmVzXCIpO1xyXG4gICAgICBjb25zb2xlLmxvZyhwcmV2aW91c01vdmVzKTtcclxuICAgICAgLy8gY29uc29sZS5sb2codGVtcFByZXZpb3VzTW92ZXMpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyh0ZW1wUHJldmlvdXNNb3Zlcy5pbmRleFswXS53aGl0ZU1vdmUpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhcInByZXZpb3VzTW92ZXNcIik7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHByZXZpb3VzTW92ZXMpO1xyXG4gICAgICBpZihvcGVuaW5nQm9va1tpXS5tb3Zlc1tjdXJyZW50TW92ZV0ud2hpdGVNb3ZlPT13aGl0ZU1vdmUpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicGFzc2VkXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG9wZW5pbmdCb29rW2ldKTtcclxuICAgICAgICBmb3IobGV0IGogPSAwO2o8b3BlbmluZ0Jvb2tbaV0ubW92ZXMubGVuZ3RoO2orKyl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcInByZXZcIik7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhwcmV2aW91c01vdmVzW2pdKTtcclxuICAgICAgICAgIGlmKHByZXZpb3VzTW92ZXNbal0ud2hpdGVNb3ZlPT1vcGVuaW5nQm9va1tpXS5tb3Zlc1tqXS53aGl0ZU1vdmUpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9wZW5pbmd1bCBnYXNpdDpcIik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG9wZW5pbmdCb29rW2ldKTtcclxuICAgICAgICAgICAgcmV0dXJuIG9wZW5pbmdCb29rW2ldO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIDA7XHJcbiAgfVxyXG59XHJcbmNvbnN0IG1ha2VNb3ZlID0gZnVuY3Rpb24obW9kZSwgc2tpbGw9Mykge1xyXG4gIGlmIChnYW1lLmdhbWVfb3ZlcigpID09PSB0cnVlKSB7XHJcbiAgICBjb25zb2xlLmxvZygnZ2FtZSBvdmVyJyk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIC8vIGFsZ28gPSAxO1xyXG5cclxuICAvLyBpZiAoYWxnbyA9PT0gMSkge1xyXG4gIC8vICAgdmFyIG1vdmUgPSBjYWxjQmVzdE1vdmUoc2tpbGwsIGdhbWUsIGdhbWUudHVybigpKVsxXTtcclxuICAvLyB9IFxyXG4gICAgXHJcbiAgLy8gY29uc29sZS5sb2coZ2FtZS50dXJuKCkrXCIgYSBmYWN1dCBtdXRhcmVhIGFzdGEgXCIrbW92ZSk7ICAgXHJcbiAgLy8gZ2FtZS5tb3ZlKG9wZW5pbmdCb29rLik7XHJcbiAgXHJcbiAgY29uc29sZS5sb2coXCJtb2RlOlwiLG1vZGUpO1xyXG5cclxuICBsZXQgb3BlbmluZztcclxuXHJcbiAgaWYobW9kZSA9PSAxKSB7XHJcbiAgICBpZih0eXBlb2Ygb3BlbmluZyA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICBvcGVuaW5nID0gZmluZE9wZW5pbmcoKTtcclxuICAgICAgY29uc29sZS5sb2coXCJDQVVUIFVOIE9QRU5JTkdcIik7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhcIm9wZW5pbmc6IFwiKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKG9wZW5pbmcpO1xyXG4gICAgLy8gY29uc29sZS5sb2coXCJvcGVuaW5nIG1vdmVzW2N1cnJlbnRNb3ZlXTogXCIpO1xyXG4gICAgLy8gY29uc29sZS5sb2cob3BlbmluZy5tb3Zlc1tjdXJyZW50TW92ZV0pO1xyXG4gICAgLy8gY29uc29sZS5sb2coXCJvcGVuaW5nLm1vdmVzW2N1cnJlbnRNb3ZlXS53aGl0ZU1vdmVcIik7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhvcGVuaW5nLm1vdmVzW2N1cnJlbnRNb3ZlXS53aGl0ZU1vdmUpO1xyXG4gICAgfVxyXG4gICAgY29uc29sZS5sb2coXCJzdW50IGluY2EgYWljaVwiKTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhvcGVuaW5nKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKG9wZW5pbmcubW92ZXNbY3VycmVudE1vdmVdLndoaXRlTW92ZSk7XHJcbiAgICBpZihvcGVuaW5nICYmIG9wZW5pbmcubW92ZXNbY3VycmVudE1vdmVdLndoaXRlTW92ZSA9PSB3aGl0ZU1vdmUgKSB7XHJcbiAgICAgICAgZ2FtZS5tb3ZlKG9wZW5pbmcubW92ZXNbY3VycmVudE1vdmVdLmJsYWNrTW92ZSk7XHJcbiAgICAgIHRlbXBQcmV2aW91c01vdmVzLmJsYWNrTW92ZT1vcGVuaW5nLm1vdmVzW2N1cnJlbnRNb3ZlXS5ibGFja01vdmU7XHJcbiAgICAgIGN1cnJlbnRNb3ZlKys7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiYmxhY2ttb3ZlOlwiKTtcclxuICAgICAgY29uc29sZS5sb2cob3BlbmluZy5tb3Zlc1tjdXJyZW50TW92ZV0uYmxhY2tNb3ZlKTtcclxuICAgICAgLy8gY29uc29sZS5sb2coXCJ0ZW1wUHJldmlvdXNNb3Zlc0JMQUNLXCIpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhcIm9wZW5pbmcgbW92ZXMgYmxhY2tcIik7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKG9wZW5pbmcubW92ZXNbY3VycmVudE1vdmUgLSAxXS5ibGFja01vdmUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2coXCJhbSBpbnRyYXQgcGUgZWxzZS8gQUlcIik7XHJcbiAgICAgIHZhciBtb3ZlID0gY2FsY0Jlc3RNb3ZlKHNraWxsLCBnYW1lLCBnYW1lLnR1cm4oKSlbMV07XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiYmxhY2sgbW92ZTpcIiArIG1vdmUpO1xyXG4gICAgICBnYW1lLm1vdmUobW92ZSk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwidGVtcFByZXZpb3VzTW92ZXNCTEFDS1wiKTtcclxuICAgICAgdGVtcFByZXZpb3VzTW92ZXMuYmxhY2tNb3ZlPW1vdmU7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHRlbXBQcmV2aW91c01vdmVzLmJsYWNrTW92ZSk7XHJcbiAgICAgIGN1cnJlbnRNb3ZlKys7XHJcbiAgICAgIGFsZ28gPSAyO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZihtb2RlID09IDIgJiYgZ2FtZS50dXJuKCkgPT0gJ2InKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIkEgaW50cmF0IEFJLXVsIGluIGZ1bmN0aXVuZVwiKTtcclxuICAgIGxldCBtb3ZlID0gY2FsY0Jlc3RNb3ZlKHNraWxsLCBnYW1lLCBnYW1lLnR1cm4oKSlbMV07XHJcbiAgICBnYW1lLm1vdmUobW92ZSk7XHJcbiAgICBjb25zb2xlLmxvZyhcIkEgaW50cmF0IEFJLXVsIGluIGZ1bmN0aXVuZVwiKTtcclxuICB9XHJcbiAgLy8gY29uc29sZS5sb2cob3BlbmluZy5tb3Zlc1tjdXJyZW50TW92ZV0pO1xyXG4gIGJvYXJkLnBvc2l0aW9uKGdhbWUuZmVuKCkpO1xyXG59XHJcblxyXG5sZXQgY291bnRlcj0wO1xyXG5jb25zdCBvbkRyb3AgPSBmdW5jdGlvbihzb3VyY2UsIHRhcmdldCkge1xyXG4gIGNvbnN0IG1vdmUgPSBnYW1lLm1vdmUoe1xyXG4gICAgZnJvbTogc291cmNlLFxyXG4gICAgdG86IHRhcmdldCxcclxuICAgIHByb21vdGlvbjogJ3EnIFxyXG4gIH0pO1xyXG4gIGlmIChtb3ZlID09PSBudWxsKSB7XHJcbiAgICByZXR1cm4gJ3NuYXBiYWNrJztcclxuICB9XHJcbiAgaWYoKHNvdXJjZT09XCJlMVwiKSAmJiAodGFyZ2V0PT1cImcxXCIpICYmIChnYW1lLmdldCh0YXJnZXQpLnR5cGU9PVwia1wiKSkge1xyXG4gICAgY29uc29sZS5sb2coXCJGYWMgcm9jYWRhXCIpO1xyXG4gICAgd2hpdGVNb3ZlPVwiTy1PXCI7XHJcbiAgICBwcmV2aW91c01vdmVzLmluZGV4PWN1cnJlbnRNb3ZlO1xyXG4gICAgcHJldmlvdXNNb3Zlcy53aGl0ZU1vdmU9d2hpdGVNb3ZlO1xyXG4gICAgcHJldmlvdXNNb3Zlcy5wdXNoKHRlbXBQcmV2aW91c01vdmVzKTtcclxuICAgIGN1cnJlbnRNb3ZlKys7XHJcbiAgLy8gfVxyXG4gIC8vIGVsc2UgaWYodGFyZ2V0KXtcclxuXHJcbiAgfSBcclxuICBlbHNlIHtcclxuICAgIHdoaXRlTW92ZT10YXJnZXQ7XHJcbiAgICB0ZW1wUHJldmlvdXNNb3Zlcy5pbmRleD1jdXJyZW50TW92ZTtcclxuICAgIHRlbXBQcmV2aW91c01vdmVzLndoaXRlTW92ZT13aGl0ZU1vdmU7XHJcbiAgICAgcHJldmlvdXNNb3Zlcy5wdXNoKHRlbXBQcmV2aW91c01vdmVzKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKFwidGVtcFByZXZpb3VzTW92ZXNcIik7XHJcbiAgICAvLyBjb25zb2xlLmxvZyh0ZW1wUHJldmlvdXNNb3Zlcyk7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhcImFtIGludHJhdCBwZSBlbHNlXCIrXCIgbXV0YXJlYTpcIit3aGl0ZU1vdmUpO1xyXG4gICAgdmFyIHBpZWNlTmFtZT1nYW1lLmdldCh3aGl0ZU1vdmUpO1xyXG4gICAgY29uc29sZS5sb2coXCJ3aGl0ZSBhIG11dGF0OlwiK3RhcmdldCk7XHJcbiAgICBsZXQgcGllY2VUeXBlPXBpZWNlTmFtZS50eXBlO1xyXG4gICAgaWYocGllY2VUeXBlIT0ncCcpIHtcclxuICAgICAgcGllY2VUeXBlPXBpZWNlVHlwZS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICB3aGl0ZU1vdmU9cGllY2VUeXBlK3doaXRlTW92ZTtcclxuICAgICAgdGVtcFByZXZpb3VzTW92ZXMuaW5kZXg9Y3VycmVudE1vdmU7XHJcbiAgICB0ZW1wUHJldmlvdXNNb3Zlcy53aGl0ZU1vdmU9d2hpdGVNb3ZlO1xyXG4gICAgIHByZXZpb3VzTW92ZXMucHVzaCh0ZW1wUHJldmlvdXNNb3Zlcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb3VudGVyKys7XHJcbiAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBib29rTW92ZSgpO1xyXG4gICAgaWYodHlwZW9mIGFsZ28gPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgYWxnbyA9IDE7XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmxvZyhcImFsZ286XCIsYWxnbyk7XHJcbiAgICBtYWtlTW92ZShhbGdvLCAzKTtcclxuICB9LCAyNTApO1xyXG59XHJcbiJdfQ==