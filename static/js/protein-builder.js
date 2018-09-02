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
    if (hasFileUpload) {
      this.protein.drawHeatmap();
    }
    return this.protein;
  }
}
