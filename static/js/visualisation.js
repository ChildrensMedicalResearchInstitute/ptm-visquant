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
var MARKUP_STROKE_WIDTH = 2;

var PIXELS_PER_AMINO_ACID = 3;
var TICK_STEP = 50;
var CANVAS_WIDTH = context.length * PIXELS_PER_AMINO_ACID;
var CANVAS_HEIGHT = BACKBONE_Y * 2;

class Config {
  constructor() {}
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

    regions
      .append("text")
      .attr("x", region => this.scale(region.start))
      .attr("y", BACKBONE_Y - REGION_HEIGHT / 2)
      .attr("dy", REGION_HEIGHT * 2)
      .text(region => region.metadata.identifier);
  }

  drawMarkup() {
    this.svg
      .selectAll("markup")
      .data(this.data.markups.filter(markup => markup.display !== false))
      .enter()
      .append("line")
      .attr("x1", markup => this.scale(markup.start))
      .attr("y1", BACKBONE_Y)
      .attr("x2", markup => this.scale(markup.start))
      .attr("y2", MARKUP_Y)
      .attr("stroke", markup => markup.lineColour)
      .attr("stroke-width", MARKUP_STROKE_WIDTH);
  }

  drawLabels() {
    let markupLabels = this.svg
      .selectAll("markup-label")
      .data(this.data.markups.filter(markup => markup.display !== false))
      .enter()
      .append("text")
      .text(markup => markup.start)
      .attr("x", markup => this.scale(markup.start))
      .attr("y", MARKUP_Y);

    // Return true if bounding box 1 intersects bounding box 2, else return false.
    function intersects(bbox1, bbox2) {
      return !(
        bbox2.x > bbox1.x + bbox1.width ||
        bbox2.x + bbox2.width < bbox1.x ||
        bbox2.y > bbox1.y + bbox1.height ||
        bbox2.y + bbox2.height < bbox1.y
      );
    }

    // Update label locations to prevent overlap
    markupLabels.sort((a, b) => a.start - b.start).each(function() {
      let that = this;
      markupLabels.each(function() {
        let thisBBox = this.getBBox();
        if (that != this && intersects(thisBBox, that.getBBox())) {
          let currentHeight = d3.select(that).attr("y");
          let delta = thisBBox.height * 1.1;
          d3.select(this).attr("y", +currentHeight - delta);
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

d3.select("#download").on("click", function() {
  saveSvg(main.svg.node(), main.data.metadata.identifier);
});

d3.select("#update").on("click", function() {
  main.svg.remove();
  PIXELS_PER_AMINO_ACID = d3.select("#aa-per-pixel").node().value;
  TICK_STEP = d3.select("#tick-step").node().value;
  CANVAS_WIDTH = main.data.length * PIXELS_PER_AMINO_ACID;
  main = new Protein(context);
  main.draw();
});
