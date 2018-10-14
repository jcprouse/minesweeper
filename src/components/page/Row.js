import React from 'react';
import Square from './Square'

function Row (props) {

    return (
        <span className="row">
        {props.items.map((item) => <Square key={item.id} item={item} handleClick={(id)=>props.handleClick(id)} gameOver={props.gameOver}/>)}
        </span>
    );

}

export default Row;