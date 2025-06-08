sap.ui.define([], function () {
  "use strict";

  const aProductTableSearchableFields = [
    { title: "Name", type: "String" },
    { title: "Price", type: "Number" },
    { title: "Category", type: "String" },
    { title: "Brand", type: "String" },
    { title: "SupplierName", type: "String" },
    { title: "StockStatus", type: "String" },
    { title: "Rating", type: "Number" },
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
    { title: "ProductId", type: "String" },
    { title: "OrderId", type: "String" },
    { title: "Customer", type: "String" },
    { title: "Quantity", type: "Number" },
    { title: "Status", type: "String" },
    { title: "ShippingCost", type: "Number" },
    { title: "TotalPrice", type: "Number" },
  ];

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
    aProductTableSearchableFields,
    oProductTableColumns,
    oOrderStatuses,
    oStockStatuses,
    oOrderTableSearchableFields,
  };
});
