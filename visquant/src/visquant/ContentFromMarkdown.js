import { PageNotFound, ServerError } from "./HttpResult";
import { Skeleton } from "antd";
import PropTypes from "prop-types";
import React from "react";
import ReactMarkdown from "react-markdown";

const Status = {
  PENDING: "pending",
  REJECTED: "rejected",
  RESOLVED: "resolved",
};

class ContentFromMarkdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      href: props.href,
      httpResponseCode: null,
      status: Status.PENDING,
      content: null,
    };
  }

  componentDidMount() {
    this.fetchContent();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.href !== this.props.href) {
      this.setState(
        { href: this.props.href, status: Status.PENDING },
        this.fetchContent
      );
    }
  }

  fetchContent() {
    fetch(this.state.href)
      .then((response) => {
        this.setState({ httpResponseCode: response.status });
        return response.text();
      })
      .then((data) => {
        this.setState({
          status: Status.RESOLVED,
          content: data,
        });
      })
      .catch(() => {
        this.setState({
          status: Status.REJECTED,
          content: null,
        });
      });
  }

  render() {
    switch (this.state.status) {
      case Status.PENDING:
        return <Skeleton active />;
      case Status.RESOLVED:
        if (this.state.httpResponseCode === 404) {
          <PageNotFound />;
        }
        return <ReactMarkdown source={this.state.content} />;
      case Status.REJECTED:
        return <ServerError />;
    }
  }
}

ContentFromMarkdown.propTypes = {
  href: PropTypes.string,
};

export default ContentFromMarkdown;
