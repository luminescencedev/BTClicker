export default function formatNumber(num) {
    if (typeof num !== "number") return "0";
  
    if (num < 0.000001) return num.toExponential(2);
    if (num < 1) return num.toFixed(6);
    if (num < 1000) return num.toFixed(4);
    if (num < 1000000) return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  
    return num.toExponential(2);
  }
  