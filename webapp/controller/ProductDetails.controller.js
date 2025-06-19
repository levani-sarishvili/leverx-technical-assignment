sap.ui.define(
  [
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "levani/sarishvili/model/formatter",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "levani/sarishvili/model/models",
    "levani/sarishvili/controller/BaseController",
    "levani/sarishvili/constants/Constants",
  ],
  function (
    Filter,
    FilterOperator,
    formatter,
    Fragment,
    MessageToast,
    MessageBox,
    models,
    BaseController,
    Constants
  ) {
    "use strict";

    return BaseController.extend("webapp.controller.ProductDetails", {
      formatter: formatter,

      /**
       * Initializes the ProductDetails controller.
       *
       * Sets up the router to listen for the "ProductDetails" route pattern match event
       * and binds the onPatternMatched method as the event handler.
       */
      onInit: function () {
        // Create app state model
        this.getView().setModel(models.createAppViewModel(), "appViewModel");

        this._formFragments = {};
        this._sProductId = "";

        this.getOwnerComponent()
          .getRouter()
          .getRoute("ProductDetails")
          .attachPatternMatched(this.onPatternMatched.bind(this));

        // Set the initial form to be the display one
        this._showFormFragment("DisplayProductDetails");
      },

      /**
       * Called before the view is rendered.
       *
       * This hook is used to convert the release date from a string to a Date object
       * so that it can be bound to the table using the sap.ui.model.type.Date type.
       *
       * @public
       */
      onBeforeRendering: function () {
        const oView = this.getView();
        const oModel = oView.getModel();
        const aSalesOrdersData = oModel.getData().SalesOrders;

        aSalesOrdersData.forEach((oSalesOrder) => {
          oSalesOrder.OrderDate = new Date(oSalesOrder.OrderDate);
        });

        // Update table row count model
        this.getView()
          .getModel("appViewModel")
          .setProperty(
            "/salesOrderTableRowCount",
            aSalesOrdersData.filter(
              (oSalesOrder) => oSalesOrder.ProductId === this._sProductId
            ).length
          );
      },

      /**
       * Handles route match for the ProductDetails view.
       *
       * Retrieves the product ID from the route, waits for product data if needed,
       * binds the selected product to the view, filters the orders table,
       * and updates the sales order count.
       *
       * @param {sap.ui.base.Event} oEvent - Routing event with product ID parameter.
       * @async
       */

      onPatternMatched: async function (oEvent) {
        const oView = this.getView();
        const oModel = oView.getModel();
        const sProductId = oEvent.getParameter("arguments").productId;
        this._sProductId = sProductId;

        // Wait for data if not loaded
        if (!oModel.getProperty("/Products")?.length) {
          await new Promise((resolve) =>
            oModel.attachEventOnce("requestCompleted", resolve)
          );
        }

        const aProducts = oModel.getProperty("/Products");
        const oSelectedProduct = aProducts.find(
          (oProduct) => String(oProduct.Id) === String(sProductId)
        );

        if (!oSelectedProduct) {
          console.error("Product not found:", sProductId);
          return;
        }

        // Process product
        oSelectedProduct.ReleaseDate = new Date(oSelectedProduct.ReleaseDate);
        oView.bindObject({
          path: `/Products/${aProducts.indexOf(oSelectedProduct)}`,
        });

        // Filter table
        const oTable = this.byId("productOrdersTable");
        const oBinding = oTable.getBinding("rows");
        oBinding.filter([
          new Filter("ProductId", FilterOperator.EQ, sProductId),
        ]);

        // Update UI
        this._bindSelectedProductToForm(oSelectedProduct);
        this._updateSalesOrderCount(oView, oBinding);
      },

      /**
       * Handles the back button press by navigating to the ProductList page.
       * @public
       */
      onNavToHome: function () {
        this.getOwnerComponent().getRouter().navTo("ProductList");
      },

      /**
       * Updates the sales order table row count model with the current binding length.
       * @param {sap.ui.core.mvc.View} oView The view containing the sales order table.
       * @param {sap.ui.model.Binding} oBinding The binding of the sales order table.
       * @private
       */
      _updateSalesOrderCount: function (oView, oBinding) {
        const iCount = oBinding.getLength();
        const oAppViewModel = oView.getModel("appViewModel");
        oAppViewModel.setProperty(
          "/tableRowCount/salesOrderTableRowCount",
          iCount
        );
      },

      /**
       * Shows a form fragment by name, removing the existing fragment if necessary.
       *
       * Retrieves the named fragment using the _getFormFragment method, and adds it to the
       * product details container, removing any existing content first.
       *
       * @param {string} sFragmentName - The name of the fragment to show.
       * @private
       */
      _showFormFragment: async function (sFragmentName) {
        let oVBoxContainer = this.byId("productDetailsContainer");
        oVBoxContainer.removeAllItems();
        const oFragment = await this._getFormFragment(sFragmentName);
        oVBoxContainer.addItem(oFragment);
      },

      /**
       * Retrieves a form fragment by name, loading it if necessary.
       *
       * Checks the _formFragments cache first, and if the fragment is not found, loads it
       * and caches it for future requests.
       *
       * @param {string} sFragmentName - The name of the fragment to retrieve.
       * @returns {Promise<sap.ui.core.Fragment>} - A promise resolving with the loaded fragment.
       */
      _getFormFragment: async function (sFragmentName) {
        const oView = this.getView();

        if (!this._formFragments[sFragmentName]) {
          this._formFragments[sFragmentName] = await Fragment.load({
            id: oView.getId(),
            name: `levani.sarishvili.view.fragments.${sFragmentName}`,
            controller: this,
          });
        }

        return this._formFragments[sFragmentName];
      },

      /**
       * Handles the edit product button press event.
       *
       * Toggles the buttons and the view to the edit form.
       * @public
       */
      onEditProductPress: function (oEvent) {
        const oProduct = oEvent.getSource().getBindingContext().getObject();
        this._bindSelectedProductToForm(oProduct);
        this._toggleButtonsAndView(true);
      },
      /**
       * Handles the save changes button press event.
       *
       * Updates the product with the new data in the model and toggles the buttons and view back to the display mode.
       * Shows a success message after the update.
       * @public
       */
      onSaveChangesPress: function (oEvent) {
        const oView = this.getView();
        const oAppViewModel = oView.getModel("appViewModel").getData();
        const oProductModel = oView.getModel();
        const oEditProductForm = this.byId("productDetailsEditForm");
        const aProductsData = oProductModel.getProperty("/Products");
        const oProductFormData = this.getView()
          .getModel("appViewModel")
          .getProperty("/productFormData");
        const sProductId = oEvent
          .getSource()
          .getBindingContext()
          .getProperty("Id");
        const oProduct = aProductsData.find(
          (oProduct) => oProduct.Id === sProductId
        );

        // Check if product details have been modified
        if (!this._checkIfProductDetailsModified(oProduct, oProductFormData)) {
          return;
        }

        // Validate product form inputs
        const bIsFormValid = this.validateForm(oEditProductForm);
        if (!bIsFormValid) {
          return;
        }

        const oUpdatedProductsData = aProductsData.map((oProduct) => {
          if (oProduct.Id === oAppViewModel.productFormData.Id) {
            return oAppViewModel.productFormData;
          }
          return oProduct;
        });

        // Update the product in the model
        oProductModel.setProperty("/Products", oUpdatedProductsData);

        this._toggleButtonsAndView(false);

        // Show success message
        MessageToast.show(this.getTranslatedText("productUpdatedToast"));
      },

      /**
       * Handles the cancel changes button press event.
       *
       * Retrieves the current product form data and the original product data for the selected product.
       * If the data has not been modified, toggles the view back to display mode.
       * If modifications are detected, shows a confirmation dialog to confirm discarding changes.
       * On confirmation, resets the product form data to its original state and toggles the view back to display mode.
       *
       * @param {sap.ui.base.Event} oEvent - The event triggered when the cancel changes button is pressed.
       * @public
       */
      onCancelChangesPress: function (oEvent) {
        const oProductFormData = this.getView()
          .getModel("appViewModel")
          .getProperty("/productFormData");

        const sProductId = oEvent
          .getSource()
          .getBindingContext()
          .getProperty("Id");

        const aProductsData = this.getView()
          .getModel()
          .getProperty("/Products");

        const oProduct = aProductsData.find(
          (oProduct) => oProduct.Id === sProductId
        );

        // Check if product details have been modified
        if (!this._checkIfProductDetailsModified(oProduct, oProductFormData)) {
          this._toggleButtonsAndView(false);
          return;
        }

        // Show confirmation dialog
        MessageBox.confirm(this.getTranslatedText("confirmCancelChanges"), {
          onClose: (sAction) => {
            if (sAction === MessageBox.Action.OK) {
              this.getView()
                .getModel("appViewModel")
                .setProperty("/productFormData", oProduct);
              this._toggleButtonsAndView(false);
            }
          },
        });
      },

      /**
       * Checks if the product details have been modified.
       *
       * Compares the original product data with the modified product form data.
       * Returns true if the data has been modified, false otherwise.
       * Also returns true if the productFormData is null or undefined.
       *
       * @param {object} oProductData - Original product data.
       * @param {object} oProductFormData - Modified product form data.
       * @returns {boolean} True if the data has been modified, false otherwise.
       * @private
       */
      _checkIfProductDetailsModified: function (
        oProductData,
        oProductFormData
      ) {
        return (
          JSON.stringify(oProductData) !== JSON.stringify(oProductFormData) ||
          !oProductFormData
        );
      },

      /**
       * Handles the delete product button press event.
       *
       * Retrieves the selected product ID from the event context and shows a confirmation dialog
       * to confirm the deletion. If the user confirms, the product is removed from the product
       * and sales orders lists in the model. Displays a success message and navigates back to the
       * product list view.
       *
       * @param {sap.ui.base.Event} oEvent - The event triggered when the delete product button is pressed.
       */

      onDeleteProductPress: function (oEvent) {
        const oView = this.getView();
        const oProductModel = oView.getModel();
        const oProductData = oEvent.getSource().getBindingContext().getObject();
        const sProductId = oProductData.Id;

        // Show confirmation dialog
        MessageBox.confirm(
          this.getTranslatedText("confirmDeleteProduct", [oProductData.Name]),
          {
            onClose: (sAction) => {
              if (sAction === MessageBox.Action.OK) {
                if (sAction !== MessageBox.Action.OK) {
                  return;
                }

                const aProducts = oProductModel.getProperty("/Products");
                const aSalesOrders = oProductModel.getProperty("/SalesOrders");

                const aUpdatedProducts = aProducts.filter(
                  (oProduct) => oProduct.Id !== sProductId
                );
                const aUpdatedSalesOrders = aSalesOrders.filter(
                  (oSalesOrder) => oSalesOrder.ProductId !== sProductId
                );
                oProductModel.setProperty("/Products", aUpdatedProducts);
                oProductModel.setProperty("/SalesOrders", aUpdatedSalesOrders);
                // Show success message
                MessageToast.show(
                  this.getTranslatedText("productDeletedToast", [
                    oProductData.Name,
                  ])
                );

                oView.unbindObject();

                // Navigate back to the product list
                this.getOwnerComponent().getRouter().navTo("ProductList");
              }
            },
          }
        );
      },

      /**
       * Handles the sort event for the orders table.
       *
       * Applies a sort to the orders table binding based on the event parameters and the order ID.
       * @param {sap.ui.base.Event} oEvent - The sort event containing the column and sort order information.
       * @public
       */
      onOrderTableSort: function (oEvent) {
        const oTable = this.byId("productOrdersTable");
        this.sortTable(oEvent, oTable, Constants.oUniqueIdNames.OrderId);
      },

      /**
       * Handles the search input in the orders table filter bar.
       *
       * Applies a filter to the orders table binding based on the search query.
       * If the query is empty, filters only by the current product ID.
       * Otherwise, filters by the product ID and the search query.
       * Uses OR filter logic to apply the search query to the order status, customer name, and order ID.
       *
       * @param {sap.ui.base.Event} oEvent - The search event containing the query parameter.
       */
      onOrderSearchPress: function (oEvent) {
        const oView = this.getView();
        const sQuery = oEvent.getSource().getValue();
        const oTable = this.byId("productOrdersTable");
        const oBinding = oTable.getBinding("rows");

        if (!sQuery) {
          oBinding.filter(
            new Filter("ProductId", FilterOperator.EQ, this._sProductId)
          );
          // Update table row count
          this._updateSalesOrderCount(oView, oBinding);
          return;
        }

        // Search filters
        const aSearchFilters = this.createTableSearchFilters(
          sQuery,
          Constants.oOrderTableSearchableFields
        );

        const oFinalFilter = new Filter({
          filters: [
            new Filter("ProductId", FilterOperator.EQ, this._sProductId),
            new Filter({ filters: aSearchFilters, and: false }),
          ],
          and: true,
        });

        // Apply filter
        oBinding.filter(oFinalFilter);
      },

      /**
       * Toggles the visibility of the action buttons and form type based on whether the user is in edit mode or not.
       *
       * @param {boolean} bEdit - Whether the user is in edit mode or not.
       * @private
       */
      _toggleButtonsAndView: function (bEdit) {
        const oView = this.getView();
        const oAppViewModel = oView.getModel("appViewModel");

        // Update editMode state
        oAppViewModel.setProperty("/editMode", bEdit);

        // Set the right form type
        this._showFormFragment(
          bEdit ? "EditProductDetails" : "DisplayProductDetails"
        );
      },

      /**
       * Binds the selected product data to the product form model.
       *
       * Creates a deep copy of the product object to avoid modifying the original reference.
       * Converts the `ReleaseDate` property from a string to a Date object, if present.
       * Sets the cloned and modified product data to the `productFormModel` for UI data binding.
       *
       * @param {object} oProduct - The product object to be bound to the form model.
       * @private
       */
      _bindSelectedProductToForm: function (oProduct) {
        // Deep copy to avoid reference to original object
        const oClonedProduct = JSON.parse(JSON.stringify(oProduct));
        // Convert ReleaseDate from string to Date object
        if (oClonedProduct.ReleaseDate) {
          oClonedProduct.ReleaseDate = new Date(oClonedProduct.ReleaseDate);
        }

        this.getView()
          .getModel("appViewModel")
          .setProperty("/productFormData", oClonedProduct);
      },
    });
  }
);
