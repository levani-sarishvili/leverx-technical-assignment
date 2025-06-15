sap.ui.define(
  ["levani/sarishvili/controller/ProductList.controller"],
  function (ProductListController) {
    "use strict";

    QUnit.module("controller/ProductList.controller.js");

    const oControllerInstance = new ProductListController();

    // Test for empty product list
    QUnit.test("returns 0 when product list is empty", function (assert) {
      const result = oControllerInstance._createNewProductId([]);
      assert.strictEqual(result, 0, "Returns 0 for empty product array");
    });

    // Test for increments numeric part of last product ID
    QUnit.test("increments numeric part of last product ID", function (assert) {
      const products = [{ Id: "PO-1" }, { Id: "PO-5" }];
      const result = oControllerInstance._createNewProductId(products);
      assert.strictEqual(result, "PO-6", "Returns PO-6 when last ID is PO-5");
    });

    // Test for handling IDs with non-numeric characters
    QUnit.test(
      "handles IDs with non-numeric characters correctly",
      function (assert) {
        const products = [{ Id: "XYZ-99" }];
        const result = oControllerInstance._createNewProductId(products);
        assert.strictEqual(
          result,
          "PO-100",
          "Returns PO-100 for last ID XYZ-99"
        );
      }
    );
  }
);
