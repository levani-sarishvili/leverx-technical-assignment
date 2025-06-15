sap.ui.define(() => {
	"use strict";

	return {
		name: "QUnit test suite for UI5 Walkthrough",
		defaults: {
			page: "ui5://test-resources/levani/sarishvili/Test.qunit.html?testsuite={suite}&test={name}",
			qunit: {
				version: 2
			},
			ui5: {
				theme: "sap_horizon"
			},
			loader: {
				paths: {
					"levani/sarishvili": "../"
				}
			}
		},
		tests: {
			"unit/unitTests": {
				title: "levani sarishvili - Unit Tests"
			}
		}
	};
});
