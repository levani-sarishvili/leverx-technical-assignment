sap.ui.define(["sap/ui/core/UIComponent"], function (UIComponent) {
  "use strict";

  return UIComponent.extend("levani.sarishvili.Component", {
    metadata: {
      manifest: "json",
    },

    /**
     * Initializes the component.
     *
     * This is the entry point for the component. All component-specific
     * initialization is done here.
     *
     * @public
     */
    init: function () {
      UIComponent.prototype.init.call(this);
      this.getRouter().initialize();
    },
  });
});
