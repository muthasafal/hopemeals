export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Rate relative to INR
}

const REACT_APP_EXCHANGE_API_KEY = "8ca9348a13d7104acd32ba7d";

// Helper function to fetch live exchange rates (relative to INR)
export const fetchLiveRates = async (): Promise<Record<string, number>> => {
  try {
    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${REACT_APP_EXCHANGE_API_KEY}/latest/INR`
    );
    const data = await res.json();

    if (data.result === "success") {
      return data.conversion_rates;
    } else {
      console.error("Error fetching rates:", data);
      return {};
    }
  } catch (err) {
    console.error("Network error fetching rates:", err);
    return {};
  }
};

// Default currencies array (rates will be updated after fetching)
export let currencies: Currency[] = [
  { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 1 },
  { code: "USD", symbol: "$", name: "US Dollar", rate: 0.012 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.0095 },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", rate: 0.044 },
];

// Function to refresh currency rates dynamically
export const updateCurrencyRates = async () => {
  const liveRates = await fetchLiveRates();

  if (Object.keys(liveRates).length > 0) {
    currencies = currencies.map((c) => ({
      ...c,
      rate: liveRates[c.code] ?? c.rate, // Use API rate if available, else fallback
    }));
    console.log("Currency rates updated:", currencies);
  }
};

// Run once at startup
updateCurrencyRates();

// Refresh every 5 hours (5 * 60 * 60 * 1000 ms)
setInterval(updateCurrencyRates, 5 * 60 * 60 * 1000);

export const convertFromINR = (amountInINR: number, targetCurrency: string): number => {
  const currency = currencies.find((c) => c.code === targetCurrency);
  if (!currency) return amountInINR;

  const converted = amountInINR * currency.rate;

  if (targetCurrency === "INR") return Math.round(converted);
  if (targetCurrency === "USD" || targetCurrency === "GBP")
    return Math.round(converted * 100) / 100;
  if (targetCurrency === "AED") return Math.round(converted * 10) / 10;

  return converted;
};

export const convertToINR = (amount: number, fromCurrency: string): number => {
  const currency = currencies.find((c) => c.code === fromCurrency);
  if (!currency) return amount;

  return Math.round(amount / currency.rate);
};

export const formatCurrency = (amount: number, currencyCode: string): string => {
  const currency = currencies.find((c) => c.code === currencyCode);
  if (!currency) return amount.toString();

  const formatted = Math.round(convertFromINR(amount, currencyCode));

  if (currencyCode === "INR") {
    return `${currency.symbol}${formatted.toLocaleString("en-IN")}`;
  }

  return `${currency.symbol}${formatted.toLocaleString("en-US", {
    minimumFractionDigits: currencyCode === "AED" ? 1 : 2,
    maximumFractionDigits: currencyCode === "AED" ? 1 : 2,
  })}`;
};
