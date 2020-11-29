import ComponentStatus from "../common/ComponentStatus";
import { PageNotFound, ServerError } from "./HttpResult";
import { Skeleton } from "antd";
import PropTypes from "prop-types";
import React from "react";
import ReactMarkdown from "react-markdown";

class ContentFromMarkdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      httpResponseCode: null,
      status: ComponentStatus.PENDING,
      content: null,
    };
  }

  componentDidMount() {
    this.fetchContent();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.href !== this.props.href) {
      this.setState(
        { href: this.props.href, status: ComponentStatus.PENDING },
        this.fetchContent
      );
    }
  }

  fetchContent() {
    fetch(this.props.href)
      .then((response) => {
        this.setState({ httpResponseCode: response.status });
        return response.text();
      })
      .then((data) => {
        this.setState({
          status: ComponentStatus.RESOLVED,
          content: data,
        });
      })
      .catch(() => {
        this.setState({
          status: ComponentStatus.REJECTED,
          content: null,
        });
      });
  }

  render() {
    switch (this.state.status) {
      case ComponentStatus.PENDING:
        return <Skeleton active />;
      case ComponentStatus.RESOLVED:
        if (this.state.httpResponseCode === 404) {
          <PageNotFound />;
        }
        return <ReactMarkdown source={this.state.content} />;
      case ComponentStatus.REJECTED:
        return <ServerError />;
    }
  }
}

ContentFromMarkdown.propTypes = {
  href: PropTypes.string,
};

export default ContentFromMarkdown;
