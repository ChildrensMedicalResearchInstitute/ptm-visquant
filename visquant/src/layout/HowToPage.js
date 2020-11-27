import React from "react";
import ReactMarkdown from "react-markdown";

class HowToPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      href: "https://raw.githubusercontent.com/ChildrensMedicalResearchInstitute/ptm-visquant/redesign/docs/how_to_drawing_options.md",
      content: null,
    };
  }
  lkj
  componentDidMount() {
    fetch(this.state.href)
      .then(response => response.text())
      .then(data => this.setState({ content: data }))
      .catch(error => {
        this.setState({ content: "Unable to load content." })
        console.error(error);
      });
  }

  render() {
    return (
      <ReactMarkdown source={this.state.content} />
    );
  }
}

export default HowToPage;
