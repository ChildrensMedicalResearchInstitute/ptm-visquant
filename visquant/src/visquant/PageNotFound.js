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

export default PageNotFound;
