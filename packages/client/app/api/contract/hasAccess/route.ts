import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { base } from "wagmi/chains";
import ContentManagerABI from "../../../../lib/ContentManagerABI";
import { CONTENT_MANAGER_ADDRESS } from "../../../../utils/constants";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get("address");
  const contentId = searchParams.get("contentId");

  if (!address || !contentId) {
    return NextResponse.json(
      { error: "Missing address or contentId parameter" },
      { status: 400 },
    );
  }

  try {
    const contractAddress = CONTENT_MANAGER_ADDRESS as `0x${string}`;
    if (!contractAddress) {
      throw new Error("Content manager address is not defined");
    }

    const publicClient = createPublicClient({
      chain: base,
      transport: http(),
    });

    const hasAccess = await publicClient.readContract({
      address: contractAddress,
      abi: ContentManagerABI,
      functionName: "hasAccessToContent",
      args: [address as `0x${string}`, BigInt(contentId)],
    });

    return NextResponse.json({ hasAccess });
  } catch (error) {
    console.error("Error checking content access:", error);
    return NextResponse.json(
      { error: "Failed to check content access" },
      { status: 500 },
    );
  }
}
