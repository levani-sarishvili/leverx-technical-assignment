sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "levani/sarishvili/model/formatter",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "levani/sarishvili/utils/i18nUtils",
    "levani/sarishvili/model/models",
    "levani/sarishvili/model/Validation",
    "levani/sarishvili/constants/Constants",
  ],
  function (
    Controller,
    formatter,
    Fragment,
    MessageBox,
    MessageToast,
    Filter,
    FilterOperator,
    i18nUtils,
    models,
    Validation,
    Constants
  ) {
    "use strict";

    return Controller.extend("levani.sarishvili.controller.ProductList", {
      aSearchFilters: [],
      aFilterBarFilters: [],
      aCombinedFilters: [],

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

        this._oProductTableColumns = Constants.oProductTableColumns;
        this._oFilterOperators = Constants.oFilterOperators;

        // Create product form model
        this.getView().setModel(
          models.createProductFormModel(),
          "productFormModel"
        );

        // Create product form validation model
        this.getView().setModel(
          models.createProductFormValidationModel(),
          "productFormValidationModel"
        );

        // Create selection model for product selection
        this.getView().setModel(
          models.createProductSelectionModel(),
          "selectionModel"
        );
      },

      // Formatters
      formatter: formatter,

      /**
       * Handles the product search input and updates the table filters.
       * Applies OR filters across searchable fields if a query exists.
       *
       * @param {sap.ui.base.Event} oEvent The search event containing the query parameter.
       */
      onProductSearchPress: function (oEvent) {
        const sQuery = oEvent.getParameter("query");
        const oTable = this.byId("productTable");
        const oBinding = oTable.getBinding("rows");

        // Reset search filters and create new ones if query exists
        this.oSearchFilterGroup = sQuery
          ? new Filter(
              this._createSearchFilters(Constants.aSearchableFields, sQuery),
              false
            )
          : null;

        this._applyCombinedFilters(oBinding);
        this._updateProductCount(this.getView(), oBinding);
      },

      /**
       * Handles the filter bar search action and updates the table filters.
       * Applies AND filters based on the selected filter bar fields.
       */
      onSearch: function () {
        const oTable = this.byId("productTable");
        const oBinding = oTable.getBinding("rows");
        const oFilterBar = this.byId("filterbar");

        // Get filters from filter bar
        this.aFilterBarFilters = this._buildFiltersFromFilterBar(oFilterBar);

        this._applyCombinedFilters(oBinding);
        this._updateProductCount(this.getView(), oBinding);
      },

      /**
       * Helper method to apply combined filters
       * @private
       */
      _applyCombinedFilters: function (oBinding) {
        const aCombinedFilters = [];
        if (this.oSearchFilterGroup) {
          aCombinedFilters.push(this.oSearchFilterGroup);
        }

        if (this.aFilterBarFilters?.length) {
          aCombinedFilters.push(...this.aFilterBarFilters);
        }
        oBinding.filter(
          aCombinedFilters.length ? new Filter(aCombinedFilters, true) : []
        );
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
        const oProductForm = this.getView()
          .getModel("productFormModel")
          .getData();
        const oValidationModel = this.getView().getModel(
          "productFormValidationModel"
        );

        // Validate product form inputs
        const bIsFormValid = Validation.validateProductForm(
          oProductForm,
          oValidationModel
        );
        if (!bIsFormValid) {
          MessageBox.error(
            i18nUtils.getTranslatedText(oView, "productFormValidationError")
          );
          return;
        }

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

          // Create product form validation model
          this.getView().setModel(
            models.createProductFormValidationModel(),
            "productFormValidationModel"
          );
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
       * Enables or disables the delete button based on whether any products are selected.
       * Checks the `selectionModel` for selected product IDs and updates the delete button state accordingly.
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
       * Creates an array of search filters for the specified searchable fields and query.
       * Uses `Contains` for string fields and `EQ` for numeric fields like Price or Rating.
       *
       * @param {string[]} aSearchableFields - List of field names to be searched.
       * @param {string} sQuery - The search query input by the user.
       * @returns {sap.ui.model.Filter[]} An array of filters based on the query and searchable fields.
       */
      _createSearchFilters: function (aSearchableFields, sQuery) {
        if (!sQuery || !Constants.aSearchableFields?.length) {
          return [];
        }

        return Constants.aSearchableFields.map((sField) => {
          const isNumericField =
            sField === this._oProductTableColumns.PRICE_FIELD ||
            sField === this._oProductTableColumns.RATING_FIELD;
          return new Filter(
            sField,
            isNumericField ? FilterOperator.EQ : FilterOperator.Contains,
            isNumericField ? parseFloat(sQuery) : sQuery
          );
        });
      },

      /**
       * Builds an array of filters based on the user inputs in the filter bar controls.
       * Each control's value is extracted and converted into a corresponding filter.
       *
       * @param {sap.ui.comp.filterbar.FilterBar} oFilterBar - The filter bar containing filter group items.
       * @returns {sap.ui.model.Filter[]} An array of Filter objects based on filled controls.
       */
      _buildFiltersFromFilterBar: function (oFilterBar) {
        const aFilters = [];

        oFilterBar.getFilterGroupItems().forEach((oItem) => {
          const sField = oItem.getName();
          const oControl = oFilterBar.determineControlByFilterItem(oItem);
          const vFilterValue = this._getFilterValueFromControl(oControl);

          if (
            !vFilterValue ||
            (Array.isArray(vFilterValue) && !vFilterValue.length)
          )
            return;

          const oFieldFilter = this._buildFilterForSpecificField(
            sField,
            vFilterValue,
            Constants.aSearchableFields
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
       * @param {any} vFilterValue - The value to filter on.
       * @param {string[]} aSearchableFields - The fields that can be searched on.
       * @returns {sap.ui.model.Filter} - The filter to apply to the table's binding.
       * @private
       */
      _buildFilterForSpecificField: function (
        sField,
        vFilterValue,
        aSearchableFields
      ) {
        if (sField === "Search") {
          const aSearchFilters = this._createSearchFilters(
            Constants.aSearchableFields,
            vFilterValue
          );
          return aSearchFilters.length
            ? new Filter(aSearchFilters, false)
            : null;
        }

        if (sField === this._oProductTableColumns.RELEASE_DATE_FIELD) {
          const sFormattedDate = formatter.formatDate(vFilterValue);
          return sFormattedDate
            ? new Filter(sField, "EQ", sFormattedDate)
            : null;
        }

        if (Array.isArray(vFilterValue)) {
          const aMultiFilters = vFilterValue.map(
            (filterValue) =>
              new Filter(sField, this._oFilterOperators.EQUAL, filterValue)
          );
          return new Filter(aMultiFilters, false);
        }

        return new Filter(
          sField,
          typeof vFilterValue === "string"
            ? this._oFilterOperators.CONTAINS
            : this._oFilterOperators.EQUAL,
          vFilterValue
        );
      },

      /**
       * Extracts the filter value from a given control.
       * Handles different control types like Select, MultiSelect, DatePicker, and Input.
       *
       * @param {sap.ui.core.Control} oControl - The control to extract the value from.
       * @returns {string|string[]|Date|undefined} The extracted filter value.
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
