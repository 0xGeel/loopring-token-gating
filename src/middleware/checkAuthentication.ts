import { GetServerSidePropsContext } from "next";
import { NextApiRequest, NextApiResponse } from "next";

import { siwe } from "@/src/middleware/siwe";
import Supabase from "@/src/services/supabase";
import logger from "@/src/utils/logger";

interface AuthSuccess {
  authenticated: true;
  address: string;
}

type AuthError = undefined;

type AuthResponse = Promise<AuthSuccess | AuthError>;

export function checkAuthentication(
  req: NextApiRequest,
  res: NextApiResponse
): AuthResponse;

export function checkAuthentication(
  context: GetServerSidePropsContext
): AuthResponse;

export async function checkAuthentication(
  arg1: NextApiRequest | GetServerSidePropsContext,
  arg2?: NextApiResponse
): AuthResponse {
  // Overload the function
  const getSiweSesh = async () => {
    if (arg2) {
      const req = arg1 as NextApiRequest;
      const res = arg2 as NextApiResponse;
      return await siwe.getSession(req, res);
    } else {
      const context = arg1 as GetServerSidePropsContext;
      return await siwe.getSession(context.req, context.res);
    }
  };

  const siweSesh = await getSiweSesh();

  try {
    const { data } = await Supabase.from("calcium_crew_holders")
      .select("*")
      .eq("eth_address", siweSesh.address?.toLowerCase())
      .single();

    if (
      !data?.amount ||
      data.amount < parseInt(process.env.LOOPGATE_CC_THRESHOLD, 10)
    ) {
      return;
    }
  } catch (err) {
    logger.error(err);
    return;
  }

  return {
    authenticated: true,
    address: siweSesh.address as string,
  };
}