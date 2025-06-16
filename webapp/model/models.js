sap.ui.define(
  ["sap/ui/model/json/JSONModel", "levani/sarishvili/constants/Constants"],
  function (JSONModel, Constants) {
    // models.js
    return {
      /**
       * Returns the default product form data.
       *
       * @returns {object} Initial values for a new product.
       */
      getInitialProductFormData: function () {
        return {
          Name: "",
          Price: null,
          Category: "",
          Brand: "",
          SupplierName: "",
          ReleaseDate: new Date(),
          StockStatus: Constants.oStockStatuses.IN_STOCK,
          Rating: null,
        };
      },

      /**
       * Creates the app view model.
       *
       * @returns {sap.ui.model.Model} App view model with product form, selection, and filter state.
       */
      createAppViewModel: function () {
        return new JSONModel({
          productFormData: this.getInitialProductFormData(),
          selectedProductIds: [],
          tableRowCount: {
            productTableRowCount: 0,
            salesOrderTableRowCount: 0,
          },
          activeFilters: [],
          editMode: false,
        });
      },
    };
  }
);
