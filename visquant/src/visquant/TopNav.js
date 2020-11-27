import React from "react";
import { Layout, Menu } from 'antd';
import { CopyrightOutlined, GithubOutlined, PushpinOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';

const { Header } = Layout;

const MenuKey = {
  MENU_KEY_DRAW: "menu-key-draw",
  MENU_KEY_HELP: "menu-key-help",
  MENU_KEY_LICENSE: "menu-key-license",
  MENU_KEY_GITHUB: "menu-key-github",
}

class TopNav extends React.Component {

  state = {
    currentSelectedKey: MenuKey.MENU_KEY_DRAW,
  };

  handleClick = e => {
    console.log(e.key);
    if (e.key === MenuKey.MENU_KEY_GITHUB) {
      return;
    }
    this.setState({ currentSelectedKey: e.key });
  }

  render() {
    return (
      <Header>
        <Menu theme="dark" onClick={this.handleClick} selectedKeys={[this.state.currentSelectedKey]} mode="horizontal">
          <Menu.Item key={MenuKey.MENU_KEY_DRAW} icon={<PushpinOutlined />}>
            <NavLink to="/">Draw</NavLink>
          </Menu.Item>
          <Menu.Item key={MenuKey.MENU_KEY_HELP} icon={<QuestionCircleOutlined />}>
            <NavLink to="/how-to">Help</NavLink>
          </Menu.Item>
          <Menu.Item key={MenuKey.MENU_KEY_LICENSE} icon={<CopyrightOutlined />}>
            <NavLink to="/license">License</NavLink>
          </Menu.Item>
          <Menu.Item key={MenuKey.MENU_KEY_GITHUB} icon={<GithubOutlined />}>
            <a href="https://github.com/ChildrensMedicalResearchInstitute/ptm-visquant" target="_blank">GitHub</a>
          </Menu.Item>
        </Menu>
      </Header>
    )
  }
}

export default TopNav;
