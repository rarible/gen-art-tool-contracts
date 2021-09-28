const events = require("../library/events");
const truffleAssert = require('truffle-assertions');

const RoyaltiesV2GenImplTest = artifacts.require("RoyaltiesV2GenImplTest.sol");

contract("RoyaltiesV2Gen", accounts => {
  let royaltiesV2GenImplTest;

  beforeEach(async () => {
    royaltiesV2GenImplTest = await RoyaltiesV2GenImplTest.new();
  });

  it("should return correct royalties", async () => {
    const royalties = [[accounts[3], 1000]]

    const initTx = await royaltiesV2GenImplTest.__RoyaltiesV2GenImplTest_init(royalties);

    const [RoyaltiesSet] = events(initTx, "RoyaltiesSet");
    assert.equal(RoyaltiesSet.args.tokenId, 0, "init royalties token id")
    assert.equal(RoyaltiesSet.args.royalties[0].account, royalties[0][0], "init royalties account")
    assert.equal(RoyaltiesSet.args.royalties[0].value, royalties[0][1], "init royalties value")

    for (let i = 0; i < 5; i++) {
      const royalty = await royaltiesV2GenImplTest.getRaribleV2Royalties(i)
      assert.equal(royalty[0].account, royalties[0][0], "get royalties account")
      assert.equal(royalty[0].value, royalties[0][1], "get royalties value")
    }
  })

  it("should revert if royalties are not correct", async () => {
    const zero = "0x0000000000000000000000000000000000000000"

    const royaltiesZeroAcc = [[zero, 1000]]
    await truffleAssert.fails(
      royaltiesV2GenImplTest.__RoyaltiesV2GenImplTest_init(royaltiesZeroAcc),
      truffleAssert.ErrorType.REVERT,
      "Recipient should be present"
    )

    const royaltiesZeroVal = [[accounts[3], 0]]
    await truffleAssert.fails(
      royaltiesV2GenImplTest.__RoyaltiesV2GenImplTest_init(royaltiesZeroVal),
      truffleAssert.ErrorType.REVERT,
      "Royalty value should be positive"
    )
  })

  it("should support _INTERFACE_ID_ROYALTIES", async () => {
    await royaltiesV2GenImplTest.__RoyaltiesV2GenImplTest_init([]);

    const _INTERFACE_ID_ROYALTIES = "0xcad96cca"
    const intSup = await royaltiesV2GenImplTest.supportsInterface(_INTERFACE_ID_ROYALTIES)
    assert.equal(intSup, true, "interface")
  })


})