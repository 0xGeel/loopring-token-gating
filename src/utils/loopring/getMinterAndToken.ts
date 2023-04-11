import axios from "axios";
import { THE_GRAPH } from "./_constants";

const getMinterAndToken = async (nftId: string) => {
  // Queries Loopring TheGraph to find Minter and Token Address from NFT ID
  // Example input: `0x271d3a38c3572ab21225fbb7f97468051ca9c631f002bf2dde82aee9b8511ac0`
  // Example output: `minter: "0x94743548ba8d82a4ee8ea3dfad589ea501ad2738", tokenAddress: "0xc76eca2937b006606ebe717621409e4c2df906f1"`

  const query = `{
          nonFungibleTokens( 
            where: {nftID: "${nftId}"} 
          ) {
            minter {
              address
            },
            token
          }
        }`;

  try {
    const response = await axios.post(THE_GRAPH.GATEWAY_URL, { query });

    if (response.data.data.nonFungibleTokens.length == 0) {
      return false;
    }

    return {
      minter: response.data.data.nonFungibleTokens[0].minter.address,
      tokenAddress: response.data.data.nonFungibleTokens[0].token,
    };
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default getMinterAndToken;