import React, { Component } from 'react';
import Row from './Row'
import './Grid.css';

export class GridItem {
    constructor(id) {
        this.id = id;
        this.isMine = false;
        this.isSelected = false;
        this.value = '';
        this.isLocked = false;
    }
}

class Grid extends Component {
    constructor(props) {
        super(props);
        this.state = { gridItems: null, isGameOver: null }
    }

    componentDidMount() {
        this.generateGridItems(this.props.x * this.props.y);
    }

    componentDidUpdate() {
        if (this.state.remaining === 0 && !this.state.isGameOver)
            this.win();
    }

    generateGridItems(gridCount) {
        const gridItemCount = this.props.x * this.props.y;
        // 10% of available items will be mines
        const mineCount = Math.ceil(gridItemCount / 10);
        // Initialise array with default grid items
        const gridItems = [];
        const mineIds = [];
        for (let i = 0; i < gridItemCount; i++)
            gridItems.push(new GridItem(i));

        // Generate mine positions and mark in array
        for (let i = 0; i < mineCount; i++) {
            while (true) {
                let pos = Math.floor(Math.random() * gridItemCount);
                if (!gridItems[pos].isMine) {
                    gridItems[pos].isMine = true;
                    mineIds.push(pos);
                    break;
                }
            }
        }
        this.setState({ gridItems, mineIds: mineIds, remaining: gridItemCount - mineCount });
    }

    lockGridItem(id) {
        const gridItems = this.state.gridItems;
        gridItems[id].isLocked = !gridItems[id].isLocked;
        this.setState({ gridItems });
    }

    selectGridItem(id) {
        const gridItems = this.state.gridItems;

        if (gridItems[id].isLocked)
            return;

        if (gridItems[id].isMine) {
            this.lose();
            return;
        }

        gridItems[id].isSelected = true;

        // Set state is asynchronous - this function ensures all decrements of remaining are captured
        this.setState(function (currentState) {
            return { remaining: currentState.remaining - 1 };
        });

        const surroundingGridItemIds = this.calculateSurroundingItemIds(id);

        var numberOfMinesAround = 0;
        for (let i = 0; i < surroundingGridItemIds.length; i++) {
            if (this.state.mineIds.includes(surroundingGridItemIds[i]))
                numberOfMinesAround++;
        };

        if (numberOfMinesAround > 0) {
            gridItems[id].value = numberOfMinesAround;
            this.setState({ gridItems });
        }

        else {
            for (let a = 0; a < surroundingGridItemIds.length; a++) {
                // Remove any Ids that are smaller or bigger than the grid size, along with any already selected
                if (surroundingGridItemIds[a] >= 0 && surroundingGridItemIds[a] < (this.props.x * this.props.y) && !gridItems[surroundingGridItemIds[a]].isSelected)
                    this.selectGridItem(surroundingGridItemIds[a])
            }
        }
    }

    calculateSurroundingItemIds(id) {
        const idList = [id - this.props.x, id + this.props.x];
        // We don't want to check 'left' items if the item is on the left side of the grid,
        if (id !== 0 && id % this.props.x !== 0) {
            idList.push(id - this.props.x - 1, id - 1, id + this.props.x - 1);
        }
        // ..and vice versa
        if (id !== (this.props.x * this.props.y - 1) && (id + 1) % this.props.x !== 0) {
            idList.push(id - this.props.x + 1, id + 1, id + this.props.x + 1);
        }
        return idList;
    }

    win() {
        this.setState({ isGameOver: true });
        this.props.onWin();
    }
    lose() {
        this.setState({ isGameOver: true });
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
                {rows.map((items, i) => <Row items={items} key={i} handleClick={(id) => this.selectGridItem(id)} handleContextMenu={(id) => this.lockGridItem(id)} isGameOver={this.state.isGameOver} cheatModeOn={this.props.cheatModeOn} />)}
            </span>
        );
    };
}

export default Grid;