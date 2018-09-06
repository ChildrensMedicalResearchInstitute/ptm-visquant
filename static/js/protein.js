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
    this.hasMotifs = false;
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
    if (this.data.motifs.length > 0) {
      this.hasMotifs = true;
    }

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

  drawMarkupLollipops(trialIndex) {
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
      .attr(
        "y2",
        markup => markup.intensity_values[trialIndex] * -this.MARKUP_HEIGHT
      )
      .attr("stroke", function(markup) {
        if (FormOptions.lollipopColourByValue()) {
          return markup.intensity_values[trialIndex] > 0 ? "RED" : "SEAGREEN";
        }
        return markup.lineColour;
      })
      .attr("stroke-width", this.MARKUP_STROKE_WIDTH);

    this.svg
      .selectAll("markup")
      .data(markup_display)
      .enter()
      .append("circle")
      .attr("cx", markup => this.scale(markup.start))
      .attr(
        "cy",
        markup => markup.intensity_values[trialIndex] * -this.MARKUP_HEIGHT
      )
      .attr("r", 4)
      .attr("fill", function(markup) {
        if (FormOptions.lollipopColourByValue()) {
          return markup.intensity_values[trialIndex] > 0 ? "RED" : "SEAGREEN";
        }
        return markup.lineColour;
      })
      .attr("stroke", "white");
  }

  drawHeatmap() {
    let _this = this;
    let scale = this.scale;
    let scale_chromatic = d3
      .scaleSequential(FormOptions.selectedInterpolator())
      .domain([FormOptions.heatmapMin(), FormOptions.heatmapMax()]);

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
      if (markup.intensity_values) {
        _this.hasHeatmap = true;
        d3.select(this)
          .selectAll("heatmap_values")
          .data(markup.intensity_values)
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
      if (markup.intensity_labels) {
        d3.select(this)
          .selectAll("heatmap_labels")
          .data(markup.intensity_labels)
          .enter()
          .append("text")
          .attr("x", _this.HEATMAP_CELL_WIDTH * 2)
          .attr("y", (d, index) => _this.HEATMAP_CELL_HEIGHT * (index + 1))
          .text(d => d);
      }
    });
  }
}
