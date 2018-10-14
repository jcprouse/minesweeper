import React from 'react';

function Header(props){

    return (
        <React.Fragment>
            <p>Welcome to Minesweeper!</p>
            <label>Width</label>
            <input id="inputX" type="number" min="1" defaultValue={props.x}/>
            <label>Height</label>
            <input id="inputY" type="number" min="1" defaultValue={props.y}/>
            <button onClick={() => props.newGame(document.getElementById("inputX").value, document.getElementById("inputY").value)}>New Game</button>
        </React.Fragment>
    );
}


export default Header;