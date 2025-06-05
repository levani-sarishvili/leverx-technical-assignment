sap.ui.define([], function () {
  "use strict";

  const sSearchFilterGroupName = "Search";

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

  const oOrderStatuses = {
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };

  const oStockStatuses = {
    IN_STOCK: "In Stock",
    OUT_OF_STOCK: "Out of Stock",
    LESS_THAN_10_LEFT: "Less Than 10 Left",
  };

  return {
    aSearchableFields,
    oProductTableColumns,
    sSearchFilterGroupName,
    oOrderStatuses,
    oStockStatuses,
  };
});
