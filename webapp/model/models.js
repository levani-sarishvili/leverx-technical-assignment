sap.ui.define(
  ["sap/ui/model/json/JSONModel", "levani/sarishvili/constants/Constants"],
  function (JSONModel, Constants) {
    return {
      /**
       * Creates an instance of a JSONModel to store the application state.
       * The model stores the following data:
       * <ul>
       *   <li>The product form data (Name, Price, Category, Brand, SupplierName, ReleaseDate, StockStatus, Rating)</li>
       *   <li>The selected product IDs in the products table</li>
       *   <li>The table row counts for products and sales orders tables</li>
       * </ul>
       * The model uses two-way binding to synchronize the data between the model and the UI controls.
       * @returns {sap.ui.model.json.JSONModel} The application state model
       */
      createAppViewModel: function () {
        return new JSONModel({
          productFormData: {
            Name: "",
            Price: 0,
            Category: "",
            Brand: "",
            SupplierName: "",
            ReleaseDate: new Date(),
            StockStatus: Constants.oStockStatuses.IN_STOCK,
            Rating: 0,
          },

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
