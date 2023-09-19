export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("us-EN", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
  }).format(price);
};
