"use client";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useCheckout } from "@/hooks/useCheckout";

export default function ProductCard({ fileName, sizeMB, viewUrl }: any) {
  const { checkout, isLoading } = useCheckout();

  return (
    <Card className="overflow-hidden border-2 flex flex-col">
      <div className="relative h-48 w-full bg-slate-100">
        {viewUrl && <Image src={viewUrl} alt={fileName} fill className="object-cover" />}
      </div>
      <CardHeader className="flex-grow">
        <CardTitle className="truncate">{fileName}</CardTitle>
        <CardDescription>{sizeMB} MB</CardDescription>
      </CardHeader>
      <CardContent className="bg-slate-50 p-6">
        <Button className="w-full gap-2" onClick={() => checkout(fileName)} disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
          Buy Access - $10.00
        </Button>
      </CardContent>
    </Card>
  );
}