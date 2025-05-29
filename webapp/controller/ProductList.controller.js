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
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "levani/sarishvili/utils/i18nUtils",
  ],
  function (
    Controller,
    JSONModel,
    formatter,
    Fragment,
    MessageBox,
    MessageToast,
    Filter,
    FilterOperator,
    i18nUtils
  ) {
    "use strict";

    return Controller.extend("levani.sarishvili.controller.ProductList", {
      onInit: function () {
        this.onProductSearchPress = this.onProductSearchPress.bind(this);
        this._createSearchFilters = this._createSearchFilters.bind(this);
        this._resetProductForm = this._resetProductForm.bind(this);
        this._buildFiltersFromFilterBar =
          this._buildFiltersFromFilterBar.bind(this);
        this._buildFilterForSpecificField =
          this._buildFilterForSpecificField.bind(this);
        this._deleteSelectedProducts = this._deleteSelectedProducts.bind(this);

        const oFormModel = new JSONModel({
          Name: "",
          Price: null,
          Category: "",
          Brand: "",
          SupplierName: "",
          ReleaseDate: "",
          Rating: null,
        });
        this.getView().setModel(oFormModel, "productFormModel");

        // Create selection model for product selection
        const oSelectionModel = new JSONModel({
          selectedProductIds: [],
        });
        this.getView().setModel(oSelectionModel, "selectionModel");
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
        oBinding.filter(new Filter(aFilters, false));
      },

      // Product filter bar functionality
      onSearch: function () {
        const oTable = this.byId("productTable");
        const oFilterBar = this.byId("filterbar");

        const aFilters = this._buildFiltersFromFilterBar(oFilterBar);

        // Apply filters to the table
        oTable
          .getBinding("rows")
          .filter(aFilters.length ? new Filter(aFilters, true) : null);
      },

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
        const oMainModel = oView.getModel();
        const aProducts = oMainModel.getProperty("/Products") || [];
        const oNewProduct = oFormModel.getData();

        // Optionally assign an ID if needed
        oNewProduct.ProductId = Date.now().toString();

        // Add to array and update model
        aProducts.push(oNewProduct);
        oMainModel.setProperty("/Products", aProducts);

        MessageToast.show(
          i18nUtils.getTranslatedText(oView, "productCreatedToast")
        );

        // Reset and close
        this._resetProductForm();
        oDialog.close();
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

      // Handle product selection
      onRowSelectionChange: function () {
        const oSelectionModel = this.getView().getModel("selectionModel");
        const oTable = this.byId("productTable");
        const aSelectedIndices = oTable.getSelectedIndices();
        const aSelectedProductIds = [];

        // Reset selected product IDs
        oSelectionModel.setProperty("/selectedProductIds", []);

        aSelectedIndices.forEach((iIndex) => {
          const oContext = oTable.getContextByIndex(iIndex);
          const oRowData = oContext.getObject();
          aSelectedProductIds.push(oRowData.Id);
        });
        oSelectionModel.setProperty("/selectedProductIds", aSelectedProductIds);
      },

      // Handle product deletion
      onDeleteProductPress: function () {
        const oView = this.getView();
        const oSelectionModel = oView.getModel("selectionModel");
        const aSelectedProductIds = oSelectionModel.getProperty(
          "/selectedProductIds"
        );

        MessageBox.confirm(
          i18nUtils.getTranslatedText(oView, "confirmDeleteProducts"),
          {
            onClose: (sAction) => {
              if (sAction === "OK") {
                this._deleteSelectedProducts(aSelectedProductIds);
              }
            },
          }
        );
      },

      // Delete selected products
      _deleteSelectedProducts: function (aSelectedProductIds) {
        const oView = this.getView();
        const oMainModel = oView.getModel();
        const aProducts = oMainModel.getProperty("/Products") || [];

        // Filter out selected products
        const aUpdatedProducts = aProducts.filter(
          (oProduct) => !aSelectedProductIds.includes(oProduct.Id)
        );

        // Update model with filtered products
        oMainModel.setProperty("/Products", aUpdatedProducts);

        MessageToast.show(
          i18nUtils.getTranslatedText(oView, "productsDeletedToast")
        );

        // Reset selection model
        oView.getModel("selectionModel").setProperty("/selectedProductIds", []);
      },

      // Handle delete button state
      _handleDeleteButtonState: function () {
        const oView = this.getView();
        const oSelectionModel = oView.getModel("selectionModel");
        const aSelectedProductIds = oSelectionModel.getProperty(
          "/selectedProductIds"
        );
        const oDeleteButton = this.byId("deleteProductButton");

        if (oDeleteButton) {
          oDeleteButton.setEnabled(aSelectedProductIds.length > 0);
        }
      },

      // Helper function to create search filters
      _createSearchFilters: function (aSearchableFields, sQuery) {
        if (!sQuery || !aSearchableFields?.length) {
          return [];
        }

        return aSearchableFields.map((sField) => {
          const isNumericField = sField === "Price" || sField === "Rating";
          return new Filter(
            sField,
            isNumericField ? FilterOperator.EQ : FilterOperator.Contains,
            isNumericField ? parseFloat(sQuery) : sQuery
          );
        });
      },

      // Build filters from filter bar
      _buildFiltersFromFilterBar: function (oFilterBar) {
        const aFilters = [];

        oFilterBar.getFilterGroupItems().forEach((oItem) => {
          const sField = oItem.getName();
          const oControl = oFilterBar.determineControlByFilterItem(oItem);
          const vValue = this._getFilterValueFromControl(oControl);

          if (!vValue || (Array.isArray(vValue) && !vValue.length)) return;

          const oFieldFilter = this._buildFilterForSpecificField(
            sField,
            vValue,
            aSearchableFields
          );
          if (oFieldFilter) {
            aFilters.push(oFieldFilter);
          }
        });

        return aFilters;
      },

      _buildFilterForSpecificField: function (
        sField,
        vValue,
        aSearchableFields
      ) {
        if (sField === "Search") {
          const aSearchFilters = this._createSearchFilters(
            aSearchableFields,
            vValue
          );
          return aSearchFilters.length
            ? new Filter(aSearchFilters, false)
            : null;
        }

        if (sField === "ReleaseDate") {
          const sFormattedDate = formatter._formatDate(vValue);
          return sFormattedDate
            ? new Filter(sField, "EQ", sFormattedDate)
            : null;
        }

        if (Array.isArray(vValue)) {
          const aMultiFilters = vValue.map((v) => new Filter(sField, "EQ", v));
          return new Filter(aMultiFilters, false);
        }

        return new Filter(
          sField,
          typeof vValue === "string" ? "Contains" : "EQ",
          vValue
        );
      },

      // Get filter values from controls
      _getFilterValueFromControl: function (oControl) {
        return (
          oControl.getSelectedKey?.() ||
          oControl.getSelectedItems?.()?.map((oItem) => oItem.getKey()) ||
          oControl.getDateValue?.() ||
          oControl.getValue?.()
        );
      },

      // Reset product creation form
      _resetProductForm: function () {
        const oView = this.getView();
        const oFormModel = oView.getModel("productFormModel");

        oFormModel.setData({
          Name: "",
          Price: null,
          Category: "",
          Brand: "",
          SupplierName: "",
          ReleaseDate: null,
          Rating: null,
        });
      },
    });
  }
);
