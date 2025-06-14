/*global QUnit */
sap.ui.define([], function () {
  "use strict";

  QUnit.module("Module A");

  QUnit.test("Basic test example", (assert) => {
    assert.ok(true, "this test is fine");
    var value = "hello1";
    assert.equal(value, "hello1", "We expect value to be 'hello1'");
  });
});
