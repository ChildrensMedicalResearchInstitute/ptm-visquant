import * as d3 from "d3";
import { PropTypes } from "prop-types";
import React from "react";

const DrawOptions = {
  backboneHeight: 10,
  backboneFill: "grey",
  backboneY: 30,

  regionHeight: 20,
  regionRectRadius: 5,
  regionOpacity: 0.9,

  motifHeight: 20,
  motifOpacity: 0.5,
};

const Protein = (props) => {
  const ref = React.createRef();

  React.useEffect(render, []);

  function drawBackbone(svg) {
    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", DrawOptions.backboneY - DrawOptions.backboneHeight / 2)
      .attr("height", DrawOptions.backboneHeight)
      .attr("width", props.scale(props.graphics.length))
      .attr("fill", DrawOptions.backboneFill);
  }

  function drawRegions(svg) {
    const regions = svg
      .selectAll("region")
      .data(props.graphics.regions.filter((d) => d.display !== false))
      .enter()
      .append("g");

    regions
      .append("rect")
      .attr("rx", DrawOptions.regionRectRadius)
      .attr("ry", DrawOptions.regionRectRadius)
      .attr("x", (region) => props.scale(region.start))
      .attr("y", DrawOptions.backboneY - DrawOptions.regionHeight / 2)
      .attr("width", (region) => props.scale(region.end - region.start))
      .attr("height", DrawOptions.regionHeight)
      .style("fill", (region) => region.colour)
      .style("fill-opacity", DrawOptions.regionOpacity)
      .style("stroke", "black");
  }

  function drawMotifs(svg) {
    svg
      .selectAll("motif")
      .data(props.graphics.motifs.filter((d) => d.display !== false))
      .enter()
      .append("rect")
      .attr("x", (motif) => props.scale(motif.start))
      .attr("y", () => DrawOptions.backboneY - DrawOptions.motifHeight / 2)
      .attr("width", (motif) => props.scale(motif.end - motif.start))
      .attr("height", DrawOptions.motifHeight)
      .style("fill", (motif) => motif.colour)
      .style("fill-opacity", DrawOptions.motifOpacity);
  }

  function render() {
    const svg = d3.select(ref.current);
    drawBackbone(svg);
    drawRegions(svg);
    drawMotifs(svg);
  }

  return <svg ref={ref} />;
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
      })
    ),
  }).isRequired,
  scale: PropTypes.any.isRequired,
};

export default Protein;
