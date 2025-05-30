sap.ui.define(
  ["sap/ui/model/json/JSONModel", "sap/ui/model/BindingMode"],
  function (JSONModel, BindingMode) {
    return {
      // Main model for the application
      createProductFormModel: function () {
        return new JSONModel(
          {
            Name: "",
            Price: null,
            Category: "",
            Brand: "",
            SupplierName: "",
            ReleaseDate: "",
            Rating: null,
          },
          {
            bindingMode: BindingMode.TwoWay,
          }
        );
      },

      // Validation model for the product form
      createProductFormValidationModel: function () {
        return new JSONModel(
          {
            Name: true,
            Price: true,
            Category: true,
            Brand: true,
            SupplierName: true,
            ReleaseDate: true,
            Rating: true,
          },
          {
            bindingMode: BindingMode.OneWay,
          }
        );
      },

      // Model for the product selection
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
