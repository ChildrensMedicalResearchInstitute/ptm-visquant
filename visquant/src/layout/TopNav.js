import { Layout, Menu } from 'antd';
import { NavLink } from 'react-router-dom';

const { Header } = Layout;

const TopNav = () => (
  <Header>
    <Menu theme="dark" mode="horizontal">
      <Menu.Item key="1">
        <NavLink to="/">Draw</NavLink>
      </Menu.Item>
      <Menu.Item key="2">
        <NavLink to="/help">Help</NavLink>
      </Menu.Item>
      {/* (More tp include link to License, Github) */}
      <Menu.Item key="3">More</Menu.Item>
    </Menu>
  </Header>
)

export default TopNav;
