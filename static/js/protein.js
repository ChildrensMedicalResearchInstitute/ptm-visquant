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

function hasIntensityValues(data) {
  for (markup of data.markups) {
    if (markup.intensity_values) {
      return true;
    }
  }
  return false;
}

function filterForUniqueStartSite(data) {
  return data.markups.filter(function(m, index) {
    return data.markups.findIndex(n => n.start === m.start) === index;
  });
}

// Returns an array of tick values from start to stop, by step.
// The range will extend to include zero. For example, (2, 3, 1) => [0, 1, 2, 3]
function tickValuesInRange(start, stop, step) {
  let values = [0];
  if (step <= 0) {
    return values;
  }
  for (let i = 1; i * step <= stop; i++) {
    values.push(i * step);
  }
  for (let i = -1; i * step >= start; i--) {
    values.push(i * step);
  }
  return values;
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

function describeMarkup(markup, index = 0) {
  return `
    type: ${markup.peptide_type_sequence}<br>
    coordinate: ${markup.peptide_coordinate_sequence}<br>
    trial: ${markup.intensity_labels[index]}<br>
    intensity: ${markup.intensity_values[index]}<br>
  `;
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
    this.MARKUP_STROKE_WIDTH = 2;

    this.data = data;
    this.svg = svg;
    this.scale = scale;
    this.hasMotifs = false;
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
  }

  drawRegionLabels() {
    let regions = this.svg
      .selectAll("region")
      .data(this.data.regions.filter(d => d.display !== false))
      .enter()
      .append("g");

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
    const markup_display = filterForUniqueStartSite(this.data);
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
    const markup_display = filterForUniqueStartSite(this.data);
    const LABEL_HEIGHT = this.svg.node().getBBox().y - 10;

    let markupCoordinateContainer = this.svg
      .selectAll("markup-coordinate-container")
      .data(markup_display)
      .enter()
      .append("g")
      .attr(
        "transform",
        d => `translate(${this.scale(d.start)}, ${LABEL_HEIGHT})`
      );

    markupCoordinateContainer
      .append("text")
      .text(markup => markup.start)
      .attr("transform", function() {
        return `rotate(270, 0, ${-this.getBBox().height / 2})`;
      });

    // Update label locations to prevent overlap
    markupCoordinateContainer
      .sort((a, b) => a.start - b.start)
      .each(function() {
        const that = this;
        markupCoordinateContainer.each(function() {
          if (this !== that && intersects(this, that)) {
            // Move this element upward
            const currentTranslation = getTranslation(
              d3.select(this).attr("transform")
            );
            const delta = that.getBBox().height * 1.4;
            d3.select(this).attr(
              "transform",
              `translate(
                ${currentTranslation[0]}, ${currentTranslation[1] - delta}
              )`
            );
          }
        });
      });

    markupCoordinateContainer
      .call(
        d3
          .drag()
          .on("start", dragstart)
          .on("drag", drag)
      )
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);

    function dragstart() {
      d3.select(this).raise();
    }

    function drag() {
      d3.select(this).attr(
        "transform",
        `translate(${d3.event.x}, ${d3.event.y})`
      );
    }

    function mouseover() {
      d3.select(this).style("cursor", "pointer");
    }

    function mouseout() {
      d3.select(this).style("cursor", "default");
    }
  }

  drawMarkupLollipops(trialIndex) {
    let markup_display = this.data.markups;
    if (markup_display.length > 0) {
      this.hasMarkup = true;
    }
    const heightScale = FormOptions.lollipopScale() / 100;

    let lollipopStems = this.svg
      .selectAll("markup")
      .data(markup_display)
      .enter()
      .append("line")
      .attr("x1", markup => this.scale(markup.start))
      .attr("y1", this.BACKBONE_Y)
      .attr("x2", markup => this.scale(markup.start))
      .attr(
        "y2",
        markup =>
          markup.intensity_values[trialIndex] *
          -this.MARKUP_HEIGHT *
          heightScale
      )
      .attr("stroke", function(markup) {
        if (FormOptions.lollipopColourByValue()) {
          return markup.intensity_values[trialIndex] > 0 ? "RED" : "SEAGREEN";
        }
        return markup.lineColour;
      })
      .attr("stroke-width", this.MARKUP_STROKE_WIDTH);

    let tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    let lollipopTops = this.svg
      .selectAll("markup")
      .data(markup_display)
      .enter()
      .append("circle")
      .attr("cx", markup => this.scale(markup.start))
      .attr(
        "cy",
        markup =>
          markup.intensity_values[trialIndex] *
          -this.MARKUP_HEIGHT *
          heightScale
      )
      .attr("r", 4)
      .attr("fill", function(markup) {
        if (FormOptions.lollipopColourByValue()) {
          return markup.intensity_values[trialIndex] > 0 ? "RED" : "SEAGREEN";
        }
        return markup.lineColour;
      })
      .attr("stroke", "white")
      .on("mouseover", function(d) {
        d3.select(this).raise();
        tooltip.style("opacity", 0.8);
        tooltip
          .html(describeMarkup(d, trialIndex))
          .style("left", d3.event.pageX + 20 + "px")
          .style("top", d3.event.pageY + "px");
      })
      .on("mouseout", function(d) {
        tooltip.style("opacity", 0);
      });

    // Add label to end of protein
    const labels = this.data.markups[0].intensity_labels;
    this.svg
      .append("text")
      .attr("x", 20 + this.scale(this.data.length))
      .attr("y", 6)
      .text(labels[trialIndex]);
  }

  drawMarkupLollipopsScale(trialIndex) {
    const heightScale =
      (FormOptions.lollipopScale() / 100) * -this.MARKUP_HEIGHT;
    const lollipopRange = d3.extent(
      this.data.markups.map(m => m.intensity_values[trialIndex]).concat([0])
    );
    const lollipopScale = d3
      .scaleLinear()
      .domain(lollipopRange)
      .range([lollipopRange[0] * heightScale, lollipopRange[1] * heightScale]);
    let yAxis = d3
      .axisLeft(lollipopScale)
      .tickValues(
        tickValuesInRange(
          ...lollipopRange,
          FormOptions.lollipopAxisTickDistance()
        )
      );
    this.svg.append("g").call(yAxis);
  }
}
