import s3 from "@/lib/s3";
import ProductCard from "@/components/ProductCard";

export default async function Home() {
  const bucketName = process.env.AWS_S3_BUCKET_NAME!;
  let files: any[] = [];
  
  try {
    const data = await s3.listObjectsV2({ Bucket: bucketName }).promise();
    files = data.Contents || [];
  } catch (err) { console.error(err); }

  return (
    <main className="p-10 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Digital Vault</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {files.map((file) => (
          <ProductCard 
            key={file.Key} 
            fileName={file.Key} 
            sizeMB={(file.Size / 1024 / 1024).toFixed(2)} 
            viewUrl={s3.getSignedUrl('getObject', { Bucket: bucketName, Key: file.Key, Expires: 3600 })}
          />
        ))}
      </div>
    </main>
  );
}