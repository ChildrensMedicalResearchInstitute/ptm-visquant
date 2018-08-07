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

class Canvas {
  constructor() {
    this.scale = undefined;
    this.svg = d3.select("div.vis-box").append("svg");
    this.GROUP_PADDING = 40;
    this.CANVAS_HEIGHT = this.GROUP_PADDING;
  }

  addScale(data) {
    // TODO: Add scale logic from Rowena here
    this.scale = d3
      .scaleLinear()
      .domain([0, data.length])
      .range([0, 6000])

    let xAxis = d3.axisBottom(this.scale).ticks(10);
    this.svg.append("g").call(xAxis)
      .selectAll("text")
      .attr("y", 0)
      .attr("x", -10)
      .attr("dy", ".35em")
      .attr("transform", "rotate(270)")
      .style("text-anchor", "end");
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
      .scale(legendScale);

    let legend = this.svg
      .append("g")
      .attr("class", "legendOrdinal")
      .attr("transform", "translate(20,0)")
      .call(legendStyle);

    this.fit(legend);
  }

  addProtein(data) {
    let slate = this.svg.append("g");
    let builder = new ProteinBuilder(data, slate, this.scale);
    builder.build();
    this.fit(slate);
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
    element.attr("transform", `translate(${currentX}, ${this.CANVAS_HEIGHT - element.node().getBBox().y})`)
    this.CANVAS_HEIGHT += element.node().getBBox().height + this.GROUP_PADDING;
  }

  // Expand the canvas to fit all elements in this.svg
  expand() {
    this.svg
      .attr("width", this.svg.node().getBBox().width)
      .attr("height", this.svg.node().getBBox().height);
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
    this.protein.drawMarkup();
    this.protein.drawMarkupLabels();
  }
}

class Protein {
  constructor(data, svg, scale) {
    this.BACKBONE_Y = 0;
    this.BACKBONE_HEIGHT = 8;
    this.MOTIF_HEIGHT = this.BACKBONE_HEIGHT * 2;
    this.MOTIF_OPACITY = 0.65;
    this.REGION_HEIGHT = this.BACKBONE_HEIGHT * 3.5;
    this.REGION_OPACITY = 0.9;
    this.REGION_RECT_RADIUS = 16;
    this.MARKUP_HEIGHT = this.REGION_HEIGHT;
    this.MARKUP_Y = this.BACKBONE_Y - this.MARKUP_HEIGHT;
    this.HEATMAP_Y = this.BACKBONE_Y + this.MARKUP_HEIGHT * 2;
    this.HEATMAP_CELL_WIDTH = this.MOTIF_HEIGHT;
    this.HEATMAP_CELL_HEIGHT = this.MOTIF_HEIGHT;
    this.MARKUP_STROKE_WIDTH = 2;

    this.data = data;
    this.svg = svg;
    this.scale = scale;
  }

  drawBackbone() {
    this.svg
      .append("rect")
      .attr("x", 0)
      .attr("y", this.BACKBONE_Y - this.BACKBONE_HEIGHT / 2)
      .attr("width", this.scale.range()[1])
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
    regionLabels.sort((a, b) => a.start - b.start).each(function () {
      const that = this;
      regionLabels.each(function () {
        if (this !== that && intersects(this, that)) {
          d3.select(this).remove();
        }
      });
    });
  }

  drawMarkup() {
    let scale = this.scale;
    let markup_display = this.data.markups.filter(markup => markup.display !== false);

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

    let scale_chromatic = d3.scaleSequential(d3.interpolatePurples);
    let heatmap_bars = this.svg
      .selectAll("heatmap")
      .data(markup_display)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${scale(d.start)}, ${this.HEATMAP_Y})`)

    let _this = this;
    heatmap_bars.each(function (markup) {
      if (markup.heatmap_values) {
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
    heatmap_bars.sort((a, b) => a.start - b.start).each(function () {
      const that = this;
      heatmap_bars.each(function () {
        if (this !== that && intersects(this, that)) {
          const thatLeft = getTranslation(d3.select(that).attr("transform"))[0]
          d3.select(this).attr("transform", `translate(${thatLeft + _this.HEATMAP_CELL_WIDTH}, ${_this.HEATMAP_Y})`);
        }
      });
    });
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
    markupLabels.sort((a, b) => a.start - b.start).each(function () {
      const that = this;
      markupLabels.each(function () {
        if (this !== that && intersects(this, that)) {
          // Move this element upward
          let currentX = d3.select(this).attr("x");
          let delta = that.getBBox().width * 1.4;
          d3.select(this).attr("x", +currentX + delta);
        }
      });
    });
  }
}

let canvas = new Canvas();
canvas.addScale(context);
canvas.addProtein(context);
canvas.addMotifLegend(context);
canvas.expand();

d3.select("#download").on("click", function () {
  saveSvg(canvas.svg.node(), context.metadata.identifier);
});
