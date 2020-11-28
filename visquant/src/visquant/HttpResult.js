import { Button, Result } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited doesn't exist."
    extra={
      <Link to="/">
        <Button type="default">Back Home</Button>
      </Link>
    }
  />
);

const ServerError = () => (
  <Result
    status="500"
    title="Blip in the network"
    subTitle="Something went wrong. Please try again later."
    extra={
      <Button type="default" key="home" onClick={() => location.reload()}>
        Refresh
      </Button>
    }
  />
);

export { PageNotFound, ServerError };
