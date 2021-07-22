
const menus = [
  {
    // 菜单id
    id: 1,
    // 菜单名称
    name: '任务管理',
    // 菜单描述
    describe: '任务管理',
    // 请求地址
    url: '/tasks',
    // 父级菜单id
    parentId: null,
    // 排序
    sortInd: 1,
    // 图标地址
    iconUrl: 'field-time-outlined',
  },
  {
    // 菜单id
    id: 1,
    // 菜单名称
    name: '数据源管理',
    // 菜单描述
    describe: '数据源管理',
    // 请求地址
    url: '/datasource',
    // 父级菜单id
    parentId: null,
    // 排序
    sortInd: 1,
    // 图标地址
    iconUrl: 'database-outlined',
  }
]

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
      data: {
        token: user.token,
        menuList: (
          user.role === 'administrator'
          ? menus
          : ([menus[0]])
        )
      }
    };
  },

  post_logout () {
    return {
      code: 0,
      msg: '',
      data: null,
    };
  },

  post_updatePwd({
    username,
    password,
    passwordNew
  }) {
    const index = users.findIndex(user => user.username === username);
    if (index === -1 || users[index].password !== password) {
      return {
        code: -1,
        msg: '原密码不正确',
        data: null,
      };
    }

    users[index].password = passwordNew;

    return {
      code: 0,
      msg: '',
      data: null,
    };
  }
};
