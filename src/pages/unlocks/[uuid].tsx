import { useRouter } from "next/router";
import { findUnlockableByUuid } from "@/src/utils/generic";
import Layout from "@/src/components/UnlockablePage/Layout";
import FourOhFour from "@/src/components/UnlockablePage/404";
import UnlockCard from "@/src/components/UnlockablePage/UnlockCard";

const Page = () => {
  const router = useRouter();
  const { uuid } = router.query;

  // 1️⃣: Check if UUID exists in config.ts (if not: —> 404)
  // 1️⃣B: Replace config.ts with Supabase
  // 2️⃣: Show unlock title and description
  // 3️⃣: NFT ID => NFT Datas
  // 4️⃣: [@TODO] Query NFT holders by looprings nftData
  // 5️⃣: 0x address => Account ID
  // 6️⃣: Check if user owns the NFT
  // 7️⃣: If so: generate Pinata Unlock Link & display

  if (!uuid || Array.isArray(uuid)) {
    return;
  }

  const unlockable = findUnlockableByUuid(uuid);

  if (!unlockable) {
    return <FourOhFour />;
  }

  return (
    <Layout containerClass="flex-grow flex items-center justify-center">
      <UnlockCard unlockable={unlockable} />
    </Layout>
  );
};

export default Page;
