
// MAGIC NUMBERS
var BACKBONE_Y = 50;
var BACKBONE_HEIGHT = 8;
var MOTIF_HEIGHT = BACKBONE_HEIGHT * 2;
var MOTIF_OPACITY = 0.65;
var REGION_HEIGHT = BACKBONE_HEIGHT * 3.5;
var REGION_OPACITY = 0.90;
var REGION_RECT_RADIUS = 16;
var MARKUP_HEIGHT = REGION_HEIGHT;
var MARKUP_STROKE_WIDTH = 2;

var PIXELS_PER_AMINO_ACID = 3;
var TICK_STEP = 50;
var CANVAS_WIDTH = context.length * PIXELS_PER_AMINO_ACID;
var CANVAS_HEIGHT = BACKBONE_Y * 2;

var scaleCoordToCanvas = d3.scaleLinear()
  .domain([0, context.length])
  .range([0, CANVAS_WIDTH]);

var svg = d3.select('div.vis-box')
  .append('svg')
  .attr('width', CANVAS_WIDTH)
  .attr('height', CANVAS_HEIGHT);

var xAxis = d3.axisBottom(scaleCoordToCanvas)
  .tickValues(d3.range(0, context.length, TICK_STEP));
var xAxisGroup = svg.append("g")
  .call(xAxis)

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
  .attr('x', motif => scaleCoordToCanvas(motif.start))
  .attr('y', motif => BACKBONE_Y - MOTIF_HEIGHT/2)
  .attr('width', motif => scaleCoordToCanvas(motif.end - motif.start))
  .attr('height', MOTIF_HEIGHT)
  .style('fill', motif => motif.colour)
  .style('fill-opacity', MOTIF_OPACITY);

var regions = svg.selectAll('region')
  .data(context.regions.filter(
    region => region.display !== false
  )).enter()
  .append('g');

regions.append('rect')
  .attr("rx", REGION_RECT_RADIUS)
  .attr("ry", REGION_RECT_RADIUS)
  .attr('x', region => scaleCoordToCanvas(region.start))
  .attr('y', BACKBONE_Y - REGION_HEIGHT/2)
  .attr('width', region => scaleCoordToCanvas(region.end - region.start))
  .attr('height', REGION_HEIGHT)
  .style('fill', region => region.colour)
  .style('fill-opacity', REGION_OPACITY)
  .style('stroke', 'black');

regions.append('text')
  .attr("x", region => scaleCoordToCanvas(region.start))
  .attr("y", BACKBONE_Y - REGION_HEIGHT/2)
  .attr("dy", REGION_HEIGHT * 2)
  .text(region => region.metadata.identifier);

if (context.hasOwnProperty('markups')) {
  var markup = svg.selectAll('markup')
    .data(context.markups.filter(
      markup => markup.display !== false
    )).enter()
    .append('line')
    .attr('x1', markup => scaleCoordToCanvas(markup.start))
    .attr('y1', BACKBONE_Y)
    .attr('x2', markup => scaleCoordToCanvas(markup.start))
    .attr('y2', BACKBONE_Y - MARKUP_HEIGHT)
    .attr('stroke', markup => markup.lineColour)
    .attr('stroke-width', MARKUP_STROKE_WIDTH);
}
