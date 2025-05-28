const aSearchableFields = [
  "Name",
  "Price",
  "Category",
  "Brand",
  "SupplierName",
  "Rating",
];

sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "levani/sarishvili/model/formatter",
  ],
  function (Controller, JSONModel, formatter) {
    "use strict";

    return Controller.extend("levani.sarishvili.controller.ProductList", {
      onInit: function () {
        this.onProductSearchPress = this.onProductSearchPress.bind(this);
        this._createSearchFilters;
      },

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

        const aFilters = this._createSearchFilters(aSearchableFields, sQuery);
        oBinding.filter(new sap.ui.model.Filter(aFilters, false));
      },

      // Helper function to create search filters
      _createSearchFilters: function (aSearchableFields, sQuery) {
        if (!sQuery || !aSearchableFields?.length) {
          return [];
        }

        return aSearchableFields.map((field) => {
          const isNumericField = field === "Price" || field === "Rating";

          return new sap.ui.model.Filter(
            field,
            isNumericField
              ? sap.ui.model.FilterOperator.EQ
              : sap.ui.model.FilterOperator.Contains,
            isNumericField ? parseFloat(sQuery) : sQuery
          );
        });
      },

      // Product filter bar functionality
      onSearch: function () {
        const oTable = this.byId("productTable");
        const oFilterBar = this.byId("filterbar");
        const aFilters = [];

        oFilterBar.getFilterGroupItems().forEach((oItem) => {
          const sField = oItem.getName();
          const oControl = oFilterBar.determineControlByFilterItem(oItem);

          // Get value based on control type
          const value = this._getFilterValueFromControl(oControl);

          if (!value || (Array.isArray(value) && !value.length)) return;

          // Create filter(s)
          if (Array.isArray(value)) {
            aFilters.push(
              new sap.ui.model.Filter(
                value.map((v) => new sap.ui.model.Filter(sField, "EQ", v)),
                false
              )
            );
          } else {
            if (sField === "Search") {
              const searchFilters = this._createSearchFilters(
                aSearchableFields,
                value
              );
              if (searchFilters.length) {
                aFilters.push(new sap.ui.model.Filter(searchFilters, false)); // false = OR
              }
              return;
            }

            // Format date if necessary
            if (sField === "ReleaseDate") {
              // Handle date formatting
              const formattedDate = this._formatDate(value);
              if (formattedDate) {
                aFilters.push(
                  new sap.ui.model.Filter(sField, "EQ", formattedDate)
                );
              }
              return;
            }

            aFilters.push(
              new sap.ui.model.Filter(
                sField,
                typeof value === "string" ? "Contains" : "EQ",
                value
              )
            );
          }
        });

        console.log("Applied Filters:", aFilters);

        oTable
          .getBinding("rows")
          .filter(
            aFilters.length ? new sap.ui.model.Filter(aFilters, true) : null
          );
      },

      // get filter values from controls
      _getFilterValueFromControl: function (oControl) {
        return (
          oControl.getSelectedKey?.() ||
          oControl.getSelectedItems?.()?.map((oItem) => oItem.getKey()) ||
          oControl.getDateValue?.() ||
          oControl.getValue?.()
        );
      },

      // Format date from data picker
      _formatDate: function (oDate) {
        if (!oDate) return "";
        const oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
          pattern: "yyyy-MM-dd",
        });
        return oDateFormat.format(oDate);
      },

      // Product selection
      // onRowSelectionChange: function (oEvent) {
      //   const oSelectedRow = oEvent.getParameter("rowContext");
      //   console.log(
      //     "Selected Product:",
      //     oSelectedRow ? oSelectedRow.getObject() : "None"
      //   );
      // },
    });
  }
);
