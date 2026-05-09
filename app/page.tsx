import s3 from "@/lib/s3";
import ProductCard from "@/components/ProductCard";

interface S3Object {
  Key?: string;
  Size?: number;
}

export default async function Home() {
  const bucketName = process.env.AWS_S3_BUCKET_NAME!;
  let files: S3Object[] = [];
  
  try {
    const data = await s3.listObjectsV2({ Bucket: bucketName }).promise();
    files = (data.Contents || []).filter((obj: S3Object) => obj.Key !== undefined) as S3Object[];
  } catch (err) { 
    console.error('Error fetching from S3:', err);
  }

  // Generate signed URLs for all files
  const filesWithPreview = await Promise.all(
    files.map(async (file) => {
      let previewUrl = '';
      const fileKey = file.Key!;
      
      try {
        // Generate signed URL for preview (1 hour expiration)
        previewUrl = await s3.getSignedUrl('getObject', { 
          Bucket: bucketName, 
          Key: fileKey, 
          Expires: 3600 // 1 hour for preview
        });
      } catch (err) {
        console.error(`Error generating preview URL for ${fileKey}:`, err);
        previewUrl = '';
      }
      
      return {
        fileName: fileKey,
        fileKey,
        previewUrl,
        Size: file.Size,
      };
    })
  );

  return (
    <main className="p-10 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Digital Vault</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filesWithPreview.map((file) => {
          if (!file.fileName || file.Size === undefined) return null;
          return (
            <ProductCard 
              key={file.fileKey} 
              fileName={file.fileName} 
              sizeMB={(file.Size / 1024 / 1024).toFixed(2)}
              previewUrl={file.previewUrl}
              fileKey={file.fileKey}
            />
          );
        })}
      </div>
    </main>
  );
}