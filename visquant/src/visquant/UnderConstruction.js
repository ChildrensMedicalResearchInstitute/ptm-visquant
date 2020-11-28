import { BuildOutlined } from "@ant-design/icons";
import { Result } from "antd";
import React from "react";

const UnderConstruction = () => (
  <Result
    icon={<BuildOutlined />}
    status="warning"
    title="This page is under construction."
    extra={<p>New content is underway and will be coming to you real soon.</p>}
  />
);
export default UnderConstruction;
