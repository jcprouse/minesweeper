import React from 'react';

function Header(props) {
    const inputXref = React.createRef();
    const inputYref = React.createRef();
    return (
        <span className="header">
            <span className="title">Welcome to Minesweeper!</span>
            <span className="menu">
                <label>Width</label>
                <input id="inputX" ref={inputXref} className="input" type="number" min="1" defaultValue={props.x} />
                <label>Height</label>
                <input id="inputY" ref={inputYref} className="input" type="number" min="1" defaultValue={props.y} />
                <button className="button" onClick={() => props.newGame(inputXref.current.value, inputYref.current.value)}>New Game</button>
                <label>Cheat mode</label>
                <input className="checkbox" type="checkbox" defaultChecked={props.cheatMode} onClick={() => props.setCheatMode()} />
            </span>
        </span>
    );
}

export default Header;