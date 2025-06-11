sap.ui.define([], function () {
  "use strict";

  const aProductTableSearchableFields = [
    { label: "Name", type: "String" },
    { label: "Price", type: "Number" },
    { label: "Category", type: "String" },
    { label: "Brand", type: "String" },
    { label: "SupplierName", type: "String" },
    { label: "StockStatus", type: "String" },
    { label: "Rating", type: "Number" },
  ];

  const oProductTableColumns = {
    NAME_FIELD: "Name",
    PRICE_FIELD: "Price",
    CATEGORY_FIELD: "Category",
    BRAND_FIELD: "Brand",
    SUPPLIER_FIELD: "SupplierName",
    RELEASE_DATE_FIELD: "ReleaseDate",
    STOCK_STATUS_FIELD: "StockStatus",
    RATING_FIELD: "Rating",
  };

  const oOrderTableSearchableFields = [
    { label: "ProductId", type: "String" },
    { label: "OrderId", type: "String" },
    { label: "Customer", type: "String" },
    { label: "Quantity", type: "Number" },
    { label: "Status", type: "String" },
    { label: "ShippingCost", type: "Number" },
    { label: "TotalPrice", type: "Number" },
  ];

  const oOrderStatuses = {
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };

  const oSortOptions = {
    ASCENDING: "Ascending",
    DESCENDING: "Descending",
  };

  const oUniqueIdNames = {
    Id: "Id",
    OrderId: "OrderId",
  };

  const oStockStatuses = {
    IN_STOCK: "In Stock",
    OUT_OF_STOCK: "Out of Stock",
    LESS_THAN_10_LEFT: "Less Than 10 Left",
  };

  const oDataTypes = {
    STRING: "String",
    NUMBER: "Number",
    BOOLEAN: "Boolean",
  };

  const oHeaderModes = {
    SNAPPED: "snapped",
    EXPANDED: "expanded",
  };

  return {
    aProductTableSearchableFields,
    oProductTableColumns,
    oOrderStatuses,
    oStockStatuses,
    oOrderTableSearchableFields,
    oSortOptions,
    oUniqueIdNames,
    oDataTypes,
    oHeaderModes,
  };
});
