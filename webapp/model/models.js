sap.ui.define(
  ["sap/ui/model/json/JSONModel", "sap/ui/model/BindingMode"],
  function (JSONModel, BindingMode) {
    return {
      /**
       * Creates and returns a new JSON model for the product form with initial empty values.
       * The model is initialized with default values and set to use two-way data binding.
       *
       * @returns {sap.ui.model.json.JSONModel} A JSON model representing the product form structure.
       */
      createProductFormModel: function () {
        return new JSONModel(
          {
            Name: "",
            Price: null,
            Category: null,
            Brand: null,
            SupplierName: "",
            ReleaseDate: new Date(),
            StockStatus: "In Stock",
            Rating: null,
          },
          {
            bindingMode: BindingMode.TwoWay,
          }
        );
      },

      /**
       * Creates and returns a new JSON model for managing selected product IDs.
       * The model contains an array `selectedProductIds` to track user-selected products.
       * It uses two-way binding to reflect selection changes in both the model and the UI.
       *
       * @returns {sap.ui.model.json.JSONModel} A JSON model for tracking selected product IDs.
       */
      createProductSelectionModel: function () {
        return new JSONModel(
          {
            selectedProductIds: [],
          },
          {
            bindingMode: BindingMode.TwoWay,
          }
        );
      },

      createTableRowCountModel: function () {
        return new JSONModel({
          productTableRowCount: 0,
          salesOrderTableRowCount: 0,
        });
      },
    };
  }
);
