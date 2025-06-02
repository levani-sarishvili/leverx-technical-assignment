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

      onPatternMatched: function (oEvent) {
        const oTable = this.byId("productDetailsTable");
        const sProductId = oEvent.getParameter("arguments").productId;
        const oBinding = oTable.getBinding("rows");
        const oFilter = new Filter("ProductId", "EQ", sProductId);
        oBinding.filter([oFilter]);
      },
    });
  }
);
