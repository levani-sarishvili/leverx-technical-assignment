sap.ui.define(
  [
    "sap/ui/test/opaQunit",
    "levani/sarishvili/test/integration/pages/ProductList",
    "levani/sarishvili/test/integration/arrangements/Startup",
  ],
  function (opaTest, ProductList, Startup) {
    "use strict";

    QUnit.module("Create new product and delete it");

    sap.ui.test.Opa5.extendConfig({
      arrangements: new Startup(),
      viewNamespace: "levani.sarishvili.view",
      autoWait: true,
    });

    opaTest("Should add and delete a product", function (Given, When, Then) {
      Given.iStartMyApp();

      When.onTheProductListPage.iPressCreateProductButton();

      When.onTheProductListPage.iEnterNewProductDetails();

      When.onTheProductListPage.iPressNewProductSaveButton();

      Then.onTheProductListPage.iShouldSeeNewProductName();

      When.onTheProductListPage.iNavigateToHome();

      When.onTheProductListPage.iSearchForNewProduct();

      When.onTheProductListPage.iSelectNewProduct();

      When.onTheProductListPage.iDeleteNewProduct();

      When.onTheProductListPage.iConfirmDeleteProduct();

      When.onTheProductListPage.iClearSearchInput();

      Then.iTeardownMyAppFrame();
    });
  }
);
