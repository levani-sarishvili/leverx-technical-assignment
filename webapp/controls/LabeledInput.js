sap.ui.define(
  ["sap/ui/core/Control", "sap/m/Label", "sap/m/Input"],
  function (Control, Label, Input) {
    "use strict";

    return Control.extend("levani.sarishvili.controls.LabeledInput", {
      metadata: {
        properties: {
          label: { type: "string", defaultValue: "" },
          value: { type: "string", defaultValue: "" },
          placeholder: { type: "string", defaultValue: "" },
          required: { type: "boolean", defaultValue: false },
          width: { type: "sap.ui.core.CSSSize", defaultValue: "100%" },
        },
        aggregations: {
          _label: {
            type: "sap.m.Label",
            multiple: false,
            visibility: "hidden",
          },
          _input: {
            type: "sap.m.Input",
            multiple: false,
            visibility: "hidden",
          },
        },
        events: {
          change: {
            parameters: {
              value: { type: "string" },
            },
          },
        },
      },

      // initialize the control
      init: function () {
        this.setAggregation("_label", new Label());
        this.setAggregation(
          "_input",
          new Input({
            liveChange: function (oEvent) {
              this.setValue(oEvent.getParameter("value"));
              this.fireChange({ value: oEvent.getParameter("value") });
            }.bind(this),
          })
        );
      },

      setValue: function (sValue) {
        this.setProperty("value", sValue, true);
        this.getAggregation("_input").setValue(sValue);
      },

      setLabel: function (sText) {
        this.setProperty("label", sText, true);
        this.getAggregation("_label").setText(
          sText + (this.getRequired() ? " *" : "")
        );
      },

      setPlaceholder: function (sText) {
        this.setProperty("placeholder", sText, true);
        this.getAggregation("_input").setPlaceholder(sText);
      },

      setRequired: function (bRequired) {
        this.setProperty("required", bRequired, true);
        this.getAggregation("_label").setText(
          this.getLabel() + (bRequired ? " *" : "")
        );
      },

      renderer: function (oRM, oControl) {
        oRM.openStart("div", oControl);
        oRM.class("labeledInputWrapper");
        oRM.style("width", oControl.getWidth());
        oRM.openEnd();

        oRM.renderControl(oControl.getAggregation("_label"));
        oRM.renderControl(oControl.getAggregation("_input"));

        oRM.close("div");
      },
    });
  }
);
