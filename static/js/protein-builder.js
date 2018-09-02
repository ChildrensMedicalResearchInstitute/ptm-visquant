class ProteinBuilder {
  constructor(data, svg, scale) {
    this.protein = new Protein(data, svg, scale);
  }

  build(trialIndex) {
    this.protein.drawBackbone();
    this.protein.drawMotifs();
    this.protein.drawRegions();

    const visType = FormOptions.selectedVisType();
    if (visType === "heatmap") {
      this.protein.drawMarkupLines();
      this.protein.drawMarkupLabels();
      this.protein.drawHeatmap();
    } else if (visType === "lollipop") {
      this.protein.drawMarkupLollipops(trialIndex);
    }
    return this.protein;
  }
}
