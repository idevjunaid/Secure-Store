import { S3Client, ListObjectsV2Command, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-southeast-2',
  // In production (Lambda): Uses IAM role credentials automatically
  // Locally: If AWS_ACCESS_KEY_ID/SECRET_ACCESS_KEY are set, uses those
  ...(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  } : {})
});

// Wrapper to maintain backward compatibility with v2 SDK interface
const s3 = {
  listObjectsV2: (params: { Bucket: string }) => ({
    promise: async () => {
      try {
        const command = new ListObjectsV2Command({ Bucket: params.Bucket });
        const response = await s3Client.send(command);
        return { Contents: response.Contents || [] };
      } catch (error) {
        throw error;
      }
    },
  }),
  headObject: async (params: { Bucket?: string; Key?: string }) => {
    try {
      const cmd = new HeadObjectCommand({ Bucket: params.Bucket, Key: params.Key });
      await s3Client.send(cmd);
      return true;
    } catch (err: any) {
      // If the object doesn't exist, S3 throws NotFound
      return false;
    }
  },
  getSignedUrl: async (operation: string, params: { 
    Bucket?: string; 
    Key?: string; 
    Expires?: number;
    ResponseContentDisposition?: string;
  }) => {
    if (operation === 'getObject') {
      const command = new GetObjectCommand({
        Bucket: params.Bucket,
        Key: params.Key,
        ResponseContentDisposition: params.ResponseContentDisposition,
      });
      return await getSignedUrl(s3Client, command, { expiresIn: params.Expires || 3600 });
    }
    throw new Error(`Unsupported operation: ${operation}`);
  },
};

export default s3;