import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'issues';

let blobServiceClient: BlobServiceClient | null = null;
let containerClient: ContainerClient | null = null;

export async function getContainerClient() {
  if (containerClient) return containerClient;

  if (!connectionString) {
    throw new Error('Azure Storage Connection String is missing');
  }

  blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  containerClient = blobServiceClient.getContainerClient(containerName);

  // Ensure container exists
  await containerClient.createIfNotExists({
    access: 'blob', // Allow public read access to blobs
  });

  return containerClient;
}

export async function uploadImage(buffer: Buffer, fileName: string, mimeType: string) {
  try {
    const client = await getContainerClient();
    const blockBlobClient = client.getBlockBlobClient(fileName);

    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: mimeType },
    });

    return blockBlobClient.url;
  } catch (error) {
    console.error('Blob upload failed:', error);
    throw error;
  }
}
