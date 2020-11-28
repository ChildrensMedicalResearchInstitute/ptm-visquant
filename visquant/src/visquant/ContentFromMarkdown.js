import { Result, Button, Skeleton } from "antd";
import PropTypes from "prop-types";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

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
      .then((response) => response.text())
      .then((data) => {
        this.setState({
          status: Status.RESOLVED,
          content: data,
        });
      })
      .catch(() => {
        this.setState({
          status: Status.REJECTED,
          content: "Unable to load content.",
        });
      });
  }

  render() {
    switch (this.state.status) {
      case Status.PENDING:
        return <Skeleton active />;
      case Status.RESOLVED:
        return <ReactMarkdown source={this.state.content} />;
      case Status.REJECTED:
        return (
          <Result
            status="warning"
            title="We were unable to load the content."
            extra={
              <Link to="/">
                <Button type="default" key="home">
                  Back Home
                </Button>
              </Link>
            }
          />
        );
    }
  }
}

ContentFromMarkdown.propTypes = {
  href: PropTypes.string,
};

export default ContentFromMarkdown;
