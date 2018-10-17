import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme'
import Header from './components/header/Header';
import Grid from './components/page/Grid';
import Footer from './components/footer/Footer';
import App from './App';


describe('<App> shallow test suite', () => {

  var defaultWrapper;
  var defaultInstance;

  beforeEach(() => {
    defaultWrapper = shallow(<App />);
    defaultInstance = defaultWrapper.instance();
  });


  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('header, page and footer components are rendered', () => {
    expect(defaultWrapper.find(Header).length).toEqual(1);
    expect(defaultWrapper.find(Grid).length).toEqual(1);
    expect(defaultWrapper.find(Footer).length).toEqual(1);
  });

  it('Grid component is supplied correct properties', () => {
    const gridProps = defaultWrapper.find(Grid).props();

    expect(gridProps.x).toEqual(defaultWrapper.state().gridX);
    expect(gridProps.y).toEqual(defaultWrapper.state().gridY);
    expect(gridProps.cheatModeOn).toEqual(defaultWrapper.state().cheatModeOn);
  });

  it('setCheatMode method will mark cheats as on and off', () => {
    defaultWrapper.setState({ cheatModeOn: false });

    defaultInstance.setCheatMode();
    expect(defaultWrapper.state().cheatModeOn).toEqual(true)
    defaultInstance.setCheatMode();
    expect(defaultWrapper.state().cheatModeOn).toEqual(false)
  });

  it('onWin method updates state', () => {
    defaultInstance.onWin()
    expect(defaultWrapper.state().winner).toEqual(true);
  });

  it('onLose method updates state', () => {
    defaultInstance.onLose()
    expect(defaultWrapper.state().lose).toEqual(true);
  });

  it('newGame method increments game number', () => {
    defaultInstance.newGame()
    expect(defaultWrapper.state().gameNo).toEqual(2);
  });


});

