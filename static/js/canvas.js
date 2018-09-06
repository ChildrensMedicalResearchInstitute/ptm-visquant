var canvasInstance = null;

class Canvas {
  constructor() {
    if (canvasInstance) {
      return canvasInstance;
    }
    canvasInstance = this;
    this.scale = undefined;
    this.svg = d3.select("div.vis-box").append("svg");
    this.MARGIN = { top: 0, right: 10, bottom: 10, left: 10 };
    this.ROW_PADDING = 40;
    this.AXIS_HEIGHT = this.ROW_PADDING * 2;
    this.CURRENT_HEIGHT = this.AXIS_HEIGHT;
  }

  clear() {
    this.svg.selectAll("*").remove();
    this.CURRENT_HEIGHT = this.AXIS_HEIGHT;
  }

  addScale(length) {
    const userZoom = FormOptions.scaleZoomPercent() / 100;
    this.scale = d3
      .scaleLinear()
      .domain([0, length])
      .range([0, length * userZoom]);

    let xAxis = d3
      .axisBottom(this.scale)
      .tickValues(d3.range(0, length, FormOptions.scaleTickStep()));

    this.svg
      .append("g")
      .attr("transform", `translate(${this.MARGIN.left}, 0)`)
      .call(xAxis)
      .selectAll("text")
      .attr("y", 0)
      .attr("x", -10)
      .attr("dy", ".35em")
      .attr("transform", "rotate(270)")
      .style("text-anchor", "end")
      .style("font-size", "1rem");
  }

  addMotifLegend(data) {
    // As defined by Pfam http://pfam.xfam.org/help#tabview=tab10
    let motifTypes = [
      {
        type: "disorder",
        colour: "#cccccc"
      },
      {
        type: "low_complexity",
        colour: "#86bcff"
      },
      {
        type: "coiled_coil",
        colour: "#9cff00"
      },
      {
        type: "sig_p",
        colour: "#ff9c00"
      },
      {
        type: "transmembrane",
        colour: "#F00"
      }
    ];

    let legendScale = d3
      .scaleOrdinal()
      .domain(motifTypes.map(d => d.type))
      .range(motifTypes.map(d => d.colour));

    let legendStyle = d3
      .legendColor()
      .shape(
        "path",
        "M-3,-3h18v12h-18Z"
      )
      .shapePadding(10)
      // filter out motifs which do not appear in this context
      .cellFilter(d => data.motifs.map(m => m.type).indexOf(d.label) > -1)
      .title("Motifs")
      .scale(legendScale);

    let legend = this.svg
      .append("g")
      .attr("class", "legendOrdinal")
      .attr("transform", "translate(20,0)")
      .call(legendStyle);

    this.fit(legend);
  }

  addMarkupLegend(data) {
    let markupTypeColour = {};
    data.markups.forEach(markup => {
      if (markup.display == false) {
        return;
      }
      markupTypeColour[markup.type] = markup.lineColour;
    });

    let legendScale = d3
      .scaleOrdinal()
      .domain(Object.keys(markupTypeColour))
      .range(Object.values(markupTypeColour));

    let legendStyle = d3
      .legendColor()
      .shape(
        "path",
        "M-3,-3h6v18h-6Z"
      )
      .shapePadding(10)
      .title("Modifications")
      .scale(legendScale);

    let legend = this.svg
      .append("g")
      .attr("class", "legendOrdinal")
      .attr("transform", "translate(20,0)")
      .call(legendStyle);

    this.fit(legend);
  }

  addHeatmapLegend() {
    let legendScale = d3
      .scaleSequential(FormOptions.selectedInterpolator())
      .domain([FormOptions.heatmapMin(), FormOptions.heatmapMax()]);

    let legendStyle = d3
      .legendColor()
      .shapeWidth(40)
      .cells(10)
      .orient("horizontal")
      .title("Heatmap scale")
      .scale(legendScale);

    let legend = this.svg
      .append("g")
      .attr("class", "legendLinear")
      .attr("transform", "translate(20,0)")
      .call(legendStyle);

    this.fit(legend);
  }

  addProtein(data) {
    const visType = FormOptions.selectedVisType();
    let nTrials;
    if (visType === "lollipop") {
      nTrials = data.markups[0].heatmap_values.length;
    } else {
      nTrials = 1;
    }

    for (let i = 0; i < nTrials; i++) {
      let slate = this.svg.append("g");
      let builder = new ProteinBuilder(data, slate, this.scale);
      let protein = builder.build(i);
      this.fit(slate);

      // Add legends beneath last protein object
      if (i === nTrials - 1) {
        if (protein.hasMotifs) {
          this.addMotifLegend(data);
        }
        if (protein.hasMarkup) {
          this.addMarkupLegend(data);
        }
        if (visType === "heatmap" && protein.hasHeatmap) {
          this.addHeatmapLegend(data);
        }
      }
    }
  }

  // Fit element to the bottom of the canvas and update canvas height
  fit(element) {
    let currentX = undefined;
    try {
      // Maintain current transformed x-coordinate
      currentX = getTranslation(element.attr("transform"))[0];
    } catch (err) {
      currentX = 0;
    }
    element.attr(
      "transform",
      `translate(
        ${this.MARGIN.left + currentX},
        ${this.CURRENT_HEIGHT - element.node().getBBox().y}
      )`
    );
    this.CURRENT_HEIGHT += element.node().getBBox().height + this.ROW_PADDING;
  }

  // Expand the canvas to fit all elements in this.svg
  expand() {
    this.svg
      .attr("width", this.svg.node().getBBox().width + this.MARGIN.right)
      .attr("height", this.svg.node().getBBox().height + this.MARGIN.bottom);
  }
}
