import UnderConstruction from "../content/UnderConstruction";
import Protein from "../graphics/Frame";
import ProteinSelect from "./ProteinSelect";
import { Card, Empty } from "antd";
import { PropTypes } from "prop-types";
import qs from "qs";
import React, { useEffect } from "react";
import { withRouter } from "react-router";

const Mapper = (props) => {
  const proteinsFromQueryString =
    qs.parse(props.location.search, { ignoreQueryPrefix: true }).id ?? [];

  const [proteins, setProteins] = React.useState(proteinsFromQueryString);

  // Render proteins from query string when component mounts
  useEffect(() => selectedProteinsChanged(proteins), []);

  function selectedProteinsChanged(selectedProteins) {
    props.history.push({
      search: "?" + qs.stringify({ id: selectedProteins }),
    });
    setProteins(selectedProteins);
  }

  function renderResults() {
    if (proteins.length === 0) {
      return (
        <Empty description="Enter protein ID or accession above. For example: BSN_RAT." />
      );
    }
    return proteins.map((id) => <Protein key={id} id={id}></Protein>);
  }

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
