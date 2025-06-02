sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/Filter", "sap/ui/model/Context"],
  function (Controller, Filter, Context) {
    "use strict";

    return Controller.extend("webapp.controller.ProductDetails", {
      onInit: function () {
        this.getOwnerComponent()
          .getRouter()
          .getRoute("ProductDetails")
          .attachPatternMatched(this.onPatternMatched.bind(this));
      },

      // Event handler for when the route pattern is matched
      onPatternMatched: function (oEvent) {
        const oView = this.getView();
        const oModel = oView.getModel();

        // Await for the products to be loaded from json model
        oModel.attachEventOnce("requestCompleted", () => {
          const aProducts = oModel.getProperty("/Products");
          const sProductId = oEvent.getParameter("arguments").productId;

          // Filter the table
          const oTable = this.byId("productDetailsTable");
          const oBinding = oTable.getBinding("rows");
          const oFilter = new Filter("ProductId", "EQ", sProductId);
          oBinding.filter([oFilter]);

          // Find and bind the selected product
          const oSelectedProduct = aProducts?.find(
            (oProduct) => String(oProduct.Id) === String(sProductId)
          );

          // Bind the selected product to the view
          if (oSelectedProduct) {
            oView.setBindingContext(
              new Context(oModel, "/Products/" + oSelectedProduct.Id)
            );
          } else {
            console.error("Product not found:", sProductId);
          }
        });
      },

      // Navigate back to the product list
      onNavHome: function () {
        this.getOwnerComponent().getRouter().navTo("ProductList", {}, true);
      },
    });
  }
);
