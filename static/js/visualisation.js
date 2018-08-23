function intersects(elem1, elem2) {
  let r1 = elem1.getBoundingClientRect();
  let r2 = elem2.getBoundingClientRect();
  return !(
    r2.left >= r1.right ||
    r2.right <= r1.left ||
    r2.top >= r1.bottom ||
    r2.bottom <= r1.top
  );
}

// https://stackoverflow.com/questions/38224875/replacing-d3-transform-in-d3-v4/38230545#38230545
function getTranslation(transform) {
  if (transform === null) {
    return [0, 0];
  }
  let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttributeNS(null, "transform", transform);
  let matrix = g.transform.baseVal.consolidate().matrix;
  return [matrix.e, matrix.f];
}

function saveSvg(svgElement, filename) {
  svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  let svgData = svgElement.outerHTML;
  let preface = '<?xml version="1.0" standalone="no"?>\r\n';
  let svgBlob = new Blob([preface, svgData], {
    type: "image/svg+xml;charset=utf-8"
  });
  let svgUrl = URL.createObjectURL(svgBlob);
  let downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

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
    this.scale = d3
      .scaleLinear()
      .domain([0, length])
      .range([0, 900]);

    let xAxis = d3.axisBottom(this.scale);
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
        d3
          .symbol()
          .type(d3.symbolCircle)
          .size(150)()
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
    let markup_display = data.markups.filter(
      markup => markup.display !== false
    );

    let legendScale = d3
      .scaleOrdinal()
      .domain(markup_display.map(d => d.type))
      .range(markup_display.map(d => d.lineColour));

    let legendStyle = d3
      .legendColor()
      .shape(
        "path",
        d3
          .symbol()
          .type(d3.symbolCircle)
          .size(150)()
      )
      .shapePadding(10)
      .title("Markup")
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
      .domain([
        d3.select("#heatmap-range-min").node().value,
        d3.select("#heatmap-range-max").node().value
      ]);

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
    let slate = this.svg.append("g");
    let builder = new ProteinBuilder(data, slate, this.scale);
    let protein = builder.build();
    this.fit(slate);
    return protein;
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

class FormOptions {
  static get INTERPOLATORS() {
    return [
      {
        Diverging: [
          "BrBG",
          "PRGn",
          "PiYG",
          "PuOr",
          "RdBu",
          "RdBu",
          "RdYlBu",
          "RdYlGn",
          "Spectral"
        ]
      },
      {
        "Sequential (single hue)": [
          "Blues",
          "Greens",
          "Greys",
          "Oranges",
          "Purples",
          "Reds"
        ]
      },
      {
        "Sequential (multi hue)": [
          "Viridis",
          "Inferno",
          "Magma",
          "Plasma",
          "Warm",
          "Cool",
          "CubehelixDefault",
          "BuGn",
          "BuPu",
          "GnBu",
          "OrRd",
          "PuBuGn",
          "PuBu",
          "PuRd",
          "RdPu",
          "YlGnBu",
          "YlGn",
          "YlOrBr",
          "YlOrRd"
        ]
      }
    ];
  }

  static selectedInterpolator() {
    return d3[
      "interpolate" + d3.select("select#heatmap-interpolator").node().value
    ];
  }

  static populateInterpolatorField() {
    let heatmapInterpSelect = $("select#heatmap-interpolator");
    $.each(FormOptions.INTERPOLATORS, function(i, optgroup) {
      $.each(optgroup, function(groupName, options) {
        let currentGroup = $("<optgroup>", { label: groupName });
        currentGroup.appendTo(heatmapInterpSelect);
        $.each(options, function(j, option) {
          let $option = $("<option>", {
            text: option,
            value: option,
            "data-content":
              `<img ` +
              `src="./static/images/${option}.png" ` +
              `style="width:200px;height:1rem;">`
          });
          $option.appendTo(currentGroup);
        });
      });
    });
  }
}

class ProteinBuilder {
  constructor(data, svg, scale) {
    this.protein = new Protein(data, svg, scale);
  }

  build() {
    this.protein.drawBackbone();
    this.protein.drawMotifs();
    this.protein.drawRegions();
    this.protein.drawMarkupLines();
    this.protein.drawMarkupLabels();
    this.protein.drawHeatmap();
    return this.protein;
  }
}

class Protein {
  constructor(data, svg, scale) {
    this.BACKBONE_Y = 0;
    this.BACKBONE_HEIGHT = 10;
    this.MOTIF_HEIGHT = this.BACKBONE_HEIGHT * 2;
    this.MOTIF_OPACITY = 0.65;
    this.REGION_HEIGHT = this.BACKBONE_HEIGHT * 3.5;
    this.REGION_OPACITY = 0.9;
    this.REGION_RECT_RADIUS = 16;
    this.MARKUP_HEIGHT = this.REGION_HEIGHT;
    this.MARKUP_Y = this.BACKBONE_Y - this.MARKUP_HEIGHT;
    this.HEATMAP_Y = this.BACKBONE_Y + this.MARKUP_HEIGHT * 2;
    this.HEATMAP_CELL_WIDTH = this.MOTIF_HEIGHT * 1.2;
    this.HEATMAP_CELL_HEIGHT = this.MOTIF_HEIGHT * 1.2;
    this.MARKUP_STROKE_WIDTH = 2;

    this.data = data;
    this.svg = svg;
    this.scale = scale;
    this.hasHeatmap = false;
    this.hasMarkup = false;
  }

  drawBackbone() {
    this.svg
      .append("rect")
      .attr("x", 0)
      .attr("y", this.BACKBONE_Y - this.BACKBONE_HEIGHT / 2)
      .attr("width", this.scale(this.data.length))
      .attr("height", this.BACKBONE_HEIGHT)
      .attr("fill", "grey");
  }

  drawMotifs() {
    this.svg
      .selectAll("motif")
      .data(this.data.motifs.filter(d => d.display !== false))
      .enter()
      .append("rect")
      .attr("x", motif => this.scale(motif.start))
      .attr("y", motif => this.BACKBONE_Y - this.MOTIF_HEIGHT / 2)
      .attr("width", motif => this.scale(motif.end - motif.start))
      .attr("height", this.MOTIF_HEIGHT)
      .style("fill", motif => motif.colour)
      .style("fill-opacity", this.MOTIF_OPACITY);
  }

  drawRegions() {
    let regions = this.svg
      .selectAll("region")
      .data(this.data.regions.filter(d => d.display !== false))
      .enter()
      .append("g");

    regions
      .append("rect")
      .attr("rx", this.REGION_RECT_RADIUS)
      .attr("ry", this.REGION_RECT_RADIUS)
      .attr("x", region => this.scale(region.start))
      .attr("y", this.BACKBONE_Y - this.REGION_HEIGHT / 2)
      .attr("width", region => this.scale(region.end - region.start))
      .attr("height", this.REGION_HEIGHT)
      .style("fill", region => region.colour)
      .style("fill-opacity", this.REGION_OPACITY)
      .style("stroke", "black");

    let regionLabels = regions
      .append("text")
      .attr("x", region => this.scale(region.start))
      .attr("y", this.BACKBONE_Y - this.REGION_HEIGHT / 2)
      .attr("dy", this.REGION_HEIGHT * 2)
      .text(region => region.metadata.identifier);

    // Remove any labels which intersect a former label
    regionLabels.sort((a, b) => a.start - b.start).each(function() {
      const that = this;
      regionLabels.each(function() {
        if (this !== that && intersects(this, that)) {
          d3.select(this).remove();
        }
      });
    });
  }

  drawMarkupLines() {
    let markup_display = this.data.markups.filter(
      markup => markup.display !== false
    );

    if (markup_display.length > 0) {
      this.hasMarkup = true;
    }

    this.svg
      .selectAll("markup")
      .data(markup_display)
      .enter()
      .append("line")
      .attr("x1", markup => this.scale(markup.start))
      .attr("y1", this.BACKBONE_Y)
      .attr("x2", markup => this.scale(markup.start))
      .attr("y2", this.MARKUP_Y)
      .attr("stroke", markup => markup.lineColour)
      .attr("stroke-width", this.MARKUP_STROKE_WIDTH);
  }

  drawMarkupLabels() {
    let markupLabels = this.svg
      .selectAll("markup-label")
      .data(this.data.markups.filter(markup => markup.display !== false))
      .enter()
      .append("text")
      .text(markup => markup.start)
      .attr("x", markup => this.scale(markup.start))
      .attr("y", this.MARKUP_Y)
      .attr(
        "transform",
        d => `rotate(270, ${this.scale(d.start)}, ${this.MARKUP_Y})`
      );

    // Update label locations to prevent overlap
    markupLabels.sort((a, b) => a.start - b.start).each(function() {
      const that = this;
      markupLabels.each(function() {
        if (this !== that && intersects(this, that)) {
          // Move this element upward
          let currentX = d3.select(this).attr("x");
          let delta = that.getBBox().width * 1.4;
          d3.select(this).attr("x", +currentX + delta);
        }
      });
    });
  }

  drawHeatmap() {
    let _this = this;
    let scale = this.scale;
    let scale_chromatic = d3
      .scaleSequential(FormOptions.selectedInterpolator())
      .domain([
        d3.select("#heatmap-range-min").node().value,
        d3.select("#heatmap-range-max").node().value
      ]);

    let markup_display = this.data.markups.filter(
      markup => markup.display !== false
    );
    let heatmap_column = this.svg
      .selectAll("heatmap_column")
      .data(markup_display)
      .enter()
      .append("g")
      .attr(
        "transform",
        d => `translate(${scale(d.start)}, ${this.HEATMAP_Y})`
      );

    heatmap_column.each(function(markup) {
      if (markup.heatmap_values) {
        _this.hasHeatmap = true;
        d3.select(this)
          .selectAll("heatmap_values")
          .data(markup.heatmap_values)
          .enter()
          .append("rect")
          .attr("y", (d, index) => _this.HEATMAP_CELL_HEIGHT * index)
          .attr("height", _this.HEATMAP_CELL_HEIGHT)
          .attr("width", _this.HEATMAP_CELL_WIDTH)
          .attr("fill", value => scale_chromatic(value));
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
            `translate(${thatLeft + _this.HEATMAP_CELL_WIDTH}, ${
              _this.HEATMAP_Y
            })`
          );
        }
      });
    });

    // Add heatmap label to last heatmap column
    const lastHeatMapColumn = heatmap_column.nodes()[heatmap_column.size() - 1];
    d3.select(lastHeatMapColumn).each(function(markup) {
      if (markup.heatmap_labels) {
        d3.select(this)
          .selectAll("heatmap_labels")
          .data(markup.heatmap_labels)
          .enter()
          .append("text")
          .attr("x", _this.HEATMAP_CELL_WIDTH * 2)
          .attr("y", (d, index) => _this.HEATMAP_CELL_HEIGHT * (index + 1))
          .text(d => d);
      }
    });
  }
}

d3.select("#download-png-white").on("click", function() {
  const canvas = new Canvas();
  const filename = context.map(d => d.metadata.identifier).join("-");
  saveSvgAsPng(canvas.svg.node(), filename, {
    scale: 2,
    backgroundColor: "#FFFFFF"
  });
});

d3.select("#download-png-transparent").on("click", function() {
  const canvas = new Canvas();
  const filename = context.map(d => d.metadata.identifier).join("-");
  saveSvgAsPng(canvas.svg.node(), filename, { scale: 2 });
});

d3.select("#download-svg").on("click", function() {
  let canvas = new Canvas();
  let filename = context.map(d => d.metadata.identifier).join("-");
  saveSvg(canvas.svg.node(), filename);
});

d3.select("#update").on("click", function() {
  let canvas = new Canvas();
  canvas.clear();
  setupCanvas(canvas);
});

function setupCanvas(canvas) {
  let maxLength = d3.max(context, d => d.length);
  canvas.addScale(maxLength);
  for (let i = 0; i < context.length; i++) {
    let protein = canvas.addProtein(context[i]);
    canvas.addMotifLegend(context[i]);
    if (protein.hasMarkup) {
      canvas.addMarkupLegend(context[i]);
    }
    if (protein.hasHeatmap) {
      canvas.addHeatmapLegend(context[i]);
    }
  }
  canvas.expand();
}

function setupForm() {
  FormOptions.populateInterpolatorField();
}

setupForm();
setupCanvas(new Canvas());
