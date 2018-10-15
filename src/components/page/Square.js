import React from 'react';

function Square(props){
    const mine = props.item.mine && props.cheatMode ? 'mine' : '';
    const selected = props.item.selected ? 'selected' : '';
    const classes = `${mine} ${selected} square v${props.item.value} `

    var contents;
    if (props.gameOver && props.item.mine) contents=<i className="fa fa-bomb icon"></i>
    else if (props.item.lock) contents=<i className="fa fa-map-pin icon"></i>
    else contents = props.item.value ? props.item.value : '\xa0';

    return (
        <div className={classes} onClick={()=>
            !props.item.selected && !props.gameOver && !props.item.lock ? 
            props.handleClick(props.item.id) :
            false
        }
        onContextMenu={(e) => 
            {props.handleContextMenu(props.item.id);e.preventDefault()}}>
            {contents}
        
        </div>
    );
}
export default Square;