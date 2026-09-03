// Pays supportés par SendavaPay SDK v3 (10 pays).
// Doc : https://sendavapay.com/sdk-docs
export const SENDAVAPAY_COUNTRIES = [
  { code: "TG", name: "Togo", dial: "+228", currency: "XOF", flag: "🇹🇬" },
  { code: "BJ", name: "Bénin", dial: "+229", currency: "XOF", flag: "🇧🇯" },
  { code: "SN", name: "Sénégal", dial: "+221", currency: "XOF", flag: "🇸🇳" },
  { code: "CI", name: "Côte d'Ivoire", dial: "+225", currency: "XOF", flag: "🇨🇮" },
  { code: "ML", name: "Mali", dial: "+223", currency: "XOF", flag: "🇲🇱" },
  { code: "BF", name: "Burkina Faso", dial: "+226", currency: "XOF", flag: "🇧🇫" },
  { code: "CM", name: "Cameroun", dial: "+237", currency: "XAF", flag: "🇨🇲" },
  { code: "GN", name: "Guinée", dial: "+224", currency: "GNF", flag: "🇬🇳" },
  { code: "COD", name: "RD Congo", dial: "+243", currency: "CDF", flag: "🇨🇩" },
  { code: "COG", name: "Congo Brazzaville", dial: "+242", currency: "XAF", flag: "🇨🇬" },
];

// Base URL publique de l'API SDK v3 (endpoints CORS accessibles côté frontend).
export const SENDAVAPAY_BASE_URL = "https://sendavapay.com/api/sdk/v1";

