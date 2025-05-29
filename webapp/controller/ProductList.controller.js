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
      /**
       * Initializes the ProductList controller.
       *
       * Binds the context of several functions to ensure correct 'this' usage.
       * Sets up the product form model and selection model, binding them to the view.
       * The product form model is used to handle product data input, while the selection model manages
       * selected product IDs for operations like deletion or updates.
       */
      onInit: function () {
        this.onProductSearchPress = this.onProductSearchPress.bind(this);
        this._createSearchFilters = this._createSearchFilters.bind(this);
        this._resetProductFormModel = this._resetProductFormModel.bind(this);
        this._buildFiltersFromFilterBar =
          this._buildFiltersFromFilterBar.bind(this);
        this._buildFilterForSpecificField =
          this._buildFilterForSpecificField.bind(this);
        this._deleteSelectedProducts = this._deleteSelectedProducts.bind(this);
        this._updateProductCount = this._updateProductCount.bind(this);

        // Create product form model
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

      /**
       * Handles product search form submission.
       * @param {sap.ui.base.Event} oEvent - The event object.
       * @private
       */
      onProductSearchPress: function (oEvent) {
        const oView = this.getView();
        const sQuery = oEvent.getParameter("query");
        const oTable = this.byId("productTable");
        const oBinding = oTable.getBinding("rows");

        // Clear filter and update count if query is cleared
        if (!sQuery) {
          oBinding.filter([]);
          this._updateProductCount(oView, oBinding);
          return;
        }

        const aFilters = this._createSearchFilters(aSearchableFields, sQuery);
        oBinding.filter(new Filter(aFilters, false));

        // Update product count
        this._updateProductCount(oView, oBinding);
      },

      /**
       * Applies filters to the product table based on the values in the filter bar and updates the product count.
       * @private
       */
      onSearch: function () {
        const oView = this.getView();
        const oTable = this.byId("productTable");
        const oBinding = oTable.getBinding("rows");
        const oFilterBar = this.byId("filterbar");
        const aFilters = this._buildFiltersFromFilterBar(oFilterBar);

        // Apply filters to the table
        oBinding.filter(aFilters.length ? new Filter(aFilters, true) : null);

        // Update product count
        this._updateProductCount(oView, oBinding);
      },

      /**
       * Updates the product count in the table title.
       * @param {sap.ui.core.mvc.View} oView - The current view.
       * @param {sap.ui.model.Binding} oBinding - The table's binding.
       * @private
       */
      _updateProductCount: function (oView, oBinding) {
        const iCount = oBinding.getLength();
        const sTitle = i18nUtils.getTranslatedText(oView, "productTableTitle");
        this.getView().byId("title").setText(`${sTitle} (${iCount})`);
      },

      /**
       * Handles the add product button press.
       * If the dialog doesn't already exist, it is loaded and opened.
       * If the dialog already exists, it is opened without loading.
       * The dialog is bound to the product form model to display the current product data.
       * @private
       */
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

      /**
       * Handles the create product button press in the add product dialog.
       * Gets the current product data from the product form model and adds it to the main model.
       * Creates a new array with the new product added and sets the property in the main model with the new array reference.
       * Resets the product form model and closes the add product dialog.
       * @private
       */
      onProductCreatePress: function () {
        const oView = this.getView();
        const oDialog = oView.byId("addProductDialog");
        const oFormModel = oView.getModel("productFormModel");
        const oMainModel = oView.getModel();
        const aProducts = oMainModel.getProperty("/Products") || [];
        const oNewProduct = oFormModel.getData();

        // Add new product
        oNewProduct.ProductId = Date.now().toString();
        const aUpdatedProducts = [...aProducts, oNewProduct];
        oMainModel.setProperty("/Products", aUpdatedProducts);

        // Show success message
        MessageToast.show(
          i18nUtils.getTranslatedText(oView, "productCreatedToast")
        );

        // Reset product form
        this._resetProductFormModel();
        oDialog.close();
      },

      /**
       * Handles the cancel button press in the add product dialog.
       * Closes the dialog and resets the product form model.
       * @private
       */
      onProductCancelPress: function () {
        const oView = this.getView();
        const oDialog = oView.byId("addProductDialog");
        if (oDialog) {
          oDialog.close();
          this._resetProductFormModel();
        }
      },

      /**
       * Handles the selection change event of the product table.
       * Resets the selected product IDs property in the selection model and sets the new IDs based on the selected rows.
       * @private
       */
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

      /**
       * Handles the delete button press in the product table toolbar.
       * Shows a confirmation dialog asking to confirm the deletion of the selected products.
       * If confirmed, calls the _deleteSelectedProducts function to delete the products.
       * @private
       */
      onDeleteProductPress: function () {
        const oView = this.getView();
        const oSelectionModel = oView.getModel("selectionModel");
        const aSelectedProductIds = oSelectionModel.getProperty(
          "/selectedProductIds"
        );

        // Show confirmation dialog
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

      /**
       * Deletes the selected products from the main model.
       * @param {number[]} aSelectedProductIds - The IDs of the products to delete.
       * @private
       */
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

      /**
       * Updates the state of the delete button based on the current selection.
       *
       * Retrieves the selected product IDs from the selection model and enables
       * the delete button if there are any products selected. Disables the button
       * otherwise.
       *
       * @private
       */
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

      /**
       * Creates an array of filters for the given searchable fields and query.
       * If a numeric field is found, uses the EQ operator and parses the query as a float.
       * For non-numeric fields, uses the Contains operator and passes the query as a string.
       * @param {string[]} aSearchableFields - The fields to search in.
       * @param {string} sQuery - The query to search for.
       * @returns {sap.ui.model.Filter[]} - An array of filters to apply to the table's binding.
       * @private
       */
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

      /**
       * Builds an array of filters from the values in the given filter bar.
       * Iterates over the filter group items of the filter bar, determines the
       * control for each item, and retrieves the current value from the control.
       * If a value is found, calls the _buildFilterForSpecificField function
       * to create a filter for the field and adds it to the array.
       * @param {sap.ui.comp.filterbar.FilterBar} oFilterBar - The filter bar to build filters from.
       * @returns {sap.ui.model.Filter[]} - An array of filters to apply to the table's binding.
       * @private
       */
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

      /**
       * Creates a filter for the given field and value, based on the field type.
       * @param {string} sField - The name of the field to filter on.
       * @param {any} vValue - The value to filter on.
       * @param {string[]} aSearchableFields - The fields that can be searched on.
       * @returns {sap.ui.model.Filter} - The filter to apply to the table's binding.
       * @private
       */
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
          const sFormattedDate = formatter.formatDate(vValue);
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

      /**
       * Retrieves the current filter value from the given control.
       * For a <code>MultiComboBox</code>, it will return an array of selected keys.
       * For a <code>DatePicker</code>, it will return the selected date as a Date object.
       * For any other control, it will return the current value as a string.
       * @param {sap.ui.core.Control} oControl - The control to retrieve the filter value from.
       * @returns {string|string[]|Date|null} - The current filter value or null if no value is set.
       * @private
       */
      _getFilterValueFromControl: function (oControl) {
        return (
          oControl.getSelectedKey?.() ||
          oControl.getSelectedItems?.()?.map((oItem) => oItem.getKey()) ||
          oControl.getDateValue?.() ||
          oControl.getValue?.()
        );
      },

      /**
       * Resets the product form model to its initial state.
       * @private
       */
      _resetProductFormModel: function () {
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
