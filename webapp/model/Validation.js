sap.ui.define([], function () {
  return {
    /**
     * Validates the product form by checking that all required fields are filled.
     *
     * @param {Object} oProductForm - The product form data to validate.
     * @param {sap.ui.model.json.JSONModel} oValidationModel - The JSON model used to store validation results (true/false for each field).
     * @returns {boolean} `true` if all mandatory fields are valid, otherwise `false`.
     */
    validateProductForm: function (oProductForm, oValidationModel) {
      // Check mandatory fields
      oValidationModel.setProperty("/Name", !!oProductForm.Name);
      oValidationModel.setProperty("/Price", !!oProductForm.Price);
      oValidationModel.setProperty("/Category", !!oProductForm.Category);
      oValidationModel.setProperty("/Brand", !!oProductForm.Brand);
      oValidationModel.setProperty(
        "/SupplierName",
        !!oProductForm.SupplierName
      );
      oValidationModel.setProperty("/ReleaseDate", !!oProductForm.ReleaseDate);
      oValidationModel.setProperty("/Rating", !!oProductForm.Rating);

      // Return validation result
      return !Object.values(oValidationModel.getData()).includes(false);
    },
  };
});
