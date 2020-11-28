import ContentFromMarkdown from "./ContentFromMarkdown";
import { PropTypes } from "prop-types";
import React from "react";

const HelpPage = ({ match }) => {
  const { subpage } = match.params;
  const resourceFile = `how-to${subpage ? "-" + subpage : ""}.md`;
  const resourcePath = `https://raw.githubusercontent.com/ChildrensMedicalResearchInstitute/ptm-visquant/redesign/docs/${resourceFile}`;
  return <ContentFromMarkdown href={resourcePath} />;
};

HelpPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subpage: PropTypes.string,
    }),
  }).isRequired,
};

export default HelpPage;
