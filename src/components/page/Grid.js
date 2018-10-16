import React, { Component } from 'react';
import Row from './Row'
import './Grid.css';

export class GridItem {
    constructor(id) {
        this.id = id;
        this.mine = false;
        this.selected = false;
        this.value = '';
        this.lock = false;
    }
}

class Grid extends Component {
    constructor(props) {
        super(props);
        this.state = { gridItems: null, gameOver: null }
    }

    componentDidMount() {
        this.generateGridItems(this.props.x * this.props.y);
    }

    componentDidUpdate() {
        if (this.state.remaining === 0 && !this.state.gameOver)
            this.win();
    }

    generateGridItems(gridCount) {
        // 10% of available items will be mines
        const mineCount = Math.ceil(gridCount / 10);
        // Initialise array with default grid items
        const gridItems = [];
        const mineIds = [];
        for (let i = 0; i < gridCount; i++)
            gridItems.push(new GridItem(i));

        // Generate mine positions and mark in array
        for (let i = 0; i < mineCount; i++) {
            while (true) {
                let pos = Math.floor(Math.random() * gridCount);
                if (!gridItems[pos].mine) {
                    gridItems[pos].mine = true;
                    mineIds.push(pos);
                    break;
                }
            }
        }
        this.setState({ gridItems: gridItems, mineIds: mineIds, remaining: gridCount - mineCount });
    }

    lockGridItem(id) {
        const gridItems = this.state.gridItems;
        gridItems[id].lock = !gridItems[id].lock;
        this.setState({ gridItems: gridItems });
    }

    selectGridItem(id) {
        const gridItems = this.state.gridItems;

        if (gridItems[id].lock)
            return;

        if (gridItems[id].mine) {
            this.lose();
            return;
        }

        gridItems[id].selected = true;

        // Set state is asynchronous - this function ensures all decrements of remaining are captured
        this.setState(function (currentState) {
            return { remaining: currentState.remaining - 1 };
        });

        // We're going to work out the ids of valid surrounding elements
        const toCheck = this.calculateSurroundingItemIds(id, gridItems.length);

        var gridItemValue = 0;
        for (let i = 0; i < toCheck.length; i++) {
            if (this.state.mineIds.includes(toCheck[i]))
                gridItemValue++;
        };

        // If we've got at least one mine around, that's enough
        if (gridItemValue > 0) {
            gridItems[id].value = gridItemValue;
            this.setState({ gridItems: gridItems });
        }
        // Otherwise we'll need to perform a 'select' action on squares on the perimeter
        else {
            for (let a = 0; a < toCheck.length; a++) {
                // Remove any Ids that are smaller or bigger than the grid size, along with any already selected
                if (toCheck[a] >= 0 && toCheck[a] < (this.props.x * this.props.y) && !gridItems[toCheck[a]].selected)
                    this.selectGridItem(toCheck[a])
            }
        }
    }

    calculateSurroundingItemIds(id, maxGridSize) {
        const idList = [id - this.props.x, id + this.props.x];
        // We don't want to check 'left' items if the item is on the left side of the grid,
        if (id !== 0 && id % this.props.x !== 0) {
            idList.push(id - this.props.x - 1, id - 1, id + this.props.x - 1);
        }
        // ..and vice versa
        if (id !== (maxGridSize - 1) && (id + 1) % this.props.x !== 0) {
            idList.push(id - this.props.x + 1, id + 1, id + this.props.x + 1);
        }
        return idList;
    }

    win() {
        this.setState({ gameOver: true });
        this.props.onWin();
    }
    lose() {
        this.setState({ gameOver: true });
        this.props.onLose();
    }

    render() {
        const rows = [];
        var i = 0;

        while (i < this.props.y && this.state.gridItems) {
            let xIndex = this.props.x * i;
            rows.push(this.state.gridItems.slice(xIndex, xIndex + this.props.x));
            i++;
        }
        return (
            <span>
                {rows.map((items, i) => <Row items={items} key={i} handleClick={(id) => this.selectGridItem(id)} handleContextMenu={(id) => this.lockGridItem(id)} gameOver={this.state.gameOver} cheatMode={this.props.cheatMode} />)}
            </span>
        );
    };
}

export default Grid;