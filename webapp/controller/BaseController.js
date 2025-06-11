sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "levani/sarishvili/constants/Constants",
    "sap/ui/core/library",
  ],
  function (
    Controller,
    Filter,
    FilterOperator,
    Sorter,
    Constants,
    coreLibrary
  ) {
    "use strict";

    return Controller.extend("levani.sarishvili.controller.BaseController", {
      /**
       * Retrieves a translated text for the given key from the i18n resource model.
       *
       * @param {sap.ui.core.mvc.View} oView - The view to use for retrieving the i18n model.
       * @param {string} sKey - The key of the text to retrieve.
       * @param {Array<string>} aArgs - Optional array of arguments to use for text formatting.
       * @returns {string} The translated text.
       */
      getTranslatedText: function (sKey, aArgs) {
        const oView = this.getView();
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
       * @public
       */
      createTableSearchFilters: function (sQuery, aFields) {
        if (!sQuery || !aFields?.length) {
          return [];
        }

        return aFields.map((oField) => {
          const bIsNumericField = oField.type === Constants.oDataTypes.NUMBER;
          return new Filter(
            oField.label,
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
       * @public
       */
      resetFormValidations: function (oForm) {
        const aControls = oForm.getContent();

        aControls.forEach(function (oControl) {
          if (oControl.setValueState) {
            oControl.setValueState(coreLibrary.ValueState.None);
          }
          if (oControl.setValueStateText) {
            oControl.setValueStateText("");
          }
        });
      },

      /**
       * Handles the sort event for a table.
       * @param {sap.ui.base.Event} oEvent - The sort event containing the column and sort order information.
       * @param {sap.ui.table.Table} oTable - The table to sort.
       * @public
       */
      sortTable: function (oEvent, oTable, sId) {
        const oColumn = oEvent.getParameter("column");
        const bDescending =
          oEvent.getParameter("sortOrder") ===
          Constants.oSortOptions.DESCENDING;
        const sSortedProperty = oColumn.getSortProperty();

        const aSorters = [
          new Sorter(sSortedProperty, bDescending),
          new Sorter(sId, false),
        ];

        oTable.getBinding("rows").sort(aSorters);
      },

      /**
       * Validates all controls within the given form and returns whether the form is valid or not.
       * Iterates over all form elements and validates their values using the corresponding data type's validateValue method.
       * If a control is invalid, its value state is set to "Error" and the validation error message is set as its value state text.
       * Otherwise, the value state is set to "None" and the value state text is cleared.
       * @param {sap.ui.core.Control} oForm - The form containing the controls to be validated.
       * @returns {boolean} Whether the form is valid or not.
       */
      validateForm: function (oForm) {
        let bIsFormValid = true;
        const aFormElements = oForm.getContent();

        aFormElements.forEach(function (oControl) {
          // Validate controls with "value" binding (Input, DatePicker, etc.)
          if (oControl.getBinding && oControl.getBinding("value")) {
            try {
              const oBinding = oControl.getBinding("value");
              const oType = oBinding.getType();
              const sValue = oControl.getValue();
              oType.validateValue(sValue);
              oControl.setValueState("None");
              oControl.setValueStateText("");
            } catch (oException) {
              oControl.setValueState("Error");
              oControl.setValueStateText(oException.message);
              bIsFormValid = false;
            }
          }

          // Validate Select with "selectedKey" binding
          else if (oControl.getBinding && oControl.getBinding("selectedKey")) {
            try {
              const oBinding = oControl.getBinding("selectedKey");
              const oType = oBinding.getType();
              const sKey = oControl.getSelectedKey();

              oType.validateValue(sKey);
              oControl.setValueState("None");
              oControl.setValueStateText("");
            } catch (oException) {
              oControl.setValueState("Error");
              oControl.setValueStateText(oException.message);
              bIsFormValid = false;
            }
          }
        });

        return bIsFormValid;
      },
    });
  }
);
