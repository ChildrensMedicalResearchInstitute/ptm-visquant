import ContentFromMarkdown from "./ContentFromMarkdown";
import HelpPage from "./HelpPage";
import { PageNotFound } from "./HttpResult";
import TopNav from "./TopNav";
import UnderConstruction from "./UnderConstruction";
import { Layout } from "antd";
import React from "react";
import { Route, Switch } from "react-router-dom";

const { Content, Footer } = Layout;

const Page = () => (
  <Layout className="layout" style={{ minHeight: "100vh" }}>
    <TopNav></TopNav>
    <Content style={{ padding: "0 50px" }}>
      <Switch>
        <Route path="/" exact component={UnderConstruction} />
        <Route path="/how-to/:subpage?" component={HelpPage} />
        <Route
          path="/license"
          exact
          component={() => (
            <ContentFromMarkdown href="https://raw.githubusercontent.com/ChildrensMedicalResearchInstitute/ptm-visquant/master/LICENSE.md" />
          )}
        />
        <Route component={PageNotFound} />
      </Switch>
    </Content>
    <Footer style={{ textAlign: "center" }}>
      <p>
        Made with ♡ by{" "}
        <a
          href="https://github.com/digitalpoetry"
          target="_blank"
          rel="noopener noreferrer"
        >
          Jonathan Du
        </a>
        . Copyright © 2019 Children’s Medical Research Institute.
      </p>
    </Footer>
  </Layout>
);

export default Page;
