// MAGIC NUMBERS
var BACKBONE_Y = 200;
var BACKBONE_HEIGHT = 8;
var MOTIF_HEIGHT = BACKBONE_HEIGHT * 2;
var MOTIF_OPACITY = 0.65;
var REGION_HEIGHT = BACKBONE_HEIGHT * 3.5;
var REGION_OPACITY = 0.9;
var REGION_RECT_RADIUS = 16;
var MARKUP_HEIGHT = REGION_HEIGHT;
var MARKUP_Y = BACKBONE_Y - MARKUP_HEIGHT;
var VALUES_Y = BACKBONE_Y + MARKUP_HEIGHT * 2;
var VALUES_WIDTH = MOTIF_HEIGHT;
var VALUES_HEIGHT = MOTIF_HEIGHT;
var MARKUP_STROKE_WIDTH = 2;

var PIXELS_PER_AMINO_ACID = 3;
var TICK_STEP = 50;
var CANVAS_WIDTH = context.length * PIXELS_PER_AMINO_ACID;
var CANVAS_HEIGHT = BACKBONE_Y * 2;

function intersects(r1, r2) {
  return !(
    r2.left >= r1.right ||
    r2.right <= r1.left ||
    r2.top >= r1.bottom ||
    r2.bottom <= r1.top
  );
}

class Protein {
  constructor(data, config) {
    this.data = data;
    this.config = config;
    this.svg = d3
      .select("div.vis-box")
      .append("svg")
      .attr("width", CANVAS_WIDTH)
      .attr("height", CANVAS_HEIGHT);
    this.scale = d3
      .scaleLinear()
      .domain([0, this.data.length])
      .range([0, CANVAS_WIDTH]);
  }

  draw() {
    this.drawAxis();
    this.drawBackbone();
    this.drawLabels();
    this.drawMotifs();
    this.drawRegions();
    this.drawMarkup();
  }

  drawAxis() {
    let xAxis = d3
      .axisBottom(this.scale)
      .tickValues(d3.range(0, this.data.length, TICK_STEP));
    this.svg.append("g").call(xAxis);
  }

  drawBackbone() {
    this.svg
      .append("rect")
      .attr("x", 0)
      .attr("y", BACKBONE_Y - BACKBONE_HEIGHT / 2)
      .attr("width", CANVAS_WIDTH)
      .attr("height", BACKBONE_HEIGHT)
      .attr("fill", "grey");
  }

  drawMotifs() {
    this.svg
      .selectAll("motif")
      .data(this.data.motifs.filter(d => d.display !== false))
      .enter()
      .append("rect")
      .attr("x", motif => this.scale(motif.start))
      .attr("y", motif => BACKBONE_Y - MOTIF_HEIGHT / 2)
      .attr("width", motif => this.scale(motif.end - motif.start))
      .attr("height", MOTIF_HEIGHT)
      .style("fill", motif => motif.colour)
      .style("fill-opacity", MOTIF_OPACITY);

    // As defined by Pfam http://pfam.xfam.org/help#tabview=tab10
    var motifTypes = [
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
      .cellFilter(d => this.data.motifs.map(m => m.type).indexOf(d.label) > -1)
      .scale(legendScale);

    this.svg
      .append("g")
      .attr("class", "legendOrdinal")
      .attr("transform", "translate(20,50)")
      .call(legendStyle);
  }

  drawRegions() {
    let regions = this.svg
      .selectAll("region")
      .data(this.data.regions.filter(d => d.display !== false))
      .enter()
      .append("g");

    regions
      .append("rect")
      .attr("rx", REGION_RECT_RADIUS)
      .attr("ry", REGION_RECT_RADIUS)
      .attr("x", region => this.scale(region.start))
      .attr("y", BACKBONE_Y - REGION_HEIGHT / 2)
      .attr("width", region => this.scale(region.end - region.start))
      .attr("height", REGION_HEIGHT)
      .style("fill", region => region.colour)
      .style("fill-opacity", REGION_OPACITY)
      .style("stroke", "black");

    let regionLabels = regions
      .append("text")
      .attr("x", region => this.scale(region.start))
      .attr("y", BACKBONE_Y - REGION_HEIGHT / 2)
      .attr("dy", REGION_HEIGHT * 2)
      .text(region => region.metadata.identifier);

    // Remove any labels which intersect a former label
    regionLabels.sort((a, b) => a.start - b.start).each(function () {
      const that = this;
      regionLabels.each(function () {
        const thisBBox = this.getBoundingClientRect();
        const thatBBox = that.getBoundingClientRect();
        if (this !== that && intersects(thisBBox, thatBBox)) {
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
      .attr("y1", BACKBONE_Y)
      .attr("x2", markup => this.scale(markup.start))
      .attr("y2", MARKUP_Y)
      .attr("stroke", markup => markup.lineColour)
      .attr("stroke-width", MARKUP_STROKE_WIDTH);

    let scale_chromatic = d3.scaleSequential(d3.interpolatePurples);
    let heatmap_bars = this.svg
      .selectAll("heatmap")
      .data(markup_display)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${scale(d.start)}, ${VALUES_Y})`)

    heatmap_bars.each(function (markup) {
      d3.select(this)
        .selectAll("heatmap_values")
        .data(markup.heatmap_values)
        .enter()
        .append("rect")
        .attr("y", (d, index) => VALUES_HEIGHT * index)
        .attr("height", VALUES_HEIGHT)
        .attr("width", VALUES_WIDTH)
        .attr("fill", value => scale_chromatic(value));
    });

    function getTranslation(transform) {
      // Create a dummy g for calculation purposes only. This will never
      // be appended to the DOM and will be discarded once this function 
      // returns.
      var g = document.createElementNS("http://www.w3.org/2000/svg", "g");

      // Set the transform attribute to the provided string value.
      g.setAttributeNS(null, "transform", transform);

      // consolidate the SVGTransformList containing all transformations
      // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
      // its SVGMatrix. 
      var matrix = g.transform.baseVal.consolidate().matrix;

      // As per definition values e and f are the ones for the translation.
      return [matrix.e, matrix.f];
    }

    // Update heatmap locations to prevent overlap
    heatmap_bars.sort((a, b) => a.start - b.start).each(function () {
      const that = this;
      heatmap_bars.each(function () {
        const thisBBox = this.getBoundingClientRect();
        const thatBBox = that.getBoundingClientRect();
        if (this !== that && intersects(thisBBox, thatBBox)) {
          const thatLeft = getTranslation(d3.select(that).attr("transform"))[0]
          d3.select(this).attr("transform", `translate(${thatLeft + VALUES_WIDTH}, ${VALUES_Y})`);
        }
      });
    });
  }

  drawLabels() {
    let markupLabels = this.svg
      .selectAll("markup-label")
      .data(this.data.markups.filter(markup => markup.display !== false))
      .enter()
      .append("text")
      .text(markup => markup.start)
      .attr("x", markup => this.scale(markup.start))
      .attr("y", MARKUP_Y)
      .attr(
        "transform",
        d => `rotate(270, ${this.scale(d.start)}, ${MARKUP_Y})`
      );

    // Update label locations to prevent overlap
    markupLabels.sort((a, b) => a.start - b.start).each(function () {
      const that = this;
      markupLabels.each(function () {
        const thisBBox = this.getBoundingClientRect();
        const thatBBox = that.getBoundingClientRect();
        if (this !== that && intersects(thisBBox, thatBBox)) {
          let currentX = d3.select(this).attr("x");
          let delta = that.getBBox().width * 1.4;
          d3.select(this).attr("x", +currentX + delta);
        }
      });
    });
  }
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

let main = new Protein(context);
main.draw();

d3.select("#download").on("click", function () {
  saveSvg(main.svg.node(), main.data.metadata.identifier);
});

d3.select("#update").on("click", function () {
  main.svg.remove();
  PIXELS_PER_AMINO_ACID = d3.select("#aa-per-pixel").node().value;
  TICK_STEP = d3.select("#tick-step").node().value;
  CANVAS_WIDTH = main.data.length * PIXELS_PER_AMINO_ACID;
  main = new Protein(context);
  main.draw();
});
