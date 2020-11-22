import { Layout } from 'antd';
import { Route, Switch } from 'react-router-dom';
import PageNotFound from './PageNotFound';
import EmptyContent from './EmptyContent';
import TopNav from './TopNav';
import HowToPage from './HowToPage';

const { Content, Footer } = Layout;

const Page = () => (
  <Layout className="layout">
    <TopNav></TopNav>
    <Content style={{ padding: '0 50px' }}>
      <Switch>
        <Route path="/" exact component={EmptyContent} />
        <Route path="/help" exact component={HowToPage} />
        <Route component={PageNotFound} />
      </Switch>
    </Content>
    <Footer style={{ textAlign: 'center' }}>Copyright © 2019 Children’s Medical Research Institute</Footer>
  </Layout>
);

export default Page;
