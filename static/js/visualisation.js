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
  const maxLength = d3.max(context, d => d.length);
  canvas.addScale(maxLength);
  for (let i = 0; i < context.length; i++) {
    canvas.addProtein(context[i]);
  }
  canvas.expand();
}

function setupForm() {
  if (hasFileUpload) {
    FormOptions.populateInterpolatorField();
  }
}

setupForm();
setupCanvas(new Canvas());
