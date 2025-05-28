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
    "sap/ui/core/Fragment",
  ],
  function (Controller, JSONModel, formatter, Fragment) {
    "use strict";

    return Controller.extend("levani.sarishvili.controller.ProductList", {
      onInit: function () {
        this.onProductSearchPress = this.onProductSearchPress.bind(this);
        this._createSearchFilters = this._createSearchFilters.bind(this);
        this._resetProductForm = this._resetProductForm.bind(this);

        const oFormModel = new JSONModel({
          Name: "",
          Price: "",
          Category: null,
          Brand: null,
          SupplierName: "",
          ReleaseDate: "",
          Rating: "",
        });
        this.getView().setModel(oFormModel, "productFormModel");
      },

      // Get i18n text
      // _getTranslatedText: function (sKey, aArgs) {
      //   return this.getView()
      //     .getModel("i18n")
      //     .getResourceBundle()
      //     .getText(sKey, aArgs);
      // },

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
                aFilters.push(new sap.ui.model.Filter(searchFilters, false));
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

      // Product addition
      onAddProductPress: function () {
        const oView = this.getView();
        const oDialog = oView.byId("addProductDialog");

        if (!oDialog) {
          Fragment.load({
            id: oView.getId(),
            name: "levani.sarishvili.view.fragments.AddProductDialog",
            controller: this,
          }).then((oDialog) => {
            oView.addDependent(oDialog);
            this.oDialog = oDialog;
            this.oDialog.bindElement({
              path: "/",
              model: "productFormModel",
            });
            oDialog.open();
          });
        } else {
          this.oDialog.bindElement({
            path: "/",
            model: "productFormModel",
          });
          oDialog.open();
        }
      },

      // Submit product creation form
      onProductCreatePress: function () {
        const oView = this.getView();
        const oDialog = oView.byId("addProductDialog");
        const oFormModel = oView.getModel("productFormModel");
        console.log("Product Form Data:", oFormModel.getData());
      },

      // Close dialog
      onProductCancelPress: function () {
        const oView = this.getView();
        const oDialog = oView.byId("addProductDialog");
        if (oDialog) {
          oDialog.close();
          this._resetProductForm();
        }
      },

      // Reset product creation form
      _resetProductForm: function () {
        const oView = this.getView();
        const oFormModel = oView.getModel("productFormModel");
        oFormModel.setData({
          Name: "",
          Price: "",
          Category: null,
          Brand: null,
          SupplierName: "",
          ReleaseDate: null,
          Rating: "",
        });
      },
    });
  }
);
