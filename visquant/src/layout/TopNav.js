import React from "react";
import { Layout, Menu } from 'antd';
import { CopyrightOutlined, GithubOutlined, PushpinOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';

const { Header } = Layout;

class TopNav extends React.Component {

  static MENU_KEY_DRAW = "menu-key-draw";
  static MENU_KEY_HELP = "menu-key-help";
  static MENU_KEY_LICENSE = "menu-key-license";
  static MENU_KEY_GITHUB = "menu-key-github";

  state = {
    currentSelectedKey: TopNav.MENU_KEY_DRAW,
  };

  handleClick = e => {
    console.log(e.key);
    if (e.key === TopNav.MENU_KEY_GITHUB) {
      return;
    }
    this.setState({ currentSelectedKey: e.key });
  }

  render() {
    return (
      <Header>
        <Menu theme="dark" onClick={this.handleClick} selectedKeys={[this.state.currentSelectedKey]} mode="horizontal">
          <Menu.Item key={TopNav.MENU_KEY_DRAW} icon={<PushpinOutlined />}>
            <NavLink to="/">Draw</NavLink>
          </Menu.Item>
          <Menu.Item key={TopNav.MENU_KEY_HELP} icon={<QuestionCircleOutlined />}>
            <NavLink to="/how-to">Help</NavLink>
          </Menu.Item>
          <Menu.Item key={TopNav.MENU_KEY_LICENSE} icon={<CopyrightOutlined />}>
            <NavLink to="/license">License</NavLink>
          </Menu.Item>
          <Menu.Item key={TopNav.MENU_KEY_GITHUB} icon={<GithubOutlined />}>
            <a href="https://github.com/ChildrensMedicalResearchInstitute/ptm-visquant" target="_blank">GitHub</a>
          </Menu.Item>
        </Menu>
      </Header>
    )
  }
}

export default TopNav;
