
var randomMove = function() {
  var possibleMoves = game.moves();
  var randomIndex = Math.floor(Math.random() * possibleMoves.length);
  return possibleMoves[randomIndex];
};


var evaluateBoard = function(board, color) {
var BlackScore;
var WhiteScore;
  var pieceValue = {
    'p': 100,
    'n': 350,
    'b': 350,
    'r': 525,
    'q': 1000,
    'k': 10000
  };

  var PawnTableWhite = [
0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ,
10  , 10  , 0   , -10 , -10 , 0   , 10  , 10  ,
5   , 0   , 0   , 5   , 5   , 0   , 0   , 5   ,
0   , 0   , 10  , 20  , 20  , 10  , 0   , 0   ,
5   , 5   , 5   , 10  , 10  , 5   , 5   , 5   ,
10  , 10  , 10  , 20  , 20  , 10  , 10  , 10  ,
20  , 20  , 20  , 30  , 30  , 20  , 20  , 20  ,
0   , 0   , 0   , 0   , 0   , 0   , 0   , 0 
];
var KnightTable = [
0 , -10 , 0   , 0   , 0   , 0   , -10 , 0 ,
0 , 0   , 0   , 5   , 5   , 0   , 0   , 0 ,
0 , 0   , 10  , 10  , 10  , 10  , 0   , 0 ,
0 , 0   , 10  , 20  , 20  , 10  , 5   , 0 ,
5 , 10  , 15  , 20  , 20  , 15  , 10  , 5 ,
5 , 10  , 10  , 20  , 20  , 10  , 10  , 5 ,
0 , 0   , 5   , 10  , 10  , 5   , 0   , 0 ,
0 , 0   , 0   , 0   , 0   , 0   , 0   , 0   
];

var BishopTable = [
0 , 0   , -10 , 0   , 0 , -10   , 0   , 0 ,
0 , 0   , 0   , 10  , 10  , 0   , 0   , 0 ,
0 , 0   , 10  , 15  , 15  , 10  , 0   , 0 ,
0 , 10  , 15  , 20  , 20  , 15  , 10  , 0 ,
0 , 10  , 15  , 20  , 20  , 15  , 10  , 0 ,
0 , 0   , 10  , 15  , 15  , 10  , 0   , 0 ,
0 , 0   , 0   , 10  , 10  , 0   , 0   , 0 ,
0 , 0   , 0   , 0   , 0   , 0   , 0   , 0 
];

var RookTable = [
0   , 0     , 5    , 10  , 10  , 5   , 0   , 0   ,
0   , 0     , 5    , 10  , 10  , 5   , 0   , 0   ,
0   , 0     , 5    , 10  , 10  , 5   , 0   , 0   ,
0   , 0     , 5    , 10  , 10  , 5   , 0   , 0   ,
0   , 0     , 5    , 10  , 10  , 5   , 0   , 0   ,
0   , 0     , 5    , 10  , 10  , 5   , 0   , 0   ,
25  , 25    , 25   , 25  , 25  , 25  , 25  , 25  ,
0    , 0    , 5    , 10  , 10  , 5   , 0   , 0   
];

var BishopPair = 40;
var value = 0;

  for (var i = 0 ; i < board.length; i++) {
      for (var j = 0; j < board[i].length; j++) {
        if (board[i][j]){
          value += pieceValue[board[i][j]['type']]
                 * (board[i][j]['color'] == color ? 1 : -1)

          switch(board[i][j]['type']){
            case "p":
              value += PawnTableWhite[i * 8 + j];
              break;
            
            case "b":
              value +=BishopTable[i * 8 + j];
            
              break;
            
             case "n":
              value += KnightTable[i * 8 + j];
              break;

            case "r":
              value +=RookTable[i * 8 + j];
              break;
            
            default :
             
          }
          
         
        }
      }
    
  }
  return value;


 
};




var calcBestMove = function(depth, game, playerColor,
                            alpha=Number.NEGATIVE_INFINITY,
                            beta=Number.POSITIVE_INFINITY,
                            isMaximizingPlayer=true) {
  if (depth === 0) {
    value = evaluateBoard(game.board(), playerColor);
    return [value, null]
  }

  var bestMove = null;
  var possibleMoves = game.moves();
  // random order for possible moves
  // possibleMoves.sort(function(a, b){return 0.5 - Math.random()});
  
  var bestMoveValue = isMaximizingPlayer ? Number.NEGATIVE_INFINITY
                                           : Number.POSITIVE_INFINITY;
  for (var i = 0; i < possibleMoves.length; i++) {
    var move = possibleMoves[i];
    game.move(move);
    value = calcBestMove(depth-1, game, playerColor, alpha, beta, !isMaximizingPlayer)[0];
    console.log(isMaximizingPlayer ? 'Max: ' : 'Min: ', depth, move, value,
                bestMove, bestMoveValue);

    if (isMaximizingPlayer) {
      if (value > bestMoveValue) {
        bestMoveValue = value; 
        bestMove = move;
      }
      alpha = Math.max(alpha, value);
    } else {
      if (value < bestMoveValue) {
        bestMoveValue = value;
        bestMove = move;
      }
      beta = Math.min(beta, value);
    }
    game.undo();
    if (beta <= alpha) {
      console.log('Prune', alpha, beta);
      break;
    }
  }
  console.log('Depth: ' + depth + ' | Best Move: ' + bestMove + ' | ' + bestMoveValue + ' | A: ' + alpha + ' | B: ' + beta);
  return [bestMoveValue, bestMove || possibleMoves[0]];
}
