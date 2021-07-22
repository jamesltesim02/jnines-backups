const users = [
  {
    username: 'zhangsan',
    password: 'aa123123',
    role: 'administrator',
    token: 'zhagnsantoken'
  },
  {
    username: 'lisi',
    password: 'aa123123',
    role: 'user',
    token: 'lisitoken'
  },
  {
    username: 'wangwu',
    password: 'aa123123',
    role: 'user',
    token: 'wangwutoken'
  },
];

export default {
  name: 'user',
  records: users,
  post_login ({ username, password }) {
    const user = users.find(u => u.username === username)
    if (!user || user.password !== password) {
      return {
        code: -1,
        msg: '账号或密码不正确',
      };
    }

    return {
      code: 0,
      msg: '',
      data: user
    };
  }
};
