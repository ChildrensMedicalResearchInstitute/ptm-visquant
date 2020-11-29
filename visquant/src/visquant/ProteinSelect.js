import { Select } from "antd";
import { PropTypes } from "prop-types";
import React from "react";

const ProteinSelect = (props) => {
  return (
    <Select
      mode="tags"
      style={{ width: "100%" }}
      onChange={props.onChange}
      allowClear={true}
      autoFocus={true}
      tokenSeparators={[","]}
      defaultValue={props.defaultValue}
    />
  );
};

ProteinSelect.propTypes = {
  onChange: PropTypes.func,
  defaultValue: PropTypes.arrayOf(PropTypes.string),
};

export default ProteinSelect;
