var canvasInstance = null;

class BooleanBomb {
  constructor(initalState=true, usesRemaining=1) {
    this.bool = initalState;
    this.usesRemaining = usesRemaining;
  }

  eval() {
    if (this.usesRemaining-- > 0) {
      return this.bool;
    }
    return !this.bool;
  }
}

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

    this.currentHeight = this.ROW_PADDING;
    this.currentRowHeight = 0;
    this.currentWidth = 0;
  }

  clear() {
    this.svg.selectAll("*").remove();
    this.currentHeight = this.ROW_PADDING;
    this.currentRowHeight = 0;
    this.currentWidth = 0;
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
    const motifTypes = [
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

    return legend;
  }

  addMarkupLegend(data) {
    let markupTypeColour = {};
    data.markups.forEach(markup => {
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

    return legend;
  }

  addHeatmap(data) {
    const HEATMAP_CELL_WIDTH = 25;
    const HEATMAP_CELL_HEIGHT = 25;
    const slate = this.svg.append("g");
    const scale = this.scale;
    let scale_chromatic = d3
      .scaleSequential(FormOptions.selectedInterpolator())
      .domain([FormOptions.heatmapMin(), FormOptions.heatmapMax()]);

    let markup_display = data.markups.filter(
      markup => markup.display !== false
    );
    let heatmap_column = slate
      .selectAll("heatmap_column")
      .data(markup_display)
      .enter()
      .append("g")
      .attr(
        "transform",
        d => `translate(${scale(d.start)}, 0)`
      );

    let tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    heatmap_column.each(function(markup) {
      if (markup.intensity_values) {
        // draw heatmap labels
        d3.select(this)
          .append("text")
          .text(markup => markup.peptide_coordinate_sequence)
          .attr("x", 12)
          .attr("y", HEATMAP_CELL_WIDTH - 6)
          .attr("transform", d => `rotate(270)`);
        // draw column cells
        d3.select(this)
          .selectAll("heatmap_values")
          .data(markup.intensity_values)
          .enter()
          .append("rect")
          .attr("y", (d, index) => HEATMAP_CELL_HEIGHT * index)
          .attr("height", HEATMAP_CELL_HEIGHT)
          .attr("width", HEATMAP_CELL_WIDTH)
          .attr("fill", value => scale_chromatic(value))
          .on("mouseover", function(d, index) {
            d3.select(this).raise();
            tooltip.style("opacity", 0.8);
            tooltip
              .html(describeMarkup(markup, index))
              .style("left", d3.event.pageX + 20 + "px")
              .style("top", d3.event.pageY + "px");
          })
          .on("mouseout", function(d) {
            tooltip.style("opacity", 0);
          });
      }
    });

    // Update heatmap locations to prevent overlap
    heatmap_column.sort((a, b) => a.start - b.start).each(function() {
      const that = this;
      heatmap_column.each(function() {
        if (this !== that && intersects(this, that)) {
          const thatLeft = getTranslation(d3.select(that).attr("transform"))[0];
          d3.select(this).attr(
            "transform",
            `translate(${thatLeft + HEATMAP_CELL_WIDTH}, 0)`
          );
        }
      });
    });

    // Add heatmap label to last heatmap column
    const lastHeatMapColumn = heatmap_column.nodes()[heatmap_column.size() - 1];
    d3.select(lastHeatMapColumn).each(function(markup) {
      if (markup.intensity_labels) {
        d3.select(this)
          .selectAll("heatmap_labels")
          .data(markup.intensity_labels)
          .enter()
          .append("text")
          .attr("x", HEATMAP_CELL_WIDTH * 2)
          .attr("y", (d, index) => HEATMAP_CELL_HEIGHT * (index + 1))
          .text(d => d);
      }
    });

    return slate;
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

    return legend;
  }

  addProtein(data) {
    const visType = FormOptions.selectedVisType();
    let nTrials;
    if (visType === "lollipop") {
      nTrials = data.markups[0].intensity_values.length;
    } else {
      nTrials = 1;
    }

    for (let i = 0; i < nTrials; i++) {
      let slate = this.svg.append("g");
      let builder = new ProteinBuilder(data, slate, this.scale);
      let protein = builder.build(i);
      this.fit(slate);

      if (visType === "heatmap" && hasIntensityValues(data)) {
        const heatmap = this.addHeatmap(data);
        this.fit(heatmap);
      }

      // Add legends beneath last protein object
      let newRow = new BooleanBomb(true);
      if (i === nTrials - 1) {
        let legend = null;
        if (protein.hasMotifs) {
          legend = this.addMotifLegend(data);
          this.fit(legend, newRow.eval());
        }
        if (protein.hasMarkup) {
          legend = this.addMarkupLegend(data);
          this.fit(legend, newRow.eval());
        }
        if (visType === "heatmap" && hasIntensityValues(data)) {
          legend = this.addHeatmapLegend(data);
          this.fit(legend, newRow.eval());
        }
      }
    }
  }

  // Fit element to the bottom of the canvas
  fit(element, beginNewRow=true) {
    const elementHeight = element.node().getBBox().height;
    const elementWidth = element.node().getBBox().width;

    if (beginNewRow) {
      this.currentHeight += this.currentRowHeight + this.ROW_PADDING;
      this.currentWidth = 0;
      this.currentRowHeight = 0;
    }

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
        ${this.currentWidth + this.MARGIN.left + currentX},
        ${this.currentHeight - element.node().getBBox().y}
      )`
    );

    this.currentWidth += elementWidth + this.ROW_PADDING;
    if (elementHeight > this.currentRowHeight) {
      this.currentRowHeight = elementHeight;
    }
  }

  // Expand the canvas to fit all elements in this.svg
  expand() {
    this.svg
      .attr("width", this.svg.node().getBBox().width + this.MARGIN.right)
      .attr("height", this.svg.node().getBBox().height + this.MARGIN.bottom);
  }
}
