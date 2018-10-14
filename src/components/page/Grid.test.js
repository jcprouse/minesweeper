import React from 'react';
import Grid from './Grid';
import Row from './Row';
import {shallow} from 'enzyme'

describe('<Grid> test suite', () => {
  it('correct number of rows displayed', () => {
    const wrapper = shallow(<Grid y={4}/>);
    expect(wrapper.find(Row).length).toEqual(4)
  });
});