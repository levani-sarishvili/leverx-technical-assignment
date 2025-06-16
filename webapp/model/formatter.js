sap.ui.define(
  ["levani/sarishvili/constants/Constants", "sap/ui/core/library"],
  function (Constants, coreLibrary) {
    "use strict";

    return {
      /**
       * Maps an order status to a semantic color.
       * @param {string} sStatus - The order status to map.
       * @returns {string} A semantic color as a string (e.g., "Success", "Warning", "Error", or "None").
       */
      formatOrderStatus: function (sStatus) {
        if (!sStatus) return;
        switch (sStatus) {
          case Constants.oOrderStatuses.DELIVERED:
            return coreLibrary.ValueState.Success;
          case Constants.oOrderStatuses.PROCESSING:
            return coreLibrary.ValueState.Warning;
          case Constants.oOrderStatuses.SHIPPED:
            return coreLibrary.ValueState.Success;
          case Constants.oOrderStatuses.CANCELLED:
            return coreLibrary.ValueState.Error;
          default:
            return coreLibrary.ValueState.None;
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
            return coreLibrary.ValueState.Success;
          case Constants.oStockStatuses.LESS_THAN_10_LEFT:
            return coreLibrary.ValueState.Warning;
          case Constants.oStockStatuses.OUT_OF_STOCK:
            return coreLibrary.ValueState.Error;
          default:
            return coreLibrary.ValueState.None;
        }
      },
    };
  }
);
