import getNftHolders from "./getNftHolders";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("querying the Loopring API to get NFT Holders for a NFT with nftDatas", () => {
  it.todo("returns a single NFT holder for a NFT with correct nftDatas");

  it.todo("returns multiple NFT holders for a NFT with correct nftDatas");

  it("returns false for invalid nftData", async () => {
    mockedAxios.get.mockRejectedValue(false);
    const data = await getNftHolders("0xbruh");
    expect(data).toEqual(false);
  });
});