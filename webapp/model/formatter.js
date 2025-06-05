sap.ui.define(
  ["sap/ui/core/format/DateFormat", "levani/sarishvili/constants/Constants"],
  function (DateFormat, Constants) {
    "use strict";

    return {
      /**
       * Formats a given price string to a string with a USD currency label.
       *
       * @param {string} sPrice - The price string to format.
       * @returns {string} The formatted string, e.g. "140.00 USD".
       */
      formatPrice: function (sPrice) {
        if (sPrice) {
          return parseFloat(sPrice) + " USD";
        }
        return "";
      },

      /**
       * Formats a given Date object to a string with the pattern "yyyy-MM-dd".
       *
       * @param {Date} oDate - The Date object to format.
       * @returns {string} The formatted string, e.g. "2022-07-01".
       */
      formatDate: function (oDate) {
        if (!oDate) return "";
        const oDateFormat = DateFormat.getDateInstance({
          pattern: "yyyy-MM-dd",
        });
        return oDateFormat.format(oDate);
      },

      /**
       * Formats the title of a table by appending the total number of products it contains.
       *
       * @param {string} sTitle - The base title of the table (e.g., "Products").
       * @param {Object[]|null|undefined} aProducts - The array of product objects. Can be null or undefined.
       *        Typically comes from a JSON model binding.
       * @returns {string} The formatted title string with the product count appended, e.g., "Products (10)".
       */
      formatTableTitle: function (sTitle, aProducts) {
        const sTotalProducts = Array.isArray(aProducts) ? aProducts.length : 0;
        return `${sTitle} (${sTotalProducts})`;
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
            return "Success";
        }
      },
    };
  }
);
