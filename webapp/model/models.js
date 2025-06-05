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
            Category: "",
            Brand: "",
            SupplierName: "",
            ReleaseDate: "",
            StockStatus: "In Stock",
            Rating: null,
          },
          {
            bindingMode: BindingMode.TwoWay,
          }
        );
      },

      /**
       * Creates and returns a new JSON model for product form validation.
       * Each property represents the validation state of a form field (true = valid, false = invalid).
       * The model uses one-way binding to reflect validation results in the UI.
       *
       * @returns {sap.ui.model.json.JSONModel} A JSON model representing the validation state of product form fields.
       */
      createProductFormValidationModel: function () {
        return new JSONModel(
          {
            Name: true,
            Price: true,
            Category: true,
            Brand: true,
            SupplierName: true,
            ReleaseDate: true,
            StockStatus: true,
            Rating: true,
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
    };
  }
);
