
// MAGIC NUMBERS
var PIXELS_PER_AMINO_ACID = 3;
var BACKBONE_Y = 50;
var BACKBONE_HEIGHT = 8;
var MOTIF_HEIGHT = BACKBONE_HEIGHT * 2;
var MOTIF_OPACITY = 0.65;
var REGION_HEIGHT = BACKBONE_HEIGHT * 3.5;
var REGION_OPACITY = 0.90;
var REGION_RECT_RADIUS = 16;

var CANVAS_WIDTH = context.length * PIXELS_PER_AMINO_ACID;
var CANVAS_HEIGHT = BACKBONE_Y * 2;

// Map number from in range to out range
function mapToRange(number, in_min, in_max, out_min, out_max) {
  return (number - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

// Map coordinate on protein to x-value on canvas
function mapToCanvas(coordinate) {
  return mapToRange(coordinate, 0, context.length, 0, CANVAS_WIDTH);
}

var svg = d3.select('div.vis-box')
  .append('svg')
  .attr('width', CANVAS_WIDTH)
  .attr('height', CANVAS_HEIGHT);

var backbone = svg.append('rect')
  .attr('x', 0)
  .attr('y', BACKBONE_Y - BACKBONE_HEIGHT/2)
  .attr('width', CANVAS_WIDTH)
  .attr('height', BACKBONE_HEIGHT)
  .attr('fill', 'grey');

var motifs = svg.selectAll('motif')
  .data(context.motifs.filter(
    motif => motif.display !== false
  )).enter()
  .append('rect')
  .attr('x', motif => mapToCanvas(motif.start))
  .attr('y', motif => BACKBONE_Y - MOTIF_HEIGHT/2)
  .attr('width', motif => mapToCanvas(motif.end - motif.start))
  .attr('height', MOTIF_HEIGHT)
  .style('fill', motif => motif.colour)
  .style('fill-opacity', MOTIF_OPACITY);

var regions = svg.selectAll('region')
  .data(context.regions.filter(
    region => region.display !== false
  )).enter()
  .append('rect')
  .attr("rx", REGION_RECT_RADIUS)
  .attr("ry", REGION_RECT_RADIUS)
  .attr('x', region => mapToCanvas(region.start))
  .attr('y', BACKBONE_Y - REGION_HEIGHT/2)
  .attr('width', region => mapToCanvas(region.end - region.start))
  .attr('height', REGION_HEIGHT)
  .style('fill', region => region.colour)
  .style('fill-opacity', REGION_OPACITY)
  .style('stroke', region => region.colour);
