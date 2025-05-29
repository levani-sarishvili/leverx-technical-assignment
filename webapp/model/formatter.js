sap.ui.define(["sap/ui/core/format/DateFormat"], function (DateFormat) {
  "use strict";

  return {
    // Formatter for product price
    formatPrice: function (sPrice) {
      if (sPrice) {
        return parseFloat(sPrice) + " USD";
      }
      return "";
    },

    // Format date from data picker
    _formatDate: function (oDate) {
      if (!oDate) return "";
      const oDateFormat = DateFormat.getDateInstance({
        pattern: "yyyy-MM-dd",
      });
      return oDateFormat.format(oDate);
    },
  };
});
