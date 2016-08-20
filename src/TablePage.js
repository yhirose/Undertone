/* global Swiper:false */

import React, { Component } from 'react';
import Bible from './bible';
import { connect } from 'react-redux';
import './TablePage.css';

class Cell extends Component {
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
      <li className={className} data-book={book} data-chapter={chapter}>{text}</li>
    );
  }
}

class TablePage extends Component {
  // constructor(props) {
  //   super(props);
  // }

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

                index += 1;

                return (
                  <Cell key={key} book={book} chapter={chapter}
                    current={current} checked={checked} />
                );
              });
            }) }
            </ul>
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
    };
  }
)(TablePage);

export default TablePageContainer;
