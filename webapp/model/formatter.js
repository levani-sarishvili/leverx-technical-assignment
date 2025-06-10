sap.ui.define(["levani/sarishvili/constants/Constants"], function (Constants) {
  "use strict";

  return {
    formatActiveFilters: function (aActiveFilters, sMode) {
      if (!aActiveFilters || aActiveFilters.length === 0) {
        return "No filters active";
      }

      const iCount = aActiveFilters.length;

      // Expanded mode
      if (sMode === Constants.oHeaderModes.EXPANDED) {
        return iCount === 1 ? "1 filter active" : `${iCount} filters active`;
      }
      // Snapped mode
      if (sMode === Constants.oHeaderModes.SNAPPED) {
        return iCount === 1
          ? `1 filter active: ${aActiveFilters[0]}`
          : `${iCount} filters active: ${aActiveFilters.join(", ")}`;
      }

      return `${iCount} filter${iCount > 1 ? "s" : ""} active`;
    },

    /**
     * Formats a given Date object to a string with the pattern "yyyy-MM-dd".
     *
     * @param {Date} oDate - The Date object to format.
     * @returns {string} The formatted string, e.g. "2022-07-01".
     */
    formatDate: function (oDate) {
      if (!oDate) return "";

      // Convert to Date object if it's a string
      if (typeof oDate === "string") {
        oDate = new Date(oDate);
      }

      // Format the date as "yyyy-MM-dd"
      const oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
        pattern: "yyyy-MM-dd",
      });

      return oDateFormat.format(oDate);
    },

    /**
     * Maps an order status to a semantic color.
     * @param {string} sStatus - The order status to map.
     * @returns {string} A semantic color as a string (e.g., "Success", "Warning", "Error", or "None").
     */
    formatOrderStatus: function (sStatus) {
      if (!sStatus) return;
      switch (sStatus) {
        case Constants.oOrderStatuses.DELIVERED:
          return "Success";
        case Constants.oOrderStatuses.PROCESSING:
          return "Warning";
        case Constants.oOrderStatuses.SHIPPED:
          return "Success";
        case Constants.oOrderStatuses.CANCELLED:
          return "Error";
        default:
          return "None";
      }
    },

    /**
     * Maps a stock status to a semantic color.
     * @param {string} sStatus - The stock status to map.
     * @returns {string} A semantic color as a string (e.g., "Success", "Warning", "Error", or "None").
     */
    formatStockStatus: function (sStatus) {
      if (!sStatus) return;
      switch (sStatus) {
        case Constants.oStockStatuses.IN_STOCK:
          return "Success";
        case Constants.oStockStatuses.LESS_THAN_10_LEFT:
          return "Warning";
        case Constants.oStockStatuses.OUT_OF_STOCK:
          return "Error";
        default:
          return "None";
      }
    },
  };
});
