import React from 'react';

function Square(props) {
    const cheatMode = props.item.isMine && props.cheatModeOn ? 'cheat' : '';
    const mineReveal = props.item.isMine && props.isGameOver ? 'reveal' : '';
    const selected = props.item.isSelected ? 'selected' : '';
    const pin = props.item.isLocked && !props.item.isSelected ? 'pin' : '';
    const classes = `${cheatMode} ${selected} square v${props.item.value} ${mineReveal} ${pin}`
    const contents = props.item.value ? props.item.value : '\xa0';

    return (
        <div className={classes} onClick={() =>
            !props.item.selected && !props.isGameOver && !props.item.isLocked ?
                props.handleClick(props.item.id) :
                false
        }
            onContextMenu={(e) => { props.handleContextMenu(props.item.id); e.preventDefault() }}>
            {contents}
        </div>
    );
}
export default Square;