import { Layout } from "antd";
import { Route, Switch } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import EmptyContent from "./EmptyContent";
import TopNav from "./TopNav";
import ContentFromMarkdown from "./ContentFromMarkdown";

const { Content, Footer } = Layout;

const Page = () => (
  <Layout className="layout">
    <TopNav></TopNav>
    <Content style={{ padding: "0 50px" }}>
      <Switch>
        <Route path="/" exact component={EmptyContent} />
        <Route
          path="/how-to"
          exact
          component={() => (
            <ContentFromMarkdown href="https://raw.githubusercontent.com/ChildrensMedicalResearchInstitute/ptm-visquant/redesign/docs/how_to.md" />
          )}
        />
        <Route
          path="/license"
          exact
          component={() => (
            <ContentFromMarkdown href="https://raw.githubusercontent.com/ChildrensMedicalResearchInstitute/ptm-visquant/redesign/LICENSE.md" />
          )}
        />
        <Route component={PageNotFound} />
      </Switch>
    </Content>
    <Footer style={{ textAlign: "center" }}>
      Copyright © 2019 Children’s Medical Research Institute
    </Footer>
  </Layout>
);

export default Page;
