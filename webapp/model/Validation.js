sap.ui.define([], function () {
  return {
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
  };
});
