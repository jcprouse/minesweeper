import React from 'react';
import Square from './Square';
import { GridItem } from './Grid';
import { shallow } from 'enzyme'

describe('<Grid> shallow test suite', () => {

  it('correct default classes are rendered', () => {
    const defaultWrapper = shallow(<Square item={generateMockGridItem(true)} />);
    expect(defaultWrapper.find('div').props().className).toContain('square');
    expect(defaultWrapper.find('div').props().className).not.toContain('cheat');
    expect(defaultWrapper.find('div').props().className).not.toContain('reveal');
    expect(defaultWrapper.find('div').props().className).not.toContain('selected');
    expect(defaultWrapper.find('div').props().className).not.toContain('pin');
    expect(defaultWrapper.find('div').props().className).not.toContain('v1');
  });

  it('correct classes are rendered for cheatMode', () => {
    const defaultWrapper = shallow(<Square item={generateMockGridItem(true)} cheatModeOn={true} />);
    expect(defaultWrapper.find('div').props().className).toContain('cheat');
  });

  it('correct classes are rendered for bomb reveal', () => {
    const defaultWrapper = shallow(<Square item={generateMockGridItem(true)} isGameOver={true} />);
    expect(defaultWrapper.find('div').props().className).toContain('reveal');
  });

  it('correct classes are rendered for pinning', () => {
    const defaultWrapper = shallow(<Square item={generateMockGridItem(true, true)} />);
    expect(defaultWrapper.find('div').props().className).toContain('pin');
  });

  it('correct classes are rendered for selection', () => {
    const defaultWrapper = shallow(<Square item={generateMockGridItem(false, false, true)} />);
    expect(defaultWrapper.find('div').props().className).toContain('selected');
  });

  it('correct classes are rendered for number display', () => {
    const defaultWrapper = shallow(<Square item={generateMockGridItem(false, false, true, 1)} />);
    expect(defaultWrapper.find('div').props().className).toContain('v1');
  });

  function generateMockGridItem(mine, locked, selected, value) {
    const gridItem = new GridItem();
    gridItem.isMine = mine;
    gridItem.isLocked = locked;
    gridItem.isSelected = selected;
    gridItem.value = value;
    return gridItem;
  }
});

