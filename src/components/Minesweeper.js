/*
Oppoortunities to optimize if given more time:

- Create a generalized function to iterate through the mine and 
board values, ie. setNumbers and and checkAround
- Function would take in the following parameters... 
-- Conditions as a string since adding values to board and 
revealing board squares are different
-- callbacks to set variable assignments
-- variables for the return value

*/


import React, { Component } from 'react';

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this._colorSquare = this._colorSquare.bind(this);
  }

  handleClick() {
    const {row, column, value, reveal, onClick} = this.props;
    onClick(row, column, value, reveal);
  }

  _colorSquare(value){
    if(value === "mine"){
      return `red`
    } else{
      return `rgb(${256 * Math.cos(value * 30) * Math.sin(value * 30)}, ${256 * Math.cos(value * 30)}, ${256 * Math.sin(value * 30)}`
    }
  }

  render() {
    const {row, column, value, reveal} = this.props;
    let content = (reveal===true)? value : "";

    const backgroundColor = (reveal)? { ...squareStyle, backgroundColor: this._colorSquare(value) } : squareStyle;
    return (
      <button 
        style={backgroundColor}
        row={row} 
        column={column} 
        value={value}
        reveal={reveal.toString()} 
        disabled={reveal}
        onClick={this.handleClick}>
          {content}
      </button>
    );
  }
}

const squareStyle = {
  height: '50px',
  width: "50px",
  border: "0.5px solid black",
  borderRadius: '3px',
  display: 'flex',
  color: "white",
  fontWeight: "700",
  justifyContent: 'center',
  alignItems : 'center',
}


export default class Minesweeper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: 8, 
      columns: 8, 
      minesPercent:20, 
      board:[], 
      mines:[], 
      gameover: false, 
      win: false
    }
    
    this.createBoard = this.createBoard.bind(this);
    this.setNumbers = this.setNumbers.bind(this);

    this.checkAround = this.checkAround.bind(this);
    this.countReveals = this.countReveals.bind(this);

    this.handleClick = this.handleClick.bind(this);

  }

  componentDidMount(){
    const gameState = this.setNumbers(this.createBoard());
    this.setState(gameState);
  }

  createBoard (){
    let {rows, columns, minesPercent, board, mines} = this.state;

    for(var x = 0; x < rows; x++){
      //generate rows
      let row = [];
      for (var y = 0; y < columns; y++){
      //generate columns
      //set a random number 0-100. 
      //If the randnumb is less than the percent of mines
      //then make it a mine, else make it blank
      let value = Math.floor(Math.random()*100) < minesPercent ? "mine" : 0;
      //insert mines here
      //add to mine locator
        if(value === "mine"){ mines.push({row: x, column: y, reveal: false})};
      //add to row
        row.push({value, reveal: false});
      }
      //add row to board
      board.push(row);
    }

    console.log("createboard", {board, mines});
    return {board, mines}
  }

  setNumbers(unfinishedBoard){
    let {board, mines} = unfinishedBoard;
    //get the board with mines
    console.log("im in setnumbers", "board", board, "mines", mines);
    mines.forEach(mine => {
      //iterate through the 9 block area with the mine at the center
      for (let i = -1; i < 2; i++){
        for (let j = -1; j < 2; j++){
          //if get the mine coordinate
          if(i === 0 && j === 0){
            console.log("case1 i", i,"j",j, "board", board);
            continue; 
          //if get coordinate outside of board (left, bottom)
          }else if ((mine.row + i) < 0 || (mine.column + j) < 0){
            console.log("case2 i", i,"j",j,"mine.row + i", mine.row + i,"mine.column + j",mine.column + j, "board", board);
            continue;
          //if get coordinate outside of board (top, right)
          } else if ((mine.row + i) >= board.length || (mine.column + j) >= board.length){
            console.log("case3 i", i,"j",j,"mine.row + i", mine.row + i,"mine.column + j",mine.column + j, "board", board);
            continue;
          //for all the ones inside the board
          } else {
            console.log("case 4 i", i,"j",j);
            let board_value = board[mine.row+i][mine.column+j].value;
            console.log("case 4 board_value", board_value);
            //if its a mine, ignore it
            if(board_value === "mine"){
              console.log("case 4a board_value mines");
              continue;
            }else if (typeof board_value === "number"){
              console.log("case 4b board_value", board_value);
              //if its a number, add one to it
              board[mine.row+i][mine.column+j].value += 1;
            }
          }
        }
      }
    });
    console.log("setNumbers", {board, mines});
    return {board, mines}
  }

  checkAround(row, column, board){
    console.log("this.checkAround");
    for (let i = -1; i < 2; i++){
      for (let j = -1; j < 2; j++){
        //if get the center coordinate
        if(i === 0 && j === 0){
          console.log("case1 i", i,"j",j, "board", board);
          continue; 
        //if get coordinate outside of board (left, bottom)
        }else if ((row + i) < 0 || (column + j) < 0){
          console.log("case2 i", i,"j",j,"row + i", row + i,"column + j",column + j, "board", board);
          continue;
        //if get coordinate outside of board (top, right)
        } else if ((row + i) >= board.length || (column + j) >= board.length){
          console.log("case3 i", i,"j",j,"row + i", row + i,"column + j",column + j, "board", board);
          continue;
        //for all the ones inside the board
        } else {
          console.log("case 4 i", i,"j",j);
          let board_square = board[row+i][column+j];
          console.log("case 4 board_square", board_square);
          //if its a mine, ignore it
          if(board_square.value === "mine"){
            console.log("case 4a board_square.value mines");
            continue;
          //if one of those has a non-zero value, then only reveal
          }else if (board_square.value > 0){
            console.log("case 4b board_square.value", board_square);
            board[row+i][column+j].reveal = true;
            
            continue;
          //if has a zero value, then check the ones around it
          }else if (board_square.value === 0 && board_square.reveal === false){
            board[row+i][column+j].reveal = true;
            board = this.checkAround(row+i, column+j, board);
          }
        }
      }
    }
    return board
  }

  handleClick( row, column, value){
    
    console.log("This one row",row, "column", column, "value", value);
    
    let gameover = false;
    let win = false;
    let { rows, columns, board, mines } = this.state;
   
    //reveal = true
    board[row][column].reveal = true;
    //if a mine, finish the game
    if (value === "mine"){
      gameover = true
    //if has a zero value, then check the ones around it
    }else if(value === 0){
      board = this.checkAround(row, column, board);
    }
    
    //count the number of square with reveal
    //if there are no more squares left (reveal squares and mines), then win!
    let reveals = this.countReveals();
    let squaresLeft = (rows*columns)-reveals-mines.length;
    if(squaresLeft === 0){ win = true }

    //if one of those has a non-zero value, then only reveal
    //finish the state
    this.setState({ board, gameover, win});

  }

  countReveals(){
    let count = 0;
    this.state.board.forEach(row => {
      row.forEach(square => {if(square.reveal === true){count += 1}});
    });
    return count
  }

  _renderBoard(){
    return this.state.board.map((row, row_index)=>{
      return(
        <div key={`row${row_index}`} style={rowStyle}>
        {row.map((square, column_index)=>(
          <Square 
          key={`button${row_index}${column_index}`}
          row={row_index} 
          column={column_index} 
          value={square.value} 
          reveal={square.reveal}
          onClick={this.handleClick}>
          </Square>))}
        </div>
      )
    });
  }

  _renderFinish(winorlose){
    alert(`${winorlose} Do you want to play another game?`);
    window.location.reload(false);
  }


  render() {
    console.log("state", this.state);
    const { header, container} = styles;

    let finish = "";
    if (this.state.gameover) {
      finish = this._renderFinish("Sorry, you lost.");
    }else if (this.state.win){
      finish = this._renderFinish("Congrats! You Won!");
    } 

    return (
      <div style={container}>
        <h1 style={header}>Minesweeper</h1>
        <div>
        {this._renderBoard()}
        </div>
        {finish}
      </div>
    )
  }
}

const rowStyle = {
  display: 'flex',
  margin: "0 auto",
  justifyContent: "center"
}

const styles = {
  container: {
   margin: "0 auto",
  },
  header: {
    color: "rgb(0, 0, 229)",
    padding: "20px"
  },
  square1: {
    color: "purple",
  },
  square2: {
    color: "blue",
  },
  square3: {
    color: "green"
  }

}