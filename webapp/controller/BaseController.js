sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (Controller, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("levani.sarishvili.controller.BaseController", {
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

      /**
       * Creates an array of filters for the provided query and fields.
       *
       * Each field in the array is converted into a filter based on its type.
       * If the field type is "Number", an equality filter is used with the query
       * parsed as a float. Otherwise, a contains filter is used.
       *
       * @param {string} sQuery - The search query to filter with.
       * @param {Object[]} aFields - An array of field objects, each containing a title and type.
       * @returns {sap.ui.model.Filter[]} An array of Filter objects or an empty array if no query or fields are provided.
       * @private
       */
      createTableSearchFilters: function (sQuery, aFields) {
        if (!sQuery || !aFields?.length) {
          return [];
        }

        return aFields.map((oField) => {
          const bIsNumericField = oField.type === "Number";
          return new Filter(
            oField.title,
            bIsNumericField ? FilterOperator.EQ : FilterOperator.Contains,
            bIsNumericField ? parseFloat(sQuery) : sQuery
          );
        });
      },

      /**
       * Resets the validation state and message of all controls in the form.
       * Each control in the form is checked if it has the setValueState and setValueStateText methods.
       * If a control has these methods, its validation state is reset to "None" and its validation message is cleared.
       * @param {sap.ui.core.Control} oForm - The form to reset the validations for.
       * @private
       */
      resetFormValidations: function (oForm) {
        const aControls = oForm.getContent();

        aControls.forEach(function (oControl) {
          if (oControl.setValueState) {
            oControl.setValueState("None");
          }
          if (oControl.setValueStateText) {
            oControl.setValueStateText("");
          }
        });
      },
    });
  }
);
