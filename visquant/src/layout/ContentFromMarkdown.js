import React from "react";
import ReactMarkdown from "react-markdown";

class ContentFromMarkdown extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      href: props.href,
      content: null,
    };
  }

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

export default ContentFromMarkdown;
