import { useState } from "react";

export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkout = async (fileName: string, fileKey: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName, fileKey }),
      });
      
      if (!res.ok) {
        throw new Error(`Checkout failed: ${res.statusText}`);
      }
      
      const data = (await res.json()) as { url?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error occurred";
      console.error("Checkout Error:", message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { checkout, isLoading, error };
}