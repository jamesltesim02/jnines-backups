export default {
  name: 'tblcol',
  records: [],
  post_list() {
    return {
      code: 0,
      msg: '',
      data: [
        {
          id: 1,
          sourceColumName: 'COL1',
          sourceColumNick: '大字段1',
        },
        {
          id: 2,
          sourceColumName: 'COL2',
          sourceColumNick: '大字段2',
        },
        {
          id: 3,
          sourceColumName: 'COL3',
          sourceColumNick: '小字段3',
        },
        {
          id: 4,
          sourceColumName: 'COL4',
          sourceColumNick: '小字段4',
        },
        {
          id: 5,
          sourceColumName: 'COL5',
          sourceColumNick: '多字段5',
        },
        {
          id: 6,
          sourceColumName: 'COL6',
          sourceColumNick: '多字段6',
        },
        {
          id: 7,
          sourceColumName: 'COL8',
          sourceColumNick: '少字段9',
        },
        {
          id: 9,
          sourceColumName: 'COL9',
          sourceColumNick: '少字段9',
        },
        {
          id: 10,
          sourceColumName: 'COL10',
          sourceColumNick: '山字段10',
        },
      ]
    };
  }
};
