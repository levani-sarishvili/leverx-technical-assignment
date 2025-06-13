/*global QUnit */
sap.ui.define([], function () {
  "use strict";

  QUnit.module("Module B");

  QUnit.test("Addition test", function (assert) {
    var result = 2 + 3;
    assert.equal(result, 5, "2 + 3 should equal 5");
  });
});
