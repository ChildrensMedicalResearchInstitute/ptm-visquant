import ComponentStatus from "../common/ComponentStatus";
import { PageNotFound, ServerError } from "./HttpResult";
import { Skeleton } from "antd";
import PropTypes from "prop-types";
import React from "react";
import ReactMarkdown from "react-markdown";

const { PENDING, RESOLVED, REJECTED } = ComponentStatus;

const ContentFromMarkdown = (props) => {
  const [httpResponseCode, setHttpResponseCode] = React.useState(null);
  const [status, setStatus] = React.useState(PENDING);
  const [content, setContent] = React.useState(null);

  React.useEffect(() => {
    setStatus(PENDING);
    fetchContent();
  }, [props.href]);

  function fetchContent() {
    fetch(props.href)
      .then((response) => {
        setHttpResponseCode(response.status);
        return response.text();
      })
      .then((data) => {
        setStatus(RESOLVED);
        setContent(data);
      })
      .catch(() => {
        setStatus(REJECTED);
        setContent(null);
      });
  }

  switch (status) {
    case PENDING:
      return <Skeleton active />;
    case RESOLVED:
      if (httpResponseCode === 404) {
        <PageNotFound />;
      }
      return <ReactMarkdown source={content} />;
    case REJECTED:
      return <ServerError />;
  }
};

ContentFromMarkdown.propTypes = {
  href: PropTypes.string,
};

export default ContentFromMarkdown;
