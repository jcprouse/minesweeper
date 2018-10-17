import React from 'react';
import Square from './Square'

const Row = ({items, handleClick, handleContextMenu, isGameOver, cheatModeOn}) => (
    <span className="row">
        {items.map((item) => <Square key={item.id} item={item} handleClick={(id) => handleClick(id)} handleContextMenu={(id) => handleContextMenu(id)} isGameOver={isGameOver} cheatModeOn={cheatModeOn} />)}
    </span>
);

export default Row;