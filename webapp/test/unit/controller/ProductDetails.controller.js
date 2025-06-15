sap.ui.define(
  ["levani/sarishvili/controller/ProductDetails.controller"],
  function (ProductDetailsController) {
    "use strict";
    QUnit.module("controller/ProductDetails.controller.js");

    const oControllerInstance = new ProductDetailsController();

    // Test for modified product data
    QUnit.test("returns true if product data is modified", function (assert) {
      const original = {
        name: "Phone",
        price: 100,
        category: "Smartphone",
        brand: "Apple",
        supplierName: "TechWorld Distributors",
        releaseDate: "2025-03-22",
        stockStatus: "In Stock",
        rating: 5,
      };
      const modified = {
        name: "Tablet",
        price: 200,
        category: "Tablet",
        brand: "Apple",
        supplierName: "TechWorld Distributors",
        releaseDate: "2025-03-22",
        stockStatus: "In Stock",
        rating: 5,
      };

      const result = oControllerInstance._checkIfProductDetailsModified(
        original,
        modified
      );
      assert.strictEqual(result, true, "Detected modified product data");
    });

    // Test for unchanged product data
    QUnit.test("returns false if product data is unchanged", function (assert) {
      const productData = {
        name: "Phone",
        price: 100,
        category: "Smartphone",
        brand: "Apple",
        supplierName: "TechWorld Distributors",
        releaseDate: "2025-03-22",
        stockStatus: "In Stock",
        rating: 5,
      };

      const result = oControllerInstance._checkIfProductDetailsModified(
        productData,
        {
          ...productData,
        }
      );
      assert.strictEqual(result, false, "No modification detected");
    });

    // Test for missing form data
    QUnit.test("returns true if form data is missing", function (assert) {
      const original = {
        name: "Phone",
        price: 100,
        category: "Smartphone",
        brand: "Apple",
        supplierName: "TechWorld Distributors",
        releaseDate: "2025-03-22",
        stockStatus: "In Stock",
        rating: 5,
      };

      const result = oControllerInstance._checkIfProductDetailsModified(
        original,
        null
      );
      assert.strictEqual(result, true, "Detected missing form data");
    });
  }
);
