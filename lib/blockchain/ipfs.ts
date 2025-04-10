/**
 * IPFS utility functions for interacting with Pinata IPFS service
 */

// Upload content to IPFS via Pinata
export async function uploadToIPFS(content: any): Promise<string> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const secretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

    if (!apiKey || !secretKey) {
      throw new Error("Pinata API keys not configured");
    }

    // Prepare the data to be uploaded
    let data;
    if (typeof content === "string") {
      // If content is a string, assume it's JSON
      data = JSON.stringify(JSON.parse(content));
    } else if (content instanceof Blob || content instanceof File) {
      // If content is a file or blob
      data = content;
    } else {
      // Otherwise, stringify the object
      data = JSON.stringify(content);
    }

    // Create form data for the request
    const formData = new FormData();

    if (data instanceof Blob || data instanceof File) {
      formData.append("file", data);
    } else {
      // Create a file from the JSON string
      const file = new File([data], "metadata.json", {
        type: "application/json",
      });
      formData.append("file", file);
    }

    // Add pinata metadata
    const metadata = JSON.stringify({
      name: `PrepWise-${Date.now()}`,
      keyvalues: {
        app: "PrepWise",
        timestamp: Date.now().toString(),
      },
    });
    formData.append("pinataMetadata", metadata);

    // Add pinata options
    const options = JSON.stringify({
      cidVersion: 1,
    });
    formData.append("pinataOptions", options);

    // Make the request to Pinata
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          pinata_api_key: apiKey,
          pinata_secret_api_key: secretKey,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to upload to IPFS: ${error.message}`);
    }

    const result = await response.json();
    return result.IpfsHash;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw error;
  }
}

// Get content from IPFS
export async function getFromIPFS(ipfsHash: string): Promise<string> {
  try {
    const gateway =
      process.env.NEXT_PUBLIC_PINATA_GATEWAY ||
      "https://gateway.pinata.cloud/ipfs";
    const url = `${gateway}/${ipfsHash}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
    }

    const content = await response.text();
    return content;
  } catch (error) {
    console.error("Error getting from IPFS:", error);
    throw error;
  }
}

// Format IPFS URL for display
export function formatIPFSUrl(ipfsHash: string): string {
  const gateway =
    process.env.NEXT_PUBLIC_PINATA_GATEWAY ||
    "https://gateway.pinata.cloud/ipfs";
  return `${gateway}/${ipfsHash}`;
}

// Check if an IPFS hash is valid
export function isValidIPFSHash(hash: string): boolean {
  // Basic validation - IPFS CIDv0 is a 46 character base58 string
  // CIDv1 can vary in length but is typically longer
  return /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[A-Za-z2-7]{58})/.test(hash);
}

// Convert IPFS URI to HTTP URL
export function ipfsUriToHttpUrl(uri: string): string {
  if (!uri) return "";

  if (uri.startsWith("ipfs://")) {
    const hash = uri.replace("ipfs://", "");
    return formatIPFSUrl(hash);
  }

  return uri;
}

/**
 * Initialize IPFS service
 * This is a placeholder function that would normally set up any necessary IPFS configuration
 */
export async function initializeIPFS(): Promise<void> {
  try {
    // Check if Pinata API keys are configured
    const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const secretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

    if (!apiKey || !secretKey) {
      console.warn(
        "Pinata API keys not configured. Using mock IPFS implementation."
      );
    } else {
      console.log("IPFS service initialized with Pinata");
    }
  } catch (error) {
    console.error("Error initializing IPFS service:", error);
    // Don't throw error to allow the application to continue
  }
}
