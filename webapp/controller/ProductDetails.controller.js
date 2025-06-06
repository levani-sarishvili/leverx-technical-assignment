sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "levani/sarishvili/model/formatter",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "levani/sarishvili/utils/i18nUtils",
  ],
  function (
    Controller,
    Filter,
    FilterOperator,
    formatter,
    Fragment,
    MessageToast,
    MessageBox,
    i18nUtils
  ) {
    "use strict";

    return Controller.extend("webapp.controller.ProductDetails", {
      // Formatters
      formatter: formatter,

      /**
       * Initializes the ProductDetails controller.
       *
       * Sets up the router to listen for the "ProductDetails" route pattern match event
       * and binds the onPatternMatched method as the event handler.
       */
      onInit: function () {
        this._formFragments = {};

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
       * @private
       */
      onBeforeRendering: function () {
        const oView = this.getView();
        const oModel = oView.getModel();
        const oProductsData = oModel.getData().Products;

        oProductsData.forEach((oProduct) => {
          oProduct.ReleaseDate = new Date(oProduct.ReleaseDate);
        });
      },

      /**
       * Handles the "ProductDetails" route pattern match event.
       *
       * This method is called when the router matches the "ProductDetails" route pattern.
       * It retrieves the product ID from the route arguments and filters the product table
       * to show only the selected product. If the product is found, it is bound to the view.
       *
       * @param {sap.ui.base.Event} oEvent - The event containing the route arguments.
       * @private
       */
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
        const oFilter = new Filter("ProductId", FilterOperator.EQ, sProductId);
        oBinding.filter([oFilter]);

        // Find and bind the selected product
        const oSelectedProduct = aFinalProducts.find(
          (oProduct) => String(oProduct.Id) === String(sProductId)
        );

        // If the product is found, bind it to the view
        if (oSelectedProduct) {
          const iIndex = aFinalProducts.indexOf(oSelectedProduct);
          console.log(iIndex);
          oView.bindObject({
            path: "/Products/" + iIndex,
          });
        } else {
          console.error("Product not found:", sProductId);
        }
      },

      /**
       * Handles the back button press by navigating to the ProductList page.
       * @public
       */
      onNavToHome: function () {
        this.getOwnerComponent().getRouter().navTo("ProductList");
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
      _showFormFragment: function (sFragmentName) {
        let oVBoxContainer = this.byId("productDetailsContainer");
        oVBoxContainer.removeAllItems();
        this._getFormFragment(sFragmentName).then(function (oFragment) {
          oVBoxContainer.addItem(oFragment);
        });
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
      _getFormFragment: function (sFragmentName) {
        let pFormFragment = this._formFragments[sFragmentName],
          oView = this.getView();

        if (!pFormFragment) {
          pFormFragment = Fragment.load({
            id: oView.getId(),
            name: "levani.sarishvili.view.fragments." + sFragmentName,
          });
          this._formFragments[sFragmentName] = pFormFragment;
        }

        return pFormFragment;
      },

      /**
       * Handles the edit product button press event.
       *
       * Toggles the buttons and the view to the edit form.
       * @private
       */
      onEditProductPress: function () {
        this._toggleButtonsAndView(true);
      },

      /**
       * Handles the save changes button press event.
       *
       * Saves the product changes and goes back to the product details view.
       * Shows a success message to the user to indicate that the changes have been saved.
       * @private
       */
      onSaveChangesPress: function () {
        const oView = this.getView();
        this._toggleButtonsAndView(false);
        // Show success message
        MessageToast.show(
          i18nUtils.getTranslatedText(oView, "productUpdatedToast")
        );
      },

      /**
       * Handles the cancel changes button press event.
       *
       * Cancels the editing and goes back to the product details view.
       * @private
       */
      onCancelChangesPress: function () {
        this._toggleButtonsAndView(false);
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
        const sProductId = oEvent
          .getSource()
          .getBindingContext()
          .getProperty("Id");

        // Show confirmation dialog
        MessageBox.confirm(
          i18nUtils.getTranslatedText(oView, "confirmDeleteProduct"),
          {
            actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
            onClose: (sAction) => {
              if (sAction === MessageBox.Action.OK) {
                const aProducts = oProductModel.getProperty("/Products");
                const aSalesOrders = oProductModel.getProperty("/SalesOrders");

                const aUpdatedProducts = aProducts.filter(
                  (oProduct) => oProduct.Id !== sProductId
                );
                console.log(aUpdatedProducts);
                const aUpdatedSalesOrders = aSalesOrders.filter(
                  (oSalesOrder) => oSalesOrder.ProductId !== sProductId
                );
                oProductModel.setProperty("/Products", aUpdatedProducts);
                oProductModel.setProperty("/SalesOrders", aUpdatedSalesOrders);
                // Show success message
                MessageToast.show(
                  i18nUtils.getTranslatedText(oView, "productDeletedToast")
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
       * Toggles the visibility of the action buttons and form type based on whether the user is in edit mode or not.
       *
       * @param {boolean} bEdit - Whether the user is in edit mode or not.
       * @private
       */
      _toggleButtonsAndView: function (bEdit) {
        const oView = this.getView();

        // Show the appropriate action buttons
        oView.byId("productEditButton").setVisible(!bEdit);
        oView.byId("productDeleteButton").setVisible(!bEdit);
        oView.byId("productSaveButton").setVisible(bEdit);
        oView.byId("productCancelButton").setVisible(bEdit);

        // Set the right form type
        this._showFormFragment(
          bEdit ? "EditProductDetails" : "DisplayProductDetails"
        );
      },
    });
  }
);
