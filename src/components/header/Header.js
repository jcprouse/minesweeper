import React from 'react';

function Header(props){

    return (
        <span className="header">
            <p>Welcome to Minesweeper!</p>
            <span className="menu">
                <label>Width</label>
                <input id="inputX" className="input" type="number" min="1" defaultValue={props.x}/>
                <label>Height</label>
                <input id="inputY" className="input" type="number" min="1" defaultValue={props.y}/>
                <button className="button" onClick={() => props.newGame(document.getElementById("inputX").value, document.getElementById("inputY").value)}>New Game</button>
                <label>Cheat mode</label>
                <input type="checkbox" defaultChecked={props.cheatMode} onClick={() => props.setCheatMode()} />
                </span>
        </span>
    );
}

export default Header;