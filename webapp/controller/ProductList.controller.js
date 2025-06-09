sap.ui.define(
  [
    "levani/sarishvili/model/formatter",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter",
    "sap/ui/model/FilterOperator",
    "levani/sarishvili/model/models",
    "levani/sarishvili/model/Validation",
    "levani/sarishvili/constants/Constants",
    "levani/sarishvili/controller/BaseController",
  ],
  function (
    formatter,
    Fragment,
    MessageBox,
    MessageToast,
    Filter,
    Sorter,
    FilterOperator,
    models,
    Validation,
    Constants,
    BaseController
  ) {
    "use strict";

    return BaseController.extend("levani.sarishvili.controller.ProductList", {
      aSearchFilters: [],
      aFilterBarFilters: [],
      aCombinedFilters: [],

      /**
       * Initializes the ProductList controller.
       *
       * This method sets up the initial models required for the view:
       *
       * - **productFormModel**: Holds the product form data input by the user.
       * - **productFormValidationModel**: Manages validation states and messages for the product form fields.
       * - **selectionModel**: Tracks the IDs of selected products, used for operations like deletion or editing.
       *
       * These models are attached to the view under named model references to enable data binding.
       */
      onInit: function () {
        // Create app state model
        this.getView().setModel(models.createAppStateModel(), "appStateModel");
      },

      /**
       * Called before the view is rendered.
       *
       * This hook is used to convert the release date from a string to a Date object
       * so that it can be bound to the table using the sap.ui.model.type.Date type.
       *
       * @private
       */
      onBeforeRendering: function () {
        const oView = this.getView();
        const oModel = oView.getModel();
        const oProductsData = oModel.getData().Products;

        oProductsData.forEach((oProduct) => {
          oProduct.ReleaseDate = new Date(oProduct.ReleaseDate);
        });

        // Update table row count model
        this.getView()
          .getModel("appStateModel")
          .setProperty(
            "/tableRowCount/productTableRowCount",
            oProductsData.length
          );
      },

      /**
       * Handles the press event on a product item in the list.
       *
       * Retrieves the selected product's ID from the binding context and navigates to the ProductDetails page.
       *
       * @param {sap.ui.base.Event} oEvent - The press event triggered when a product item is selected.
       */
      onProductPress: function (oEvent) {
        const oSelectedItem = oEvent.getSource();
        const oContext = oSelectedItem.getBindingContext();
        const sProductId = oContext.getProperty("Id");

        // Navigate to the product detail page with the selected product ID
        this.getOwnerComponent().getRouter().navTo("ProductDetails", {
          productId: sProductId,
        });
      },

      // Formatters
      formatter: formatter,

      /**
       * Handles the sort event for the product table.
       * Retrieves the product table by its ID and calls the sortTable method
       * to apply sorting based on the event parameters and the product ID.
       *
       * @param {sap.ui.base.Event} oEvent - The sort event containing the column and sort order information.
       * @private
       */
      onProductTableSort: function (oEvent) {
        const oTable = this.byId("productTable");
        this.sortTable(oEvent, oTable, Constants.oUniqueIdNames.Id);
      },

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
              this.createTableSearchFilters(
                sQuery,
                Constants.aProductTableSearchableFields
              ),
              false
            )
          : null;

        this._applyCombinedFilters(oBinding);
        this._updateProductCount(this.getView(), oBinding);
        this._trackActiveFilters();
      },

      /**
       * Handles the filter bar search action and updates the table filters.
       * Applies AND filters based on the selected filter bar fields.
       */
      onFilterBarSearch: function () {
        const oTable = this.byId("productTable");
        const oBinding = oTable.getBinding("rows");
        const oFilterBar = this.byId("filterbar");

        // Get filters from filter bar
        this.aFilterBarFilters = this._buildFiltersFromFilterBar(oFilterBar);

        this._applyCombinedFilters(oBinding);
        this._updateProductCount(this.getView(), oBinding);
        this._trackActiveFilters();
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
       * Updates the product table row count model with the current binding length.
       * @param {sap.ui.core.mvc.View} oView The view containing the product table.
       * @param {sap.ui.model.Binding} oBinding The binding of the product table.
       * @private
       */
      _updateProductCount: function (oView, oBinding) {
        const iCount = oBinding.getLength();
        const oAppStateModel = oView.getModel("appStateModel");
        oAppStateModel.setProperty(
          "/tableRowCount/productTableRowCount",
          iCount
        );
      },

      /**
       * Handles the add product button press.
       * If the dialog doesn't already exist, it is loaded and opened.
       * If the dialog already exists, it is opened without loading.
       * The dialog is bound to the product form model to display the current product data.
       * @private
       */
      onCreateProductPress: async function () {
        const oView = this.getView();

        if (!this.oDialog) {
          this.oDialog = await Fragment.load({
            id: oView.getId(),
            name: "levani.sarishvili.view.fragments.AddProductDialog",
            controller: this,
          });

          oView.addDependent(this.oDialog);

          this.oDialog.bindElement({
            path: "/productFormData",
            model: "appStateModel",
          });
        } else {
          this.oDialog.bindElement({
            path: "/productFormData",
            model: "appStateModel",
          });
        }

        this.oDialog.open();
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
        const oDialog = oView.byId("createProductDialog");
        const oAppStateModel = oView.getModel("appStateModel");
        const oMainModel = oView.getModel();
        const aProducts = oMainModel.getProperty("/Products") || [];
        const oNewProduct = oAppStateModel.getProperty("/productFormData");
        const oAddProductForm = oView.byId("productDialogForm");

        // Validate product form inputs
        const bIsFormValid = Validation.validateForm(oAddProductForm);
        if (!bIsFormValid) {
          return;
        }

        // Add new product
        oNewProduct.Id = this._createNewProductId(aProducts);
        oNewProduct.ReleaseDate = new Date(oNewProduct.ReleaseDate);
        const aUpdatedProducts = [...aProducts, oNewProduct];
        oMainModel.setProperty("/Products", aUpdatedProducts);

        // Update row count in product table row count model
        this._updateProductCount(
          oView,
          oView.byId("productTable").getBinding("rows")
        );

        // Show success message
        MessageToast.show(this.getTranslatedText(oView, "productCreatedToast"));

        // Reset product form
        this._resetProductFormModel();
        oDialog.close();
      },

      /**
       * Creates a new product ID based on the last product ID in the product list.
       * The new ID is created by incrementing the numeric part of the last product ID.
       * @param {object[]} aProducts - The list of products.
       * @returns {string} The new product ID.
       * @private
       */
      _createNewProductId: function (aProducts) {
        if (aProducts.length === 0) {
          return 0;
        }
        const sLastProductId = aProducts[aProducts.length - 1].Id;
        const iNumericPart = Number(sLastProductId.replace(/[^0-9]/g, ""));
        return `PO-${String(iNumericPart + 1)}`;
      },

      /**
       * Handles the cancel button press in the add product dialog.
       * Closes the dialog and resets the product form model.
       * @private
       */
      onProductCancelPress: function () {
        const oView = this.getView();
        const oDialog = oView.byId("createProductDialog");
        if (oDialog) {
          oDialog.close();
          this._resetProductFormModel();
          this.resetFormValidations(oView.byId("productDialogForm"));
        }
      },

      /**
       * Handles the selection change event of the product table.
       * Resets the selected product IDs property in the selection model and sets the new IDs based on the selected rows.
       * @private
       */
      onRowSelectionChange: function () {
        const oAppStateModel = this.getView().getModel("appStateModel");
        const oTable = this.byId("productTable");
        const aSelectedIndices = oTable.getSelectedIndices();
        const aSelectedProductIds = [];

        // Reset selected product IDs
        oAppStateModel.setProperty("/selectedProductIds", []);

        aSelectedIndices.forEach((iIndex) => {
          const oContext = oTable.getContextByIndex(iIndex);
          const iProductId = oContext.getProperty("Id");
          aSelectedProductIds.push(iProductId);
        });
        oAppStateModel.setProperty("/selectedProductIds", aSelectedProductIds);
      },

      /**
       * Handles the delete button press in the product table toolbar.
       * Shows a confirmation dialog asking to confirm the deletion of the selected products.
       * If confirmed, calls the _deleteSelectedProducts function to delete the products.
       * @private
       */
      onDeleteProductPress: function () {
        const oView = this.getView();
        const aProductsData = oView.getModel().getData().Products;
        const oAppStateModel = oView.getModel("appStateModel");
        const aSelectedProductIds = oAppStateModel.getProperty(
          "/selectedProductIds"
        );
        const bIsSingleProductSelected = aSelectedProductIds.length === 1;

        // Show confirmation dialog
        MessageBox.confirm(
          bIsSingleProductSelected
            ? this.getTranslatedText(oView, "confirmDeleteProduct", [
                aProductsData.find(
                  (oProduct) => oProduct.Id === aSelectedProductIds[0]
                ).Name,
              ])
            : this.getTranslatedText(oView, "confirmDeleteProducts", [
                aSelectedProductIds.length,
              ]),
          {
            actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
            onClose: (sAction) => {
              if (sAction === MessageBox.Action.OK) {
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
        const bIsSingleProductSelected = aSelectedProductIds.length === 1;

        // Filter out selected products
        const aUpdatedProducts = aProducts.filter(
          (oProduct) => !aSelectedProductIds.includes(oProduct.Id)
        );

        // Update model with filtered products
        oMainModel.setProperty("/Products", aUpdatedProducts);
        MessageToast.show(
          bIsSingleProductSelected
            ? this.getTranslatedText(oView, "productDeletedToast")
            : this.getTranslatedText(oView, "productsDeletedToast", [
                aSelectedProductIds.length,
              ])
        );

        // Update row count in product table row count model
        this._updateProductCount(
          oView,
          oView.byId("productTable").getBinding("rows")
        );

        // Reset selection model
        oView.getModel("appStateModel").setProperty("/selectedProductIds", []);
      },

      /**
       * Enables or disables the delete button based on whether any products are selected.
       * Checks the `selectionModel` for selected product IDs and updates the delete button state accordingly.
       *
       * @private
       */
      _handleDeleteButtonState: function () {
        const oView = this.getView();
        const oAppStateModel = oView.getModel("appStateModel");
        const aSelectedProductIds = oAppStateModel.getProperty(
          "/selectedProductIds"
        );
        const oDeleteButton = this.byId("deleteProductButton");

        if (oDeleteButton) {
          oDeleteButton.setEnabled(aSelectedProductIds.length > 0);
        }
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
            Constants.aProductTableSearchableFields
          );
          if (oFieldFilter) {
            aFilters.push(oFieldFilter);
          }
        });

        return aFilters;
      },

      /**
       * Updates the active filters in the app state model, based on the filled controls in the filter bar.
       * Iterates over the filter group items and checks if the corresponding control has a value.
       * If the control has a value, the filter name is added to the active filters array.
       * The active filters array is then updated in the app state model.
       * @private
       */
      _trackActiveFilters: function () {
        const oView = this.getView();
        const oFilterBar = oView.byId("filterbar");
        const oAppStateModel = oView.getModel("appStateModel");
        const aFilterGroupItems = oFilterBar.getFilterGroupItems();
        const aActiveFilters = [];

        aFilterGroupItems.forEach((oItem) => {
          const oControl = oFilterBar.determineControlByFilterItem(oItem);
          const sFieldName = oItem.getName();

          if (
            oControl &&
            ((typeof oControl.getSelectedKeys === "function" &&
              oControl.getSelectedKeys().length > 0) ||
              (typeof oControl.getValue === "function" &&
                oControl.getValue().trim() !== ""))
          ) {
            aActiveFilters.push(sFieldName);
          }
        });

        oAppStateModel.setProperty("/activeFilters", aActiveFilters);
      },

      /**
       * Creates a filter for the given field and value, based on the field type.
       * @param {string} sField - The name of the field to filter on.
       * @param {any} vFilterValue - The value to filter on.
       * @returns {sap.ui.model.Filter} - The filter to apply to the table's binding.
       * @private
       */
      _buildFilterForSpecificField: function (sField, vFilterValue) {
        if (sField === Constants.oProductTableColumns.NAME_FIELD) {
          const aSearchFilters = this.createTableSearchFilters(
            vFilterValue,
            Constants.aProductTableSearchableFields
          );
          return aSearchFilters.length
            ? new Filter(aSearchFilters, false)
            : null;
        }

        // For release date
        if (sField === Constants.oProductTableColumns.RELEASE_DATE_FIELD) {
          const oStartDate = new Date(vFilterValue);
          oStartDate.setHours(0, 0, 0, 0);

          const oEndDate = new Date(vFilterValue);
          oEndDate.setHours(23, 59, 59, 999);

          return new Filter(sField, FilterOperator.BT, oStartDate, oEndDate);
        }

        // For other fields
        if (Array.isArray(vFilterValue)) {
          const aMultiFilters = vFilterValue.map(
            (filterValue) => new Filter(sField, FilterOperator.EQ, filterValue)
          );
          return new Filter(aMultiFilters, false);
        }

        return new Filter(
          sField,
          typeof vFilterValue === "string"
            ? FilterOperator.Contains
            : FilterOperator.EQ,
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
        const oAppStateModel = oView.getModel("appStateModel");

        oAppStateModel.setProperty("/productFormData", {
          Name: "",
          Price: null,
          Category: "",
          Brand: "",
          SupplierName: "",
          ReleaseDate: new Date(),
          StockStatus: Constants.oStockStatuses.IN_STOCK,
          Rating: null,
        });
      },
    });
  }
);
