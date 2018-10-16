import React from 'react';
import Grid, { GridItem } from './Grid';
import Row from './Row';
import { shallow, mount } from 'enzyme'

describe('<Grid> shallow test suite', () => {

  const x = 5;
  const y = 4;

  var defaultWrapper;
  var defaultInstance;
  var mockPropOnWin;
  var mockPropOnLose;

  beforeEach(() => {
    mockPropOnWin = jest.fn();
    mockPropOnLose = jest.fn();
    defaultWrapper = shallow(<Grid x={x} y={y} onWin={mockPropOnWin} onLose={mockPropOnLose} />);
    defaultInstance = defaultWrapper.instance();

  });

  it('correct number of rows displayed', () => {
    expect(defaultWrapper.find(Row).length).toEqual(y)
  });

  it('correct number of items displayed per row', () => {
    expect(defaultWrapper.find(Row).first().props().items.length).toEqual(x)
  });

  it('correct item props are provided into Row component', () => {
    const gridItems = createMockGridItems(x * y);
    gridItems[3].mine = true;
    gridItems[1].selected = true;
    gridItems[0].lock = true;
    defaultWrapper.setState({ gridItems: gridItems });
    defaultWrapper.render();

    const rowProps = defaultWrapper.find(Row).first().props();
    for (let i = 0; i < x; i++) {
      expect(rowProps.items[i]).toEqual(gridItems[i]);
    }
    expect(rowProps.cheatMode).toBeFalsy();;

  });

  it('component will generate grid items when mounted', () => {
    jest.spyOn(defaultInstance, 'generateGridItems');
    defaultInstance.componentDidMount();
    expect(defaultInstance.generateGridItems).toHaveBeenCalledWith(x * y);
  });

  it('cheat mode is passed to child components', () => {
    const cheatMode = "cheats are on!"
    const wrapper = shallow(<Grid x={2} y={2} cheatMode={cheatMode} />);
    expect(wrapper.find(Row).first().props().cheatMode).toEqual(cheatMode);
  });

  it('lock grid item method will mark item in state as locked or unlocked', () => {
    defaultWrapper.setState({ gridItems: createMockGridItems(1) });

    defaultInstance.lockGridItem(0);
    expect(defaultWrapper.state().gridItems[0].lock).toEqual(true)
    defaultInstance.lockGridItem(0);
    expect(defaultWrapper.state().gridItems[0].lock).toEqual(false)
  });

  it('component will perform a "has won?" check when component updates', () => {
    jest.spyOn(defaultWrapper.instance(), 'win');
    defaultInstance.setState({ remaining: 0, gameOver: true });
    defaultInstance.componentDidMount();
    expect(defaultInstance.win).not.toHaveBeenCalled();

    defaultInstance.setState({ remaining: 2, gameOver: false });
    defaultInstance.componentDidMount();
    expect(defaultInstance.win).not.toHaveBeenCalled();

    defaultInstance.setState({ remaining: 0, gameOver: false });
    defaultInstance.componentDidMount();
    expect(defaultInstance.win).toHaveBeenCalled();
  });

  it('win function updates state and triggers parent win event', () => {
    defaultInstance.win();
    expect(defaultWrapper.state('gameOver')).toEqual(true)
    expect(mockPropOnWin.mock.calls.length).toEqual(1)
  });

  it('lose function updates state and triggers parent lose event', () => {
    defaultInstance.lose();
    expect(defaultWrapper.state('gameOver')).toEqual(true)
    expect(mockPropOnLose.mock.calls.length).toEqual(1)
  });

  it('generateGridItems creates a new GridItem object for each item', () => {
    defaultInstance.generateGridItems(x * y);
    expect(defaultWrapper.state().gridItems.length).toEqual(x * y);
  });

  it('generateGridItems creates 10% random mines and stores a list of IDs in state', () => {
    defaultInstance.generateGridItems(x * y);
    const mineCount = Math.ceil(x * y / 10);
    expect(defaultWrapper.state().mineIds.length).toEqual(mineCount);
  });


  it('generateGridItems marks mines in GridItem array', () => {
    defaultInstance.generateGridItems(x * y);
    const mineIds = defaultWrapper.state().mineIds;
    const gridItems = defaultWrapper.state().gridItems;
    for (let i = 0; i < mineIds.length; i++) {
      expect(gridItems[mineIds[i]].mine).toBeTruthy()
    }
  });

  it('generateGridItems stores a number of non-mines in state', () => {
    defaultInstance.generateGridItems(x * y);
    const mineCount = Math.ceil(x * y / 10);
    expect(defaultWrapper.state().remaining).toEqual(x * y - mineCount);
  });

  it('calculateSurroundingItemIds returns surrounding IDs', () => {
    const id = 6, maxSize = 20
    var expectedResult = [id - x, id + x, id - x - 1, id - 1, id + x - 1, id - x + 1, id + 1, id + x + 1];
    expect(defaultInstance.calculateSurroundingItemIds(id, x * y)).toEqual(expectedResult);
  });

  it('calculateSurroundingItemIds will returns only above, below and right IDs if the current ID is on the left grid edge', () => {
    const id = x, maxSize = 20
    var expectedResult = [id - x, id + x, id - x + 1, id + 1, id + x + 1];
    expect(defaultInstance.calculateSurroundingItemIds(id, x * y)).toEqual(expectedResult);
  });

  it('calculateSurroundingItemIds will returns only above, below and left IDs if the current ID is on the right grid edge', () => {
    const id = (x * 2 - 1), maxSize = 20
    var expectedResult = [id - x, id + x, id - x - 1, id - 1, id + x - 1];
    expect(defaultInstance.calculateSurroundingItemIds(id, x * y)).toEqual(expectedResult);
  });

  it('selectGridItem does nothing is the GridItem is marked as locked', () => {
    jest.spyOn(defaultInstance, 'calculateSurroundingItemIds');
    var gridItems = createMockGridItems(1);
    gridItems[0].lock = true;
    defaultWrapper.setState({ gridItems: gridItems })
    defaultInstance.selectGridItem(0);
    expect(defaultInstance.calculateSurroundingItemIds).not.toHaveBeenCalled();
  });

  it('selectGridItem triggers lose function if the selected item is a mine', () => {
    jest.spyOn(defaultInstance, 'lose');
    var gridItems = createMockGridItems(1);
    gridItems[0].mine = true;
    defaultWrapper.setState({ gridItems: gridItems })
    defaultInstance.selectGridItem(0);
    expect(defaultInstance.lose).toHaveBeenCalled();
  });

  it('selectGridItem decrements remaining number of non-mines', () => {
    defaultWrapper.setState({ gridItems: createMockGridItems(x * y), remaining: x * y, mineIds: [] });
    defaultInstance.selectGridItem(6);
    expect(defaultWrapper.state().remaining).toEqual(0);
  });

  it('selectGridItem calculates and saves number of mines in the perimeter', () => {
    // Near, near and not near
    const mineIds = [0, x + 1, x + 2]
    defaultWrapper.setState({ mineIds: mineIds });
    defaultInstance.selectGridItem(x);
    expect(defaultWrapper.state().gridItems[x].value).toEqual(2);
  });

  it('if no mines are around, selectGridItem will nest calls simulating each item around it', () => {
    jest.spyOn(defaultInstance, 'selectGridItem');

    const gridItems = createMockGridItems(x * y)
    // We'll set the bottom 2 corner elements to have a mine.
    gridItems[x * y - 1].mine = true;
    gridItems[x * y - x - 1].mine = true;
    defaultWrapper.setState({ gridItems: gridItems, mineIds: [x * y - 1, x * y - x - 1] });

    // Clicking the top left corner should reveal all tiles other than the mines
    defaultInstance.selectGridItem(0);
    expect(defaultInstance.selectGridItem).toHaveBeenCalledTimes(x * y - 2);
  });

  it('selectGridItem will not nest calls for ids less than 0 or greater than grid size', () => {
    //create a 2x2 grid
    const wrapper = shallow(<Grid x={2} y={2} onWin={jest.fn()} />);
    wrapper.setState({ gridItems: createMockGridItems(4), mineIds: [] });
    jest.spyOn(wrapper.instance(), 'selectGridItem');

    // Clicking the top left corner should reveal all tiles other than the mines
    wrapper.instance().selectGridItem(0);
    expect(wrapper.instance().selectGridItem).toHaveBeenCalledTimes(4);
    expect(wrapper.instance().selectGridItem).toHaveBeenCalledWith(0);
    expect(wrapper.instance().selectGridItem).toHaveBeenCalledWith(1);
    expect(wrapper.instance().selectGridItem).toHaveBeenCalledWith(2);
    expect(wrapper.instance().selectGridItem).toHaveBeenCalledWith(3);
  });

});

describe('<Grid> mount test suite', () => {
  const x = 3;
  const y = 3;

  var defaultWrapper;
  var defaultInstance;
  var mockPropOnWin;
  var mockPropOnLose;

  beforeEach(() => {
    mockPropOnWin = jest.fn();
    mockPropOnLose = jest.fn();
    defaultWrapper = mount(<Grid x={x} y={y} onWin={mockPropOnWin} onLose={mockPropOnLose} />);
    defaultInstance = defaultWrapper.instance();
  });

  it('clicking a square triggers selectGridItem', () => {
    jest.spyOn(defaultInstance, 'selectGridItem');
    defaultWrapper.find('.square').first().simulate('click');
    expect(defaultInstance.selectGridItem).toHaveBeenCalledWith(0);
  });

  it('right clicking a square triggers lockGridItem', () => {
    jest.spyOn(defaultInstance, 'lockGridItem');
    defaultWrapper.find('.square').first().simulate('contextMenu');
    expect(defaultInstance.lockGridItem).toHaveBeenCalledWith(0);
  });

  it('selecting a non-mine square with no mines around, reveals all nearby squares', () => {
    const gridItemsInput = createMockGridItems(x * y);
    // Bottom right will be a mine
    gridItemsInput[x * y - 1].mine = true;
    defaultWrapper.setState({ gridItems: gridItemsInput, mineIds: [x * y - 1], remaining: 1 });

    // Select top-left square
    defaultWrapper.find('.square').first().simulate('click');

    const gridItemsOutput = defaultWrapper.state().gridItems;
    for (let i = 0; i < gridItemsOutput.length; i++) {
      // The mine
      if (i === (x * y - 1)) {
        expect(gridItemsOutput[i].selected).toBeFalsy();
        expect(gridItemsOutput[i].value).toEqual('');
      }
      // Squares around mine. Left, top left and top
      else if ([x * y - 2, x * y - x - 2, x * y - x - 1].includes(i)) {
        expect(gridItemsOutput[i].selected).toBeTruthy();
        expect(gridItemsOutput[i].value).toEqual(1);
      }

      else {
        expect(gridItemsOutput[i].selected).toBeTruthy();
        expect(gridItemsOutput[i].value).toEqual('');
      }
    }
  });

});

function createMockGridItems(number) {
  var gridItems = []
  for (let i = 0; i < number; i++)
    gridItems.push(new GridItem(i));

  return gridItems;
}