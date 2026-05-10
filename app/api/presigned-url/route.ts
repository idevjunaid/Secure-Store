import s3 from "@/lib/s3";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  const bucket = process.env.AWS_S3_BUCKET_NAME;

  if (!key || !bucket) {
    return NextResponse.json(
      { error: "Missing key or bucket" },
      { status: 400 }
    );
  }

  try {
    // Generate signed URL from Lambda with Lambda's IAM role permissions
    // On production (Lambda): Uses IAM execution role (has full S3 access)
    // Locally: Uses AWS_ACCESS_KEY_ID/SECRET_ACCESS_KEY if set
    const previewUrl = await s3.getSignedUrl("getObject", {
      Bucket: bucket,
      Key: key,
      Expires: 3600, // 1 hour
    });

    return NextResponse.json({ url: previewUrl });
  } catch (error) {
    console.error(`Error generating signed URL for ${key}:`, error);
    return NextResponse.json(
      { error: "Failed to generate signed URL", details: String(error) },
      { status: 500 }
    );
  }
}
