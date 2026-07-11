export const formatSKU = (sku) => {
  if (!sku) return sku;
  // Convert FX-161 to #FX161
  return '#' + sku.replace(/-/g, '');
};
