sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "levani/sarishvili/model/formatter",
  ],
  function (Controller, JSONModel, formatter) {
    "use strict";

    return Controller.extend("levani.sarishvili.controller.ProductList", {
      onInit: function () {},

      // Formatters
      formatter: formatter,

      // Product search
      onProductSearchPress: function (oEvent) {
        const sQuery = oEvent.getParameter("query");
        const oTable = this.byId("productTable");
        const oBinding = oTable.getBinding("rows");

        if (!sQuery) {
          oBinding.filter([]);
          return;
        }

        const aSearchableFields = [
          "Name",
          "Price",
          "Category",
          "Brand",
          "SupplierName",
        ];

        const aFilters = aSearchableFields.map((field) => {
          return field === "Price"
            ? new sap.ui.model.Filter(
                field,
                sap.ui.model.FilterOperator.EQ,
                parseFloat(sQuery)
              )
            : new sap.ui.model.Filter(
                field,
                sap.ui.model.FilterOperator.Contains,
                sQuery
              );
        });

        oBinding.filter(new sap.ui.model.Filter(aFilters, false));
      },
    });
  }
);
