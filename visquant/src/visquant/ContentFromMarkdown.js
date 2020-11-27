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
    fetch(this.state.href)
      .then((response) => response.text())
      .then((data) => {
        this.setState({
          content: data,
          status: Status.RESOLVED,
        });
      })
      .catch(() => {
        this.setState({
          content: "Unable to load content.",
          status: Status.REJECTED,
        });
      });
  }

  render() {
    if (this.state.status === Status.PENDING) {
      return <Skeleton active />;
    }

    if (this.state.status === Status.RESOLVED) {
      return <ReactMarkdown source={this.state.content} />;
    }

    if (this.state.status === Status.REJECTED) {
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
