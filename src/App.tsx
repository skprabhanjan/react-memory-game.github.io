import React, { Component } from 'react';
import './App.css';
import CardLayout from './CardLayout';

class App extends Component {
  constructor(props: any) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="app">
        <CardLayout />
      </div>
    );
  }
}

export default App;
