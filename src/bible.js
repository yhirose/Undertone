
const db = [
  { name: 'Ge', count: 50 },
  { name: 'Ex', count: 40 },
  { name: 'Le', count: 27 },
  { name: 'Nu', count: 36 },
  { name: 'De', count: 34 },
  { name: 'Jos', count: 24 },
  { name: 'Jg', count: 21 },
  { name: 'Ru', count: 4 },
  { name: '1Sa', count: 31 },
  { name: '2Sa', count: 24 },
  { name: '1Ki', count: 22 },
  { name: '2Ki', count: 25 },
  { name: '1Ch', count: 29 },
  { name: '2Ch', count: 36 },
  { name: 'Ezr', count: 10 },
  { name: 'Ne', count: 13 },
  { name: 'Es', count: 10 },
  { name: '', count: 42 },
  { name: 'Ps', count: 150 },
  { name: 'Pr', count: 31 },
  { name: 'Ec', count: 12 },
  { name: 'Ca', count: 8 },
  { name: 'Isa', count: 66 },
  { name: 'Jer', count: 52 },
  { name: 'La', count: 5 },
  { name: 'Eze', count: 48 },
  { name: 'Da', count: 12 },
  { name: 'Ho', count: 14 },
  { name: 'Joe', count: 3 },
  { name: 'Am', count: 9 },
  { name: 'Ob', count: 1 },
  { name: 'Jon', count: 4 },
  { name: 'Mic', count: 7 },
  { name: 'Na', count: 3 },
  { name: 'Hab', count: 3 },
  { name: 'Zep', count: 3 },
  { name: 'Hag', count: 2 },
  { name: 'Zec', count: 14 },
  { name: 'Mal', count: 4 },
  { name: 'Mt', count: 28 },
  { name: 'Mr', count: 16 },
  { name: 'Lu', count: 24 },
  { name: 'Joh', count: 21 },
  { name: 'Ac', count: 28 },
  { name: 'Ro', count: 16 },
  { name: '1Co', count: 16 },
  { name: '2Co', count: 13 },
  { name: 'Ga', count: 6 },
  { name: 'Eph', count: 6 },
  { name: 'Php', count: 4 },
  { name: 'Col', count: 4 },
  { name: '1Th', count: 5 },
  { name: '2Th', count: 3 },
  { name: '1Ti', count: 6 },
  { name: '2Ti', count: 4 },
  { name: 'Tit', count: 3 },
  { name: 'Phm', count: 1 },
  { name: 'Heb', count: 13 },
  { name: 'Jas', count:  5 },
  { name: '1Pe', count:  5 },
  { name: '2Pe', count:  3 },
  { name: '1Jo', count:  5 },
  { name: '2Jo', count:  1 },
  { name: '3Jo', count: 1 },
  { name: 'Jude', count:  1 },
  { name: 'Re', count: 22 },
];

const getBookCount = () => {
  return db.length;
};

const getBookName = (bookNo) => {
  return db[bookNo - 1].name;
};

const getChapterCount = (bookNo) => {
  return db[bookNo - 1].count;
};

const getCitationText = (index) => {
  let bookIndex = 0;
  let chapterIndex = 0;
  for (const o of db) {
    if (index < chapterIndex + o.count) {
      const bookName = db[bookIndex].name;
      const chapterNo = index - chapterIndex + 1;
      return `${bookName} ${chapterNo}`;
    }
    bookIndex += 1;
    chapterIndex += o.count;
  }
};

const getBookNoAndChapterNo = (index) => {
  let bookIndex = 0;
  let chapterIndex = 0;
  for (const o of db) {
    if (index < chapterIndex + o.count) {
      const bookNo = bookIndex + 1;
      const chapterNo = index - chapterIndex + 1;
      return { bookNo, chapterNo };
    }
    bookIndex += 1;
    chapterIndex += o.count;
  }
};

const getTotalChapterCount = () => {
  return db.reduce((r, o) => { return r + o.count; }, 0);
};

const getPreviousIndex = (chapterIndex) => {
  if (chapterIndex > 0) {
    return chapterIndex - 1;
  }
  return getTotalChapterCount() - 1;
};

const getNextIndex = (chapterIndex) => {
  if (chapterIndex + 1 < getTotalChapterCount()) {
    return chapterIndex + 1;
  }
  return 0;
};

export default {
  getBookCount,
  getBookName,
  getChapterCount,
  getCitationText,
  getBookNoAndChapterNo,
  getTotalChapterCount,
  getPreviousIndex,
  getNextIndex,
}
