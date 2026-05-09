// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    if (!process.env.AWS_REGION && input?.stage === "production") {
      throw new Error("AWS_REGION environment variable is required for production deployments");
    }
    return {
      name: "secure-store",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          region: process.env.AWS_REGION || "ap-southeast-2",
        },
      },
    };
  },
  async run() {
    const bucket = new sst.aws.Bucket("DigitalVault");

    const site = new sst.aws.Nextjs("MyWeb", {
      link: [bucket],
      environment: {
        AWS_REGION: process.env.AWS_REGION || "ap-southeast-2",
        AWS_S3_BUCKET_NAME: bucket.name,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
        STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
      },
    });

    return {
      url: site.url,
    };
  },
});