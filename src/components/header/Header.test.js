import React from 'react';
import Header from './Header';
import { shallow, mount } from 'enzyme'

describe('<Header> shallow test suite', () => {
  it('x and y values are displayed in input boxes', () => {
    const x = 3;
    const y = 4;
    const defaultWrapper = shallow(<Header x={x} y={y} newGame={jest.fn()} />);
    expect(defaultWrapper.find('#inputX').props().defaultValue).toEqual(x);
    expect(defaultWrapper.find('#inputY').props().defaultValue).toEqual(y);
  });
});

describe('<Header> mount test suite', () => {
  it('clicking new game triggers parent event', () => {
    const x = 3;
    const y = 4;
    const mockPropNewGame = jest.fn();
    const defaultWrapper = mount(<Header x={x} y={y} newGame={mockPropNewGame} />);
    defaultWrapper.find('button').simulate('click');
    expect(mockPropNewGame.mock.calls.length).toEqual(1);
    expect(mockPropNewGame.mock.calls[0][0]).toEqual(x.toString());
    expect(mockPropNewGame.mock.calls[0][1]).toEqual(y.toString());
  });
});


