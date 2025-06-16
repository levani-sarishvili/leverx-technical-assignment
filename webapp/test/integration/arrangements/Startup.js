sap.ui.define(["sap/ui/test/Opa5"], function (Opa5) {
  "use strict";

  return Opa5.extend(
    "levani.sarishvili.test.integration.arrangements.Startup",
    {
      iStartMyApp: function () {
        this.iStartMyAppInAFrame("../../../index.html");
      },
    }
  );
});
