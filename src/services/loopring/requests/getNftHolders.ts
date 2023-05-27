import { LOOP_API_URL } from "../helpers/_constants";
import axios from "axios";
import { headerOpts, rateLimitedAxios } from "../index";
import logger from "@/src/utils/logger";

export const getNftHolders = async (nftData: string) => {
  const LIMIT = 500; // API can handle up to 500 per call

  try {
    const firstReq = await axios.get(
      `${LOOP_API_URL}/nft/info/nftHolders?nftData=${nftData}&limit=${LIMIT}`,
      headerOpts
    );

    // Keep track of the total amount of holders
    const amountOfHolders = firstReq.data.totalNum;

    // Determine if we need to do follow-up API calls
    if (amountOfHolders <= LIMIT) {
      // No need to. Parse the nft IDs from the response and early return
      return firstReq.data.nftHolders;
    }

    // Determine the amount of calls to be done, generate an array for follow-up requests
    // Create and return an array of the amount of calls. I.e. => [1, 2, ..., n]
    const amountOfCalls = Array.from(
      Array(Math.ceil(amountOfHolders / LIMIT) - 1),
      (_, index) => index + 1
    );

    // Call the API for all of these ^
    const followUpReqs = await Promise.all(
      amountOfCalls.map(async index => {
        return await rateLimitedAxios.get(
          `${LOOP_API_URL}/nft/info/nftHolders?nftData=${nftData}&limit=${LIMIT}&offset=${
            LIMIT * index
          }`,
          headerOpts
        );
      })
    );

    // Parse the API response, merge with the first API Call and flatten the array
    const nftApiResFlattened = followUpReqs
      .map(item => item.data)
      .concat(firstReq.data.nftHolders)
      .flat();

    return nftApiResFlattened;
  } catch (error) {
    logger.error(error);
    return false;
  }
};
