/* global Swiper:false */

import React, { Component } from 'react';
import Bible from './bible';
import { connect } from 'react-redux';
import { prev, next, toggleCheck } from './actions';
import './MainPage.css';

class MainPage extends Component {
  constructor(props) {
    super(props);

    this.onCheck = () => {
      this.props.onToggleCheck(this.props.currentIndex);
    };
  }

  render(){
    const { currentIndex, links, checks } = this.props;

    const checked = checks[currentIndex] !== undefined;
    const citationText = Bible.getCitationText(currentIndex);
    const { bookNo, chapterNo } = Bible.getBookNoAndChapterNo(currentIndex);

    return (
      <div className="swiper-slide">
        <div id="mainPage">
          <div id="citation" className="center">
            <input id="check" type="checkbox" className="checkbox"
              checked={checked} onClick={this.onCheck}/>
            <label className="checkbox-label" htmlFor="check">{citationText}</label>
          </div>
          <div id="moveBar">
            <div id="moveBarInner">
            <a id="prev" href="#" className="move" onClick={this.props.onPrev}>&lang;</a>
            <a id="next" href="#" className="move" onClick={this.props.onNext}>&rang;</a>
            </div>
          </div>
          <ul id="links" className="center">
            { links.map((link, index) => {
              const url = link.url
                .replace('{book}', bookNo)
                .replace('{chapter}', chapterNo);

              return <li key={index}><a href={url}>{link.label}</a></li>
            }) }
          </ul>
        </div>
      </div>
    );
  }
}

const MainPageContainer = connect(
  (state) => {
    return state;
  },
  (dispatch) => {
    return {
      onPrev() { dispatch(prev()); },
      onNext() { dispatch(next()); },
      onToggleCheck(index) { dispatch(toggleCheck(index)); },
    };
  }
)(MainPage);

export default MainPageContainer;
