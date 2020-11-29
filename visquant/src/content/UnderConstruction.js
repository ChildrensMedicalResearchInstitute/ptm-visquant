import { yellow } from "@ant-design/colors";
import { Card } from "antd";
import React from "react";

const UnderConstruction = () => (
  <Card
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "60px",
      backgroundColor: yellow.primary,
    }}
  >
    <p>This page is currently under construction.</p>
  </Card>
);
export default UnderConstruction;
