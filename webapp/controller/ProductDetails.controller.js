sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/Filter"],
  function (Controller, Filter) {
    "use strict";

    return Controller.extend("webapp.controller.ProductDetails", {
      onInit: function () {
        this.getOwnerComponent()
          .getRouter()
          .getRoute("ProductDetails")
          .attachPatternMatched(this.onPatternMatched.bind(this));
      },

      // Event handler for when the route pattern is matched
      onPatternMatched: async function (oEvent) {
        const oView = this.getView();
        const oModel = oView.getModel();
        const sProductId = oEvent.getParameter("arguments").productId;

        // Helper to wait for data if not loaded yet
        const aProducts = oModel.getProperty("/Products");
        if (!aProducts || aProducts.length === 0) {
          await new Promise((resolve) => {
            oModel.attachEventOnce("requestCompleted", resolve);
          });
        }

        const aFinalProducts = oModel.getProperty("/Products");
        // Filter the table
        const oTable = this.byId("productDetailsTable");
        const oBinding = oTable.getBinding("rows");
        const oFilter = new Filter("ProductId", "EQ", sProductId);
        oBinding.filter([oFilter]);

        // Find and bind the selected product
        const oSelectedProduct = aFinalProducts.find(
          (oProduct) => String(oProduct.Id) === String(sProductId)
        );

        // If the product is found, bind it to the view
        if (oSelectedProduct) {
          const iIndex = aFinalProducts.indexOf(oSelectedProduct);
          oView.bindObject({
            path: "/Products/" + iIndex,
          });
        } else {
          console.error("Product not found:", sProductId);
        }
      },
    });
  }
);
