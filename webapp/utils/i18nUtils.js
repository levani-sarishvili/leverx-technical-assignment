sap.ui.define([], function () {
  "use strict";

  return {
    /**
     * Retrieves a translated text from the i18n model.
     * @param {sap.ui.core.mvc.View} oView - The view to retrieve the i18n model from.
     * @param {string} sKey - The key of the text to retrieve.
     * @param {Array} [aArgs] - The arguments to format the text with.
     * @returns {string} The translated text.
     */
    getTranslatedText: function (oView, sKey, aArgs) {
      return oView.getModel("i18n").getResourceBundle().getText(sKey, aArgs);
    },
  };
});
