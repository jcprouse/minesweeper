import React, { Component } from 'react';
import Row from './Row'
import './Grid.css';

class GridItem{
    constructor(id){
        this.id = id;
        this.mine = false;
        this.selected = false;
        this.value = '';
    }
}

class Grid extends Component {
    constructor(props) {
        super(props);
        console.log("Grid constructor x:"+this.props.x+" y:"+this.props.y)
        this.state={
            gridItems: null,
            gameOver: null
        }
        
    }
    
    componentDidMount(){
        this.generateGridItems(this.props.x*this.props.y);
    }

    componentDidUpdate(prevProps){
        this.checkStatus();
    }

    generateGridItems(gridCount/*gridX, gridY*/){
        // 10% of available items will be mines
        let mineCount = Math.ceil(gridCount/10);
        // Initialise array with default grid items
        var gridItems = [];
        var mineIds = [];
        for (var i=0;i<gridCount;i++)
            gridItems.push(new GridItem(i));
        
        // Generate mine positions and mark in array
        for (let i=0; i<mineCount; i++){
            while (true) {
                let pos = Math.floor(Math.random() * gridCount);
                if (!gridItems[pos].mine){
                    gridItems[pos].mine = true;
                    mineIds.push(pos);
                    break;
                }
            }
        }
        /*console.log(gridItems);
        console.log(mineIds);
        console.log(gridCount-mineCount);*/
        this.setState({gridItems:gridItems, mineIds:mineIds, remaining: gridCount-mineCount});
    }

    checkStatus(){
        if (this.state.remaining === 0 && !this.state.gameOver)
            this.win();
    }

    selectGridItem(id){
        const gridItems = this.state.gridItems;
        
        if (gridItems[id].mine){
            this.lose();
            return;
        }
        
        gridItems[id].selected = true;

       // console.log(this.state.remaining)
//        var remaining = this.state.remaining;
        this.setState(function(currentState) {
            return { remaining: currentState.remaining - 1 };
          });

       /* let remaining = this.state.remaining;
        remaining = --remaining;
        this.setState({remaining:remaining})*/
      //  console.log(this.state.remaining)

        /*var remaining = this.state.remaining;
        remaining = --remaining;
        console.log(remaining);*/



        // We're going to get all ids of surrounding elements
        var toCheck = [id-this.props.x, id+this.props.x];
        // We don't want to check 'right' items if the item is on the left side of the grid,
        if (id !== 0 && id % this.props.x !== 0) {
            toCheck.push(id-this.props.x-1, id-1, id+this.props.x-1);
        }
        // ..and vice versa
        if (id !== (gridItems.length-1) && (id+1) % this.props.x !== 0) {
            console.log('not on the right')
            toCheck.push(id-this.props.x+1, id+1, id+this.props.x+1);
        }

        let gridItemValue = 0;
        for (var i=0;i<toCheck.length;i++){
            if (this.state.mineIds.includes(toCheck[i]))
                gridItemValue++;
        };

        // If we've got at least one mine around, that's enough
        if (gridItemValue > 0) {
            gridItems[id].value = gridItemValue;
            this.setState({gridItems:gridItems}); 
            //console.log(remaining)
            /*if (this.state.remaining === 0){
                this.winner();
            }*/
        }
        else {
            for (i=0;i<toCheck.length;i++){
                // Remove any Ids that are smaller or bigger than the grid size, along with any already selected
                if (toCheck[i] >= 0 && toCheck[i] < (this.props.x*this.props.y) && !gridItems[toCheck[i]].selected) 
                    this.selectGridItem(toCheck[i])
            }
        }          
    }

    win(){
        this.setState({gameOver:true});
        this.props.onWin();
    }
    lose(){
        this.setState({gameOver:true});
        this.props.onLose();
    }
    
    render() {
        var rows = [], i = 0;
        
        while (i < this.props.y && this.state.gridItems) {
            let xIndex = this.props.x * i;
            rows.push(this.state.gridItems.slice(xIndex,xIndex+this.props.x));
            i++;
        }
        console.log(rows);
        return (
            <span>
                {rows.map((items, i) => <Row items={items} key={i} handleClick={(id) => this.selectGridItem(id)} gameOver={this.state.gameOver}/>)}
            </span>
        );
    };
}

export default Grid;