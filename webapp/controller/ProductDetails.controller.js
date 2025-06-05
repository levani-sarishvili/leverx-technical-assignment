sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "levani/sarishvili/model/formatter",
    "sap/ui/core/Fragment",
  ],
  function (Controller, Filter, FilterOperator, formatter, Fragment) {
    "use strict";

    return Controller.extend("webapp.controller.ProductDetails", {
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

      // Displays the specified form fragment
      _showFormFragment: function (sFragmentName) {
        let oVBoxContainer = this.byId("productDetailsContainer");

        oVBoxContainer.removeAllItems();

        this._getFormFragment(sFragmentName).then(function (oFragment) {
          oVBoxContainer.addItem(oFragment);
        });
      },

      // Loads the form fragment if it hasn't been loaded yet
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

      onEditProductPress: function () {
        this._toggleButtonsAndView(true);
      },

      onSaveChangesPress: function () {
        const oView = this.getView();
        const oModel = oView.getModel("productFormModel");

        oModel.updateBindings(true);
        this._toggleButtonsAndView(false);
      },

      onCancelChangesPress: function () {
        this._toggleButtonsAndView(false);
      },

      // Toggles between the display and edit forms
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

      // Formatters
      formatter: formatter,

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
    });
  }
);
