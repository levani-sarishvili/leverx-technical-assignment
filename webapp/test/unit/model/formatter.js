sap.ui.define(
  [
    "levani/sarishvili/model/formatter",
    "levani/sarishvili/constants/Constants",
    "sap/ui/core/library",
  ],
  function (formatter, Constants, coreLibrary) {
    "use strict";

    const ValueState = coreLibrary.ValueState;

    QUnit.module("model/formatter.js");

    // Test formatOrderStatus for known statuses
    QUnit.test(
      "Should return correct ValueState for known statuses",
      function (assert) {
        assert.strictEqual(
          formatter.formatOrderStatus(Constants.oOrderStatuses.DELIVERED),
          ValueState.Success,
          "DELIVERED maps to Success"
        );

        assert.strictEqual(
          formatter.formatOrderStatus(Constants.oOrderStatuses.PROCESSING),
          ValueState.Warning,
          "PROCESSING maps to Warning"
        );

        assert.strictEqual(
          formatter.formatOrderStatus(Constants.oOrderStatuses.SHIPPED),
          ValueState.Success,
          "SHIPPED maps to Success"
        );

        assert.strictEqual(
          formatter.formatOrderStatus(Constants.oOrderStatuses.CANCELLED),
          ValueState.Error,
          "CANCELLED maps to Error"
        );
      }
    );

    // Test formatOrderStatus for unknown or undefined status
    QUnit.test(
      "Should return ValueState.None for unknown or undefined status",
      function (assert) {
        assert.strictEqual(
          formatter.formatOrderStatus("RANDOM_STATUS"),
          ValueState.None,
          "Unknown status returns ValueState.None"
        );

        assert.strictEqual(
          formatter.formatOrderStatus(null),
          undefined,
          "null returns undefined"
        );

        assert.strictEqual(
          formatter.formatOrderStatus(undefined),
          undefined,
          "undefined returns undefined"
        );
      }
    );

    // Test formatStockStatus for known statuses
    QUnit.test(
      "Should return correct ValueState for known statuses",
      function (assert) {
        assert.strictEqual(
          formatter.formatStockStatus(Constants.oStockStatuses.IN_STOCK),
          ValueState.Success,
          "IN_STOCK maps to Success"
        );

        assert.strictEqual(
          formatter.formatStockStatus(
            Constants.oStockStatuses.LESS_THAN_10_LEFT
          ),
          ValueState.Warning,
          "LESS_THAN_10_LEFT maps to Warning"
        );

        assert.strictEqual(
          formatter.formatStockStatus(Constants.oStockStatuses.OUT_OF_STOCK),
          ValueState.Error,
          "OUT_OF_STOCK maps to Error"
        );
      }
    );

    // Test formatStockStatus for unknown or undefined status
    QUnit.test(
      "Should return ValueState.None for unknown or undefined status",
      function (assert) {
        assert.strictEqual(
          formatter.formatStockStatus("RANDOM_STATUS"),
          ValueState.None,
          "Unknown status returns ValueState.None"
        );

        assert.strictEqual(
          formatter.formatStockStatus(null),
          undefined,
          "null returns undefined"
        );

        assert.strictEqual(
          formatter.formatStockStatus(undefined),
          undefined,
          "undefined returns undefined"
        );
      }
    );
  }
);
