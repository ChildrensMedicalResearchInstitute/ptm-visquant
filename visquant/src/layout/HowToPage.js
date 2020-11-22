import marked from "marked";

import React from "react";

class HowToPage extends React.Component {

  componentWillMount() {
    const readmePath = require("./how_to_drawing_options.md");

    fetch(readmePath)
      .then(response => {
        console.log(response);
        return response.text()
      })
      .then(text => {
        console.log(text);
        this.setState({
          markdown: marked(text)
        })
      })
      .catch((reason) => console.log(reason));
  }

  render() {
    // const { markdown } = this.state;

    return (
      <section>
        {/* <article dangerouslySetInnerHTML={{ __html: markdown }}></article> */}
      </section>
    )
  }
}

export default HowToPage;
