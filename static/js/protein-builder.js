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
      this.protein.drawMarkupLollipopsScale(trialIndex);
      if (trialIndex === 0) {
        const markup_with_intensities = this.protein.data.markups.filter(
          d => d.intensity_values.length !== 0
        );
        this.protein.drawMarkupLabels(markup_with_intensities);
      }
    }
    return this.protein;
  }
}
