import React/*, { Component }*/ from 'react';

/*class Square extends Component {


    render() {
        const mine = this.props.item.mine ? 'mine' : '';
        const selected = this.props.item.selected ? 'selected' : '';
        const classes = `${mine} ${selected} square`
        return (
            <div className={classes} onClick={()=>
                this.props.item.selected === false ? 
                this.props.handleClick(this.props.item.id) :
                false
            }>{this.props.item.value}</div>
        );
    };
}*/


/*const Square = (props) => {*/
function Square(props){
    const mine = props.item.mine ? 'mine' : '';
    const selected = props.item.selected ? 'selected' : '';
    const classes = `${mine} ${selected} square ${props.item.id}`
    return (
        <div className={classes} onClick={()=>
            !props.item.selected && !props.gameOver ? 
            props.handleClick(props.item.id) :
            false
        }>
            
            {props.gameOver && props.item.mine ? 
            <i className="fa fa-bomb icon"></i> : 
                (props.item.value ? 
                props.item.value : 
                '\xa0')
            }
            
        </div>
    );
}


export default Square;
