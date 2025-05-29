sap.ui.define([], function () {
  "use strict";

  return {
    getTranslatedText: function (oView, sKey, aArgs) {
      return oView.getModel("i18n").getResourceBundle().getText(sKey, aArgs);
    },
  };
});
