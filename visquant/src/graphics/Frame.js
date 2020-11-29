import ComponentStatus from "../common/ComponentStatus";
import Protein from "./Protein";
import { Alert, Spin } from "antd";
import { PropTypes } from "prop-types";
import React from "react";

const { PENDING, RESOLVED, REJECTED } = ComponentStatus;

const Frame = (props) => {
  const [graphics, setGraphics] = React.useState(null);
  const [status, setStatus] = React.useState(PENDING);

  React.useEffect(() => fetchGraphics(props.id), [props.id]);

  function fetchGraphics(proteinId) {
    fetch(`http://pfam.xfam.org/protein/${proteinId}/graphic`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.assert(data.length === 1, {
          data: data,
          error: "Unexpected response from Pfam",
        });
        setGraphics(data[0]);
        setStatus(RESOLVED);
      })
      .catch(() => {
        setGraphics(null);
        setStatus(REJECTED);
      });
  }

  function getFrameContent() {
    switch (status) {
      case PENDING:
        return <Spin style={{ display: "flex", justifyContent: "center" }} />;
      case RESOLVED:
        return <Protein graphics={graphics} scale={props.scale} />;
      case REJECTED:
        return (
          <Alert
            message={`Could not find protein "${props.id}"`}
            type="error"
            showIcon
          />
        );
    }
  }

  return (
    <div style={{ margin: "20px 0", overflow: "visible" }}>
      {getFrameContent()}
    </div>
  );
};

Frame.propTypes = {
  id: PropTypes.string.isRequired,
  scale: PropTypes.any,
};

export default Frame;
