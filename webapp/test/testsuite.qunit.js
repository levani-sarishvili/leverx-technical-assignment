sap.ui.define(function () {
  "use strict";

  return {
    name: "QUnit test suite for levani.sarishvili",
    defaults: {
      page: "ui5://test-resources/levani/sarishvili/Test.qunit.html?testsuite={suite}&test={name}",
      qunit: {
        version: 2,
      },
      sinon: {
        version: 4,
      },
      ui5: {
        theme: "sap_horizon",
      },
      coverage: {
        only: null,
        never: null,
        branchTracking: false,
      },
      loader: {
        paths: {
          "test-resources/levani/sarishvili": "../",
        },
      },
    },
    tests: {
      "unit/AllTests": {
        title: "Unit tests for levani/sarishvili",
      },
    },
  };
});
