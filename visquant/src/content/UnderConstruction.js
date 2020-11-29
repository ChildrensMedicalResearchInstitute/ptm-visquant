import { BuildOutlined } from "@ant-design/icons";
import { Alert } from "antd";
import React from "react";

const UnderConstruction = () => (
  <Alert
    message="Under construction"
    description={
      <p>
        This new PTM Visquant app is under construction and currently lacks some
        of the existing features in the current prototype. Please check out{" "}
        <a href="https://visquant.cmri.org.au/">visquant.cmri.org.au</a> if this
        app is currently missing the feature you need.
      </p>
    }
    type="warning"
    icon={<BuildOutlined />}
    showIcon
  />
);
export default UnderConstruction;
