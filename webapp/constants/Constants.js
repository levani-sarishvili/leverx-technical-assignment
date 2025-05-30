sap.ui.define([], function () {
  "use strict";

  const aSearchableFields = [
    "Name",
    "Price",
    "Category",
    "Brand",
    "SupplierName",
    "Rating",
  ];

  const oProductTableColumns = {
    NAME_FIELD: "Name",
    PRICE_FIELD: "Price",
    CATEGORY_FIELD: "Category",
    BRAND_FIELD: "Brand",
    SUPPLIER_FIELD: "SupplierName",
    RELEASE_DATE_FIELD: "ReleaseDate",
    RATING_FIELD: "Rating",
  };

  const oFilterOperators = {
    EQUAL: "EQ",
    CONTAINS: "Contains",
  };

  return { aSearchableFields, oProductTableColumns, oFilterOperators };
});
