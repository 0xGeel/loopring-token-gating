import type { NextApiRequest, NextApiResponse } from "next";
import {
  getMinterAndToken,
  getNftData,
  getNftHolders,
} from "@/src/utils/loopring";

const errorMessage = "Unable to find data for the NFT ID you supplied.";

// Request holders for a NFT held on Loopring
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query;
  const { nftId } = query;

  if (!nftId || Array.isArray(nftId)) {
    // Check if multiple or no Account IDs are specified. If so: early return.
    return res.status(400).json({ error: "Incorrect NFT ID supplied." });
  }

  // Call TheGraph API to find NFT Datas for a NFT ID
  const theGraphRes = await getMinterAndToken(nftId);

  if (!theGraphRes) {
    return res.status(400).json({ error: errorMessage });
  }

  const nftDataRes = await getNftData(
    theGraphRes.minter,
    theGraphRes.tokenAddress,
    nftId
  );

  if (!nftDataRes) {
    return res.status(400).json({ error: errorMessage });
  }

  const holders = await getNftHolders(nftDataRes.nftData);

  return holders
    ? res.status(200).json(holders)
    : res.status(400).json({
        error: "Unable to find holders for the NFT ID.",
        log: holders,
      });
};

export default handler;
