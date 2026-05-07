import Stripe from "stripe";
import s3 from "@/lib/s3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download } from "lucide-react";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function SuccessPage({ searchParams }: any) {
  const { session_id } = await searchParams;
  const session = await stripe.checkout.sessions.retrieve(session_id);
  const fileName = session.metadata?.fileName;

  if (session.payment_status !== "paid" || !fileName) return <div>Unauthorized</div>;

  const downloadUrl = s3.getSignedUrl("getObject", {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Expires: 300,
    ResponseContentDisposition: `attachment; filename="${fileName}"`
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-96 text-center">
        <CardHeader>
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
          <CardTitle>Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-500">Your link expires in 5 minutes.</p>
          <Button asChild className="w-full">
            <a href={downloadUrl}><Download className="mr-2 h-4 w-4" /> Download Now</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}