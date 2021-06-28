import UnderConstruction from "../content/UnderConstruction";
import Frame from "../graphics/Frame";
import ProteinSelect from "./ProteinSelect";
import { Card, Empty } from "antd";
import * as d3 from "d3";
import { PropTypes } from "prop-types";
import qs from "qs";
import React, { useEffect } from "react";
import { withRouter } from "react-router";

const scaleOptions = {
  domain: [0, 4_000],
  range: [0, 2_000],
};

const Mapper = (props) => {
  const proteinsFromQueryString =
    qs.parse(props.location.search, { ignoreQueryPrefix: true }).id ?? [];

  const [proteins, setProteins] = React.useState(proteinsFromQueryString);
  const scale = d3
    .scaleLinear()
    .domain(scaleOptions.domain)
    .range(scaleOptions.range);

  function selectedProteinsChanged(selectedProteins) {
    props.history.push({
      search: "?" + qs.stringify({ id: selectedProteins }),
    });
    setProteins(selectedProteins);
  }

  function renderResults() {
    if (proteins.length === 0) {
      return (
        <Empty
          style={{ margin: "40px" }}
          description={
            <p>
              To get started, enter Pfam protein entry name or accession.
              <br />
              For example, TAU_RAT or P19332.
            </p>
          }
        />
      );
    }
    return (
      proteins.map((id) => (
        <Frame key={id} id={id} scale={scale} />
      )) 
    );
  }

  // Render proteins from query string when component mounts
  useEffect(() => selectedProteinsChanged(proteins), []);

  return (
    <>
      <UnderConstruction />
      <Card style={{ margin: "20px 0" }}>
        <ProteinSelect
          onChange={selectedProteinsChanged}
          defaultValue={proteins}
        />
        {renderResults()}
      </Card>
    </>
  );
};

Mapper.propTypes = {
  history: PropTypes.any.isRequired,
  location: PropTypes.any.isRequired,
};

export default withRouter(Mapper);
