import * as d3 from "d3";
import { PropTypes } from "prop-types";
import React from "react";

const Protein = (props) => {
  const ref = React.createRef();
  props.graphics; // TODO: Remove once used.

  React.useEffect(render, []);

  function render() {
    const svg = d3.select(ref.current);
    svg.selectAll("rect")
      .data([1, 2, 3]).enter()
      .append("rect")
      .attr("width", 40)
      .attr("height", (datapoint) => datapoint * 20)
      .attr("fill", "orange");
  }

  return <div ref={ref} />;
};

Protein.propTypes = {
  graphics: PropTypes.shape({
    length: PropTypes.number,
    regions: PropTypes.arrayOf(PropTypes.object),
    markups: PropTypes.arrayOf(PropTypes.object),
    metadata: PropTypes.shape({
      identifier: PropTypes.string,
    }),
    motifs: PropTypes.arrayOf(
      PropTypes.shape({
        colour: PropTypes.string,
        type: PropTypes.string,
        start: PropTypes.number,
        end: PropTypes.number,
      })),
  }).isRequired,
};

export default Protein;
