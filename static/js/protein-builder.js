class ProteinBuilder {
  constructor(data, svg, scale) {
    this.protein = new Protein(data, svg, scale);
  }

  build(trialIndex) {
    this.protein.drawBackbone();
    this.protein.drawMotifs();
    this.protein.drawRegions();
    if (trialIndex === 0) {
      this.protein.drawRegionLabels();
    }

    const visType = FormOptions.selectedVisType();
    if (visType === "heatmap") {
      this.protein.drawMarkupLines();
      this.protein.drawMarkupLabels();
    } else if (visType === "lollipop") {
      this.protein.drawMarkupLollipops(trialIndex);
      if (trialIndex === 0) {
        this.protein.drawMarkupLabels();
      }
    }
    return this.protein;
  }
}
