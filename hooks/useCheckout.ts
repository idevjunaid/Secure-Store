import { useState } from "react";

export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false);

  const checkout = async (fileName: string) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error("Checkout Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { checkout, isLoading };
}