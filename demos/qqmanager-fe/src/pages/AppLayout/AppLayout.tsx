import React from 'react';
import { Switch, Route, Redirect, Link, useHistory, useLocation } from 'react-router-dom';
import { Layout, Menu, Dropdown, message } from 'antd';

import {
  UserOutlined,
  DesktopOutlined,
  PieChartOutlined,
  DownOutlined
} from '@ant-design/icons';

import mergeClass from '../../utils/merge-class';
import memberStore from '../../stores/member';

import TasksPage from '../Tasks';
import DatasourcePage from '../Datasource';
import TablesPage from '../Datasource/Tables';

const { Header, Content, Sider } = Layout;

function AppLayout () {
  const location = useLocation()
  const history = useHistory()

  // 左侧菜单展开状态
  const [collapsed, setCollapsed] = React.useState(false);
  
  // 退出登录
  const handleSignout = () => {
    memberStore.memberInfo = null;
    message.success('退出成功');
    history.replace('/signin');
  };

  // 未登录直接转到登录页面
  if (!memberStore.isLoged) {
    history.replace('/signin');
    return null;
  }

  const routers = [
    {
      path: '/tasks',
      name: '任务管理',
      icon: <PieChartOutlined />
    }
  ];

  if (memberStore.memberInfo.role === 'administrator') {
    routers.push({
      path: '/datasource',
      name: '数据源管理',
      icon: <DesktopOutlined />
    })
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
        {/* <header>{collapsed ? <>&nbsp;</> : '自动化运维平台'}</header> */}
        <header>{collapsed ? <>&nbsp;</> : '后台管理系统'}</header>
        <section>
          <Menu
            theme="dark"
            defaultSelectedKeys={[location.pathname]}
            mode="inline"
          >
            {
              routers.map(route => (
                <Menu.Item
                  key={route.path}
                  icon={route.icon}
                >
                  <Link to={route.path}>
                    {route.name}
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
                  <Menu.Item>修改密码</Menu.Item>
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
            <Route path="/"><Redirect to="/tasks" /></Route>
          </Switch>
        </Content>
      </Layout>
    </Layout>
  )
}

export default AppLayout;
