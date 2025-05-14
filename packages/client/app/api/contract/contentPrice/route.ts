import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { base } from "wagmi/chains";
import ContentManagerABI from "../../../../lib/ContentManagerABI";
import { CONTENT_MANAGER_ADDRESS } from "../../../../utils/constants";

export async function GET() {
  try {
    const contractAddress = CONTENT_MANAGER_ADDRESS as `0x${string}`;
    if (!contractAddress) {
      throw new Error("Content manager address is not defined");
    }

    const publicClient = createPublicClient({
      chain: base,
      transport: http(),
    });

    const contentPrice = await publicClient.readContract({
      address: contractAddress,
      abi: ContentManagerABI,
      functionName: "CONTENT_PRICE",
    });

    return NextResponse.json({ price: contentPrice.toString() });
  } catch (error) {
    console.error("Error fetching content price:", error);
    return NextResponse.json(
      { error: "Failed to fetch content price" },
      { status: 500 },
    );
  }
}
