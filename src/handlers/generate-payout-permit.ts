import { PermitReward } from "../types";
import { Context } from "../types/context";
import { generateErc20PermitSignature } from "./generate-erc20-permit";
import { generateErc721PermitSignature } from "./generate-erc721-permit";
import { PermitRequest } from "../types/plugin-input";

/**
 * Generates a payout permit based on the provided context.
 * @param context - The context object containing the configuration and payload.
 * @param permitRequests
 * @returns A Promise that resolves to the generated permit transaction data or an error message.
 */
export async function generatePayoutPermit(context: Context, permitRequests: PermitRequest[]): Promise<PermitReward[]> {
  const permits: PermitReward[] = [];

  for (const permitRequest of permitRequests) {
    const { type: permitType, amount, username, contributionType, tokenAddress } = permitRequest;

    let permit: PermitReward;
    switch (permitType) {
      case "ERC20":
        permit = await generateErc20PermitSignature(context, username, amount, tokenAddress);
        break;
      case "ERC721":
        permit = await generateErc721PermitSignature(context, username, contributionType);
        break;
      default:
        context.logger.error(`Invalid permit type: ${permitType}`);
        continue;
    }

    permits.push(permit);
  }

  return permits;
}
