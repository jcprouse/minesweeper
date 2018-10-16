import React from 'react';
import Square from './Square'

function Row(props) {
    return (
        <span className="row">
            {props.items.map((item) => <Square key={item.id} item={item} handleClick={(id) => props.handleClick(id)} handleContextMenu={(id) => props.handleContextMenu(id)} gameOver={props.gameOver} cheatMode={props.cheatMode} />)}
        </span>
    );
}

export default Row;