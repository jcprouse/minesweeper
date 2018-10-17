import React, { Component } from 'react';
import Header from './components/header/Header';
import Grid from './components/page/Grid';
import Footer from './components/footer/Footer';

class App extends Component {
  constructor() {
    super()
    this.state = {
      gridX: 20,
      gridY: 10,
      gameNo: 1,
      winner: null,
      lose: null,
      cheatModeOn: false
    }
  }

  newGame(x, y) {
    this.setState({ gridX: parseInt(x), gridY: parseInt(y), gameNo: (this.state.gameNo + 1), winner: null, lose: null });
  }

  setCheatMode() {
    this.setState({ cheatModeOn: !this.state.cheatModeOn });
  }
  onWin() {
    this.setState({ winner: true })
  }

  onLose() {
    this.setState({ lose: true })
  }

  render() {
    return (
      <div className="App">
        <Header x={this.state.gridX} y={this.state.gridY} newGame={(x, y) => this.newGame(x, y)} cheatModeOn={this.state.cheatModeOn} setCheatMode={() => this.setCheatMode()} />
        <Grid key={this.state.gameNo} x={this.state.gridX} y={this.state.gridY} onWin={() => this.onWin()} onLose={() => this.onLose()} cheatModeOn={this.state.cheatModeOn} />
        <Footer winner={this.state.winner} lose={this.state.lose} />
      </div>
    );
  }
}

export default App;