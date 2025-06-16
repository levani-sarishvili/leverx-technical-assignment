sap.ui.define(
  [
    "levani/sarishvili/controller/BaseController",
    "sap/ui/model/FilterOperator",
  ],
  function (BaseController, FilterOperator) {
    "use strict";

    QUnit.module("controller/BaseController.js");

    const oMockFields = [
      { label: "title", type: "STRING" },
      { label: "amount", type: "NUMBER" },
    ];

    const controller = new BaseController();

    // Text for empty query
    QUnit.test("Returns empty array when query is empty", function (assert) {
      const result = controller.createTableSearchFilters("", oMockFields);
      assert.deepEqual(result, [], "Empty query returns []");
    });

    // Text for empty fields
    QUnit.test(
      "Returns empty array when fields array is empty",
      function (assert) {
        const result = controller.createTableSearchFilters("test", []);
        assert.deepEqual(result, [], "Empty fields returns []");
      }
    );

    // Text for STRING field
    QUnit.test("Creates correct filter for STRING field", function (assert) {
      const result = controller.createTableSearchFilters("apple", [
        { label: "name", type: "STRING" },
      ]);
      assert.equal(result.length, 1, "Should return 1 filter");
      assert.equal(result[0].sPath, "name", "Should use correct path");
      assert.equal(
        result[0].sOperator,
        FilterOperator.Contains,
        "Should use correct operator"
      );
      assert.equal(result[0].oValue1, "apple", "Should use correct value");
    });

    // Text for NUMBER field
    QUnit.test("Creates correct filter for NUMBER field", function (assert) {
      const result = controller.createTableSearchFilters("42", [
        { label: "price", type: "NUMBER" },
      ]);
      assert.equal(result.length, 1, "Should return 1 filter");
      assert.equal(result[0].sPath, "price", "Should use correct path");
      assert.equal(
        result[0].sOperator,
        FilterOperator.EQ,
        "Should use correct operator"
      );
      assert.strictEqual(result[0].oValue1, 42, "Should use correct value");
    });
  }
);
