import React from 'react';
import { Switch, Route, Redirect, Link, useHistory, useLocation } from 'react-router-dom';
import { Layout, Menu, Dropdown, message } from 'antd';
import {
  UserOutlined,
  FieldTimeOutlined,
  DatabaseOutlined,
  DownOutlined
} from '@ant-design/icons';

import memberStore from '../../stores/member';

import mergeClass from '../../utils/merge-class';
import { withApi } from '../../apis';
import User from '../../apis/User';

import TasksPage from '../Tasks';
import DatasourcePage from '../Datasource';
import TablesPage from '../Datasource/Tables';
import ModifyPasswordPage from '../ModifyPassword'

const { Header, Content, Sider } = Layout;

const icons:Record<string, any> = {
  'field-time-outlined': <FieldTimeOutlined />,
  'database-outlined': <DatabaseOutlined />
}

function AppLayout (
  {
    api: { user }
  }: {
    api: { user: User }
  }
) {
  const location = useLocation()
  const history = useHistory()

  // 左侧菜单展开状态
  const [collapsed, setCollapsed] = React.useState(false);
  
  // 退出登录
  const handleSignout = async () => {
    const hide = message.loading('退出中...', 0)
    try {
      await user.logout();
    } finally {
      memberStore.memberInfo = null;
      hide();
      message.success('退出成功');
      history.replace('/signin');
    }
  };

  // 未登录直接转到登录页面
  if (!memberStore.isLoged) {
    history.replace('/signin');
    return null;
  }

  let defaultPath = '/datasource';
  if (memberStore.memberInfo.menuList?.lenth) {
    defaultPath = memberStore.memberInfo.menuList[0].url
  }

  return (
    <Layout
      className={
        mergeClass(
          'layout-container',
          collapsed ? 'collapsed' : null
        )
      }
    >
      <Sider
        className="layout-slider"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        <header>{collapsed ? <>Admin</> : '自动化运维平台'}</header>
        <section>
          <Menu
            theme="dark"
            defaultSelectedKeys={[location.pathname]}
            mode="inline"
          >
            {
              memberStore.memberInfo.menuList.map((menu: any) => (
                <Menu.Item
                  key={menu.url}
                  icon={icons[menu.iconUrl]}
                >
                  <Link to={menu.url}>
                    {menu.name}
                  </Link>
                </Menu.Item>
              ))
            }
          </Menu>
        </section>
      </Sider>
      <Layout className="site-layout">
        <Header>
          <div>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item>
                    <Link to="/modify-password">修改密码</Link>
                  </Menu.Item>
                  <Menu.Item onClick={handleSignout}>退出系统</Menu.Item>
                </Menu>
              }
            >
              <span
                className="ant-dropdown-link"
                onClick={e => e.preventDefault()}
              >
                <UserOutlined />
                &nbsp;
                {memberStore.memberInfo.username}
                &nbsp;&nbsp;
                <DownOutlined />
              </span>
            </Dropdown>
          </div>
        </Header>
        <Content>
          <Switch>
            <Route path="/tasks"><TasksPage /></Route>
            <Route path="/datasource/tables/:did/:dname"><TablesPage /></Route>
            <Route path="/datasource"><DatasourcePage /></Route>
            <Route path="/modify-password"><ModifyPasswordPage /></Route>
            <Route path="/"><Redirect to={defaultPath} /></Route>
          </Switch>
        </Content>
      </Layout>
    </Layout>
  )
}

export default withApi({ user: User })(AppLayout);
