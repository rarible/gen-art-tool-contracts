const AddAddrToURITest = artifacts.require("AddAddrToURITest.sol");

contract("AddAddrToURI", accounts => {
  let addAddrToURITest;

  beforeEach(async () => {
    addAddrToURITest = await AddAddrToURITest.new();
  });

  it("should correctly convert address to string", async () => {
    const addrToConvert = accounts[5]

    const result = "0x" + (await addAddrToURITest.toAsciiStringTest(addrToConvert))

    assert.equal(web3.utils.toChecksumAddress(result), web3.utils.toChecksumAddress(addrToConvert), "toAsciiStringTest")
  })

  it("should correctly concatenate address to uri", async () => {
    const addrToConvert = accounts[5]
    const uri = "https://ipfs.rarible.com/";

    const result = await addAddrToURITest.addTokenAddrToBaseURITest(uri, addrToConvert)

    assert.equal(result, uri + addrToConvert.toLowerCase() + "/", "addTokenAddrToBaseURITest")
  })

})