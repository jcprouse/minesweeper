import React from 'react';
import Grid,{GridItem} from './Grid';
import Row from './Row';
import {shallow} from 'enzyme'

describe('<Grid> test suite', () => {

  const x = 5;
  const y = 4;

  var defaultWrapper;
  var defaultInstance;
  var mockPropOnWin;

  beforeEach(() => {
    mockPropOnWin = jest.fn();
    defaultWrapper = shallow(<Grid x={x} y={y} onWin={mockPropOnWin}/>);
    defaultInstance = defaultWrapper.instance();
    
  });

  it('correct number of rows displayed', () => {
    expect(defaultWrapper.find(Row).length).toEqual(y)
  });

  it('correct number of items displayed per row', () => {
    expect(defaultWrapper.find(Row).first().props().items.length).toEqual(x)
  });

  it('component will generate grid items when mounted', () => {
    jest.spyOn(defaultInstance, 'generateGridItems');
    defaultInstance.componentDidMount();
    expect(defaultInstance.generateGridItems).toHaveBeenCalledWith(x*y);
  });

  it('lock grid item method will mark item in state as locked or unlocked', () => {
    var gridItems = [];
    gridItems.push(new GridItem(0))
    defaultWrapper.setState({gridItems:gridItems});

    defaultInstance.lockGridItem(0);
    expect(defaultWrapper.state().gridItems[0].lock).toEqual(true)
    defaultInstance.lockGridItem(0);
    expect(defaultWrapper.state().gridItems[0].lock).toEqual(false)
  });

  it('component will perform a "has won?" check when component updates', () => {
    jest.spyOn(defaultWrapper.instance(), 'win');
    defaultInstance.setState({remaining:0, gameOver:true});
    defaultInstance.componentDidMount();
    expect(defaultInstance.win).not.toHaveBeenCalled();

    defaultInstance.setState({remaining:2, gameOver:false});
    defaultInstance.componentDidMount();
    expect(defaultInstance.win).not.toHaveBeenCalled();

    defaultInstance.setState({remaining:0, gameOver:false});
    defaultInstance.componentDidMount();
    expect(defaultInstance.win).toHaveBeenCalled();
  });

  it('win function updates state and triggers parent win event', () => {
    const mockWin = jest.fn();
    const wrapper = shallow(<Grid onWin={mockWin}/>);
    wrapper.instance().win();
    expect(wrapper.state('gameOver')).toEqual(true)
    expect(mockWin.mock.calls.length).toEqual(1)
  });

  it('lose function updates state and triggers parent lose event', () => {
    const mockLose = jest.fn();
    const wrapper = shallow(<Grid onLose={mockLose}/>);
    wrapper.instance().lose();
    expect(wrapper.state('gameOver')).toEqual(true)
    expect(mockLose.mock.calls.length).toEqual(1)
  });

  it('generateGridItems creates a new GridItem object for each item', () => {
    defaultInstance.generateGridItems(x*y);
    expect(defaultWrapper.state().gridItems.length).toEqual(x*y);
  });

  it('generateGridItems creates 10% random mines and stores a list of IDs in state', () => {
    defaultInstance.generateGridItems(x*y);
    const mineCount = Math.ceil(x*y/10);
    expect(defaultWrapper.state().mineIds.length).toEqual(mineCount);
  });


  it('generateGridItems marks mines in GridItem array', () => {
    defaultInstance.generateGridItems(x*y);
    const mineIds = defaultWrapper.state().mineIds;
    const gridItems = defaultWrapper.state().gridItems;
    for (let i = 0; i < mineIds.length; i++){
      expect(gridItems[mineIds[i]].mine).toBeTruthy()
    }
  });

  it('generateGridItems stores a number of non-mines in state', () => {
    defaultInstance.generateGridItems(x*y);
    const mineCount = Math.ceil(x*y/10);
    expect(defaultWrapper.state().remaining).toEqual(x*y-mineCount);
  });

  it('selectGridItem does nothing is the GridItem is marked as locked', () => {
    jest.spyOn(defaultWrapper.instance(), 'calculateSurroundingItemIds');
    var gridItems = createMockGridItems(1);
    gridItems[0].lock = true;
    defaultWrapper.setState({gridItems:gridItems})
    defaultInstance.selectGridItem(0);
    expect(defaultInstance.calculateSurroundingItemIds).not.toHaveBeenCalled();
  });


  it('calculateSurroundingItemIds returns surrounding IDs', () => {
    const id = 6, maxSize=20
    var expectedResult = [id-x,id+x,id-x-1,id-1,id+x-1,id-x+1,id+1,id+x+1];
    expect(defaultInstance.calculateSurroundingItemIds(id,x*y)).toEqual(expectedResult);
  });

  it('calculateSurroundingItemIds will returns only above, below and right IDs if the current ID is on the left grid edge', () => {
    const id = x, maxSize=20
    var expectedResult = [id-x,id+x,id-x+1,id+1,id+x+1];
    expect(defaultInstance.calculateSurroundingItemIds(id,x*y)).toEqual(expectedResult);
  });

  it('calculateSurroundingItemIds will returns only above, below and left IDs if the current ID is on the right grid edge', () => {
    const id = (x * 2 - 1), maxSize=20
    var expectedResult = [id-x,id+x,id-x-1,id-1,id+x-1];
    expect(defaultInstance.calculateSurroundingItemIds(id,x*y)).toEqual(expectedResult);
  });

  it('', () => {
  });
});

function createMockGridItems(number){
  var gridItems = []
  for (let i=0; i< number; i++)
    gridItems.push(new GridItem(i));

  return gridItems;
}