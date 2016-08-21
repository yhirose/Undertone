/* global Swiper:false */

import React, { Component } from 'react';
import Bible from './bible';
import { connect } from 'react-redux';
import { toggleCheck, setIndex } from './actions';
import './TablePage.css';

class Cell extends Component {
  constructor(props) {
    super(props);

    this.onClick = (event) => {
      props.onClickChapter(event.nativeEvent, props.index, props.book, props.chapter);
    };
  }

  render(){
    const { book, chapter, current, checked, } = this.props;

    let className = 'cell';
    let text = '';

    if (chapter === 1) {
      className += ' firstChapter';
      text = Bible.getBookName(book);
    } else {
      text = chapter.toString();
    }

    if (checked) {
      className += ' done';
    }

    if (current) {
      className += ' current';
    }

    return (
      <li className={className} onClick={this.onClick}>{text}</li>
    );
  }
}

class TablePage extends Component {
  constructor(props) {
    super(props);

    this.onClickChapter = (event, index, book, chapter) => {
      this.index = index;

      const toolbar = this.refs.toolbar;
      const toolbarButtons = this.refs.toolbarButtons;

      toolbar.style.display = 'block';

      let y = event.clientY;
      toolbarButtons.style.top = y + 'px';

      let x = event.clientX;
      if (x < 48) {
        x = 64;
      }
      if (x > toolbar.clientWidth - 48) {
        x = toolbar.clientWidth - 64;
      }
      toolbarButtons.style.left = x + 'px';

      toolbarButtons.style.transform = 'translate(-50%, -50%)';
    };

    this.closeToolbar = () => {
      this.refs.toolbar.style.display = 'none';
    };

    this.onToggleCheck = () => {
      this.props.onToggleCheck(this.index);
    };

    this.onSetIndex = () => {
      this.props.onSetIndex(this.index);
    };
  }

  iota(count) {
    return [...Array(count).keys()];
  }

  render(){
    const { currentIndex, checks } = this.props.state;
    let index = 0;

    return (
      <div className="swiper-slide">
        <div className="cellsSection">
            <ul className="cells">
            { this.iota(Bible.getBookCount()).map((bookIndex) => {
              const book = bookIndex + 1;
              return this.iota(Bible.getChapterCount(book)).map((chapterIndex) => {
                const chapter = chapterIndex + 1;

                const key = `${book}_${chapter}`;
                const current = index === currentIndex;
                const checked = checks[index] !== undefined;

                const result =
                  <Cell key={key} index={index} book={book} chapter={chapter}
                    current={current} checked={checked}
                    onClickChapter={this.onClickChapter}/>;

                index += 1;

                return result;
              });
            }) }
            </ul>
        </div>
        <div ref="toolbar" className="toolbar" onClick={this.closeToolbar}>
          <span ref="toolbarButtons" className="toolbarButtons">
            <a href="#" onClick={this.onToggleCheck}>&#x2713;</a>
            <a href="#" onClick={this.onSetIndex}>&#x279F;</a>
          </span>
        </div>
      </div>
    );
  }
}

const TablePageContainer = connect(
  (state) => {
    return {
      state
    };
  },
  (dispatch) => {
    return {
      onToggleCheck(index) { dispatch(toggleCheck(index)); },
      onSetIndex(index) { dispatch(setIndex(index)); },
    };
  }
)(TablePage);

export default TablePageContainer;
