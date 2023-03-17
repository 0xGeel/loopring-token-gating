import { UnlockableV2 } from "@/src/config/types";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../../Spinner";
import UnlockLink from "./UnlockLink";

type Props = {
  unlockable: UnlockableV2;
};

const UnlockSection = ({ unlockable }: Props) => {
  const { address } = useAccount();

  const [isLoading, setIsLoading] = useState(false);
  const [unlockedContent, setUnlockedContent] = useState<any>(null);

  const checkUnlock = (
    address: `0x${string}` | undefined,
    unlockable: UnlockableV2
  ) => {
    axios
      .get(
        `/api/checkUnlockable?address=${address}&unlockableId=${unlockable.id}`
      )
      .then((data) => {
        setUnlockedContent(data.data.unlock);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    checkUnlock(address, unlockable);
  }, [address, unlockable]);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center font-display text-sm space-x-2 border-t border-white/10 px-8 py-5 bg-gradient-to-b from-sky-500/10 to-transparent rounded-b">
          <Spinner />
          <p>Loading...</p>
        </div>
      ) : (
        <>
          {unlockedContent ? (
            // ~ UX delight: Confetti
            <UnlockLink accessLink={unlockedContent.accessLink} />
          ) : (
            <div className="flex justify-center items-center font-display text-sm space-x-2 border-t border-white/10 px-8 py-5 bg-gradient-to-b from-sky-500/10 to-transparent rounded-b">
              <p>(To do: write a cool unauthorized message)</p>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default UnlockSection;