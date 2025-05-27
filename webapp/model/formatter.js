sap.ui.define([], function () {
  "use strict";

  return {
    formatPrice: function (sPrice) {
      if (sPrice) {
        return parseFloat(sPrice) + " USD";
      }
      return "";
    },
  };
});
