import React from 'react';

function Square(props) {
    const cheatMode = props.item.mine && props.cheatMode ? 'cheat' : '';
    const mineReveal = props.item.mine && props.gameOver ? 'reveal' : '';
    const selected = props.item.selected ? 'selected' : '';
    const pin = props.item.lock && !props.item.selected ? 'pin' : '';
    const classes = `${cheatMode} ${selected} square v${props.item.value} ${mineReveal} ${pin}`
    const contents = props.item.value ? props.item.value : '\xa0';

    return (
        <div className={classes} onClick={() =>
            !props.item.selected && !props.gameOver && !props.item.lock ?
                props.handleClick(props.item.id) :
                false
        }
            onContextMenu={(e) => { props.handleContextMenu(props.item.id); e.preventDefault() }}>
            {contents}
        </div>
    );
}
export default Square;