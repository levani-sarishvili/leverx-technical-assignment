sap.ui.define(
  ["sap/ui/model/json/JSONModel", "sap/ui/model/BindingMode"],
  function (JSONModel, BindingMode) {
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
      createAppStateModel: function () {
        return new JSONModel(
          {
            productFormData: {
              Name: "",
              Price: null,
              Category: null,
              Brand: null,
              SupplierName: "",
              ReleaseDate: new Date(),
              StockStatus: "In Stock",
              Rating: null,
            },

            selectedProductIds: [],

            tableRowCount: {
              productTableRowCount: 0,
              salesOrderTableRowCount: 0,
            },

            activeFilters: [],
          },

          {
            bindingMode: BindingMode.TwoWay,
          }
        );
      },
    };
  }
);
