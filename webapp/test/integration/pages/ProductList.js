sap.ui.define(
  [
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/actions/EnterText",
    "sap/ui/test/matchers/PropertyStrictEquals",
  ],
  function (Opa5, Press, EnterText, PropertyStrictEquals) {
    "use strict";
    const sProductListViewName = "ProductList";
    const sProductDetailsViewName = "ProductDetails";

    const oTestProductData = {
      name: "Samsung Galaxy S26",
      price: 1500,
      category: "Smartphone",
      brand: "Samsung",
      supplierName: "TechWorld Distributors",
      releaseDate: "2025-06-15",
      stockStatus: "In Stock",
      rating: 5,
    };

    // Page Objects
    Opa5.createPageObjects({
      onTheProductListPage: {
        actions: {
          iPressCreateProductButton: function () {
            return this.waitFor({
              id: "createProductButton",
              viewName: sProductListViewName,
              actions: new Press(),
              errorMessage: "Create product button not found.",
            });
          },

          iEnterNewProductDetails: function () {
            // Product Name
            this.waitFor({
              id: "nameInput",
              viewName: sProductListViewName,
              actions: new EnterText({ text: oTestProductData.name }),
              errorMessage: "Name input not found",
            });

            // Product Price
            this.waitFor({
              id: "priceInput",
              viewName: sProductListViewName,
              actions: new EnterText({ text: oTestProductData.price }),
              errorMessage: "Price input not found",
            });

            // Product Category
            this.waitFor({
              id: "categoryInput",
              viewName: sProductListViewName,
              actions: new Press(),
              success: function () {
                Opa5.assert.ok(true, "Category select opened");
              },
              errorMessage: "Category input not found",
            });

            this.waitFor({
              controlType: "sap.ui.core.Item",
              matchers: function (oItem) {
                return oItem.getText() === oTestProductData.category;
              },
              actions: new Press(),
              errorMessage: "Select item 'Electronics' not found",
            });

            // Product Brand
            this.waitFor({
              id: "brandInput",
              viewName: sProductListViewName,
              actions: new Press(),
              success: function () {
                Opa5.assert.ok(true, "Brand select opened");
              },
              errorMessage: "Brand input not found",
            });

            this.waitFor({
              controlType: "sap.ui.core.Item",
              matchers: function (oItem) {
                return oItem.getText() === oTestProductData.brand;
              },
              actions: new Press(),
              errorMessage: "Select item 'Samsung' not found",
            });

            // Product supplier
            this.waitFor({
              id: "supplierNameInput",
              viewName: sProductListViewName,
              actions: new EnterText({ text: oTestProductData.supplierName }),
              errorMessage: "Supplier input not found",
            });

            // Product Release Date
            this.waitFor({
              id: "releaseDateInput",
              viewName: sProductListViewName,
              actions: new EnterText({ text: oTestProductData.releaseDate }),
              errorMessage: "Release Date input not found",
            });

            // Product Rating
            this.waitFor({
              id: "ratingInput",
              viewName: sProductListViewName,
              actions: new EnterText({ text: oTestProductData.rating }),
              errorMessage: "Rating input not found",
            });
          },

          iPressNewProductSaveButton: function () {
            return this.waitFor({
              id: "newProductSaveButton",
              viewName: sProductListViewName,
              actions: new Press(),
              errorMessage: "Product save button not found",
            });
          },

          iNavigateToHome: function () {
            return this.waitFor({
              id: "navigateToHome",
              viewName: sProductDetailsViewName,
              actions: new Press(),
              errorMessage: "Navigate to home not found",
            });
          },

          iSearchForNewProduct: function () {
            return this.waitFor({
              id: "searchField",
              viewName: sProductListViewName,
              actions: new EnterText({ text: oTestProductData.name }),
              errorMessage: "Search input not found",
            });
          },

          iSelectNewProduct: function () {
            return this.waitFor({
              id: "productTable",
              viewName: sProductListViewName,
              controlType: "sap.ui.table.Table",
              success: function (oTable) {
                const aContexts = oTable.getBinding("rows").getContexts(0);
                const iIndex = aContexts.findIndex(
                  (ctx) => ctx.getObject().Name === oTestProductData.name
                );

                if (iIndex >= 0) {
                  oTable.setSelectedIndex(iIndex);
                  oTable.fireRowSelectionChange({ rowIndex: iIndex });
                } else {
                  throw new Error("Matching product not found in table");
                }
              },
              errorMessage: "Product table not found",
            });
          },

          iDeleteNewProduct: function () {
            return this.waitFor({
              id: "deleteProductButton",
              viewName: sProductListViewName,
              actions: new Press(),
              errorMessage: "Delete product button not found",
            });
          },

          iConfirmDeleteProduct: function () {
            return this.waitFor({
              controlType: "sap.m.Button",
              searchOpenDialogs: true,
              matchers: new PropertyStrictEquals({
                name: "text",
                value: "OK",
              }),
              actions: new Press(),
              errorMessage: "Could not find the OK button in the MessageBox",
            });
          },

          iClearSearchInput: function () {
            return this.waitFor({
              id: "searchField",
              viewName: sProductListViewName,
              actions: new EnterText({ text: "" }),
              errorMessage: "Search input not found",
            });
          },
        },

        // Assertions
        assertions: {
          iShouldSeeNewProductName: function () {
            return this.waitFor({
              id: "productDetailsTitle",
              viewName: sProductDetailsViewName,
              matchers: new PropertyStrictEquals({
                name: "text",
                value: oTestProductData.name,
              }),
              success: function () {
                Opa5.assert.ok(true, "Product name is correct");
              },
              errorMessage: "Product name is not correct",
            });
          },
        },
      },
    });
  }
);
