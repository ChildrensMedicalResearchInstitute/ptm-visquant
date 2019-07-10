class FormOptions {
  static get INTERPOLATORS() {
    return [
      {
        Diverging: [
          "BrBG",
          "PRGn",
          "PiYG",
          "PuOr",
          "RdBu",
          "RdBu",
          "RdYlBu",
          "RdYlGn",
          "Spectral"
        ]
      },
      {
        "Sequential (single hue)": [
          "Blues",
          "Greens",
          "Greys",
          "Oranges",
          "Purples",
          "Reds"
        ]
      },
      {
        "Sequential (multi hue)": [
          "Viridis",
          "Inferno",
          "Magma",
          "Plasma",
          "Warm",
          "Cool",
          "CubehelixDefault",
          "BuGn",
          "BuPu",
          "GnBu",
          "OrRd",
          "PuBuGn",
          "PuBu",
          "PuRd",
          "RdPu",
          "YlGnBu",
          "YlGn",
          "YlOrBr",
          "YlOrRd"
        ]
      }
    ];
  }

  static selectedVisType() {
    return $("#vis-type input:radio:checked").val();
  }

  static scaleZoomPercent() {
    return d3.select("#zoom-percent").node().value;
  }

  static scaleTickStep() {
    return d3.select("#tick-step").node().value;
  }

  static heatmapMin() {
    return d3.select("#heatmap-range-min").node().value;
  }

  static heatmapMax() {
    return d3.select("#heatmap-range-max").node().value;
  }

  static selectedInterpolator() {
    return d3[
      "interpolate" + d3.select("select#heatmap-interpolator").node().value
    ];
  }

  static lollipopColourByValue() {
    return $("#lollipop-colour-by-value").is(":checked");
  }

  static lollipopScale() {
    return d3.select("#lollipop-scale").node().value;
  }

  static lollipopAxisTickDistance() {
    return d3.select("#lollipop-axis-tick-step").node().value;
  }

  static populateInterpolatorField() {
    let heatmapInterpSelect = $("select#heatmap-interpolator");
    $.each(FormOptions.INTERPOLATORS, function(i, optgroup) {
      $.each(optgroup, function(groupName, options) {
        let currentGroup = $("<optgroup>", { label: groupName });
        currentGroup.appendTo(heatmapInterpSelect);
        $.each(options, function(j, option) {
          let $option = $("<option>", {
            text: option,
            value: option,
            "data-content":
              `<img ` +
              `src="./static/images/${option}.png" ` +
              `style="width:200px;height:1rem;">`
          });
          $option.appendTo(currentGroup);
        });
      });
    });
  }
}
