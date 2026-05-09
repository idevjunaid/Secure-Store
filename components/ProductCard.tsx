"use client";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useCheckout } from "@/hooks/useCheckout";

interface ProductCardProps {
  fileName: string;
  sizeMB: string;
  previewUrl: string;
  fileKey: string; // S3 file key
}

export default function ProductCard({ fileName, sizeMB, previewUrl, fileKey }: ProductCardProps) {
  const { checkout, isLoading } = useCheckout();

  const handleBuyClick = () => {
    checkout(fileName, fileKey);
  };

  return (
    <Card className="overflow-hidden border-2 flex flex-col">
      <div className="relative h-48 w-full bg-slate-100 flex items-center justify-center">
        {previewUrl ? (
          <>
            <Image 
              src={previewUrl} 
              alt={fileName} 
              fill 
              className="object-cover blur-sm hover:blur-none transition-all duration-300" 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              unoptimized={true}
            />
            <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
              PREVIEW
            </div>
          </>
        ) : (
          <div className="text-center p-4">
            <div className="text-4xl">📄</div>
            <p className="text-sm text-slate-600">Preview not available</p>
          </div>
        )}
      </div>
      <CardHeader className="flex-grow">
        <CardTitle className="truncate">{fileName}</CardTitle>
        <CardDescription>{sizeMB} MB</CardDescription>
      </CardHeader>
      <CardContent className="bg-slate-50 p-6">
        <Button className="w-full gap-2" onClick={handleBuyClick} disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
          Buy Access - $10.00
        </Button>
      </CardContent>
    </Card>
  );
}