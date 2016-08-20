/* global Swiper:false */

import React, { Component } from 'react';
import Bible from './bible';
import { connect } from 'react-redux';
import { prev, next, check } from './actions';
import './MainPage.css';

class MainPage extends Component {
  constructor(props) {
    super(props);

    this.onCheck = () => {
      const checked = document.getElementById('check').checked;
      this.props.onCheck(checked);
    };
  }

  render(){
    const { chapterIndex, links, checks } = this.props.state;

    const checked = checks[chapterIndex] !== undefined;
    const citationText = Bible.getCitationTex(chapterIndex);
    const { bookNo, chapterNo } = Bible.getBookNoAndChapterNo(chapterIndex);

    return (
      <div className="swiper-slide">
        <div id="citation" className="center">
          <input id="check" type="checkbox" className="checkbox" checked={checked} onClick={this.onCheck}/>
          <label className="checkbox-label" htmlFor="check">{citationText}</label>
        </div>
        <button id="prev" className="move side" onClick={this.props.onPrev}>&lang;</button>
        <button id="next" className="move side" onClick={this.props.onNext}>&rang;</button>
        <ul id="links" className="center">
          { links.map((link, index) => {
            const url = link.url
              .replace('{book}', bookNo)
              .replace('{chapter}', chapterNo);

            return <li key={index}><a href={url}>{link.label}</a></li>
          }) }
        </ul>
      </div>
    );
  }
}

const MainPageContainer = connect(
  (state) => {
    return {
      state
    };
  },
  (dispatch) => {
    return {
      onPrev() { dispatch(prev()); },
      onNext() { dispatch(next()); },
      onCheck(checked) { dispatch(check(checked)); },
    };
  }
)(MainPage);

export default MainPageContainer;
