/* global Swiper:false */

import React, { Component } from 'react';
import MainPage from './MainPage';
import TablePage from './TablePage';
import './App.css';

class App extends Component {
  componentDidMount() {
    this.swiper = new Swiper('.swiper-container', {
      pagination: '.swiper-pagination',
      paginationClickable: true
    });
  }

  render() {
    return (
      <div className="App">
        <div className="swiper-container">
          <div className="swiper-wrapper">
            <TablePage />
            <MainPage />
          </div>
          <div className="swiper-pagination"></div>
        </div>
      </div>
    );
  }
}

export default App;
