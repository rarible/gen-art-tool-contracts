const truffleAssert = require('truffle-assertions');
const events = require("../library/events");
const fakeBlock = require("../library/fake-block");

const ERC721Gen = artifacts.require("ERC721Gen.sol");
const ERC721GenTest = artifacts.require("ERC721GenTest.sol");

contract("ERC721Gen", accounts => {
  let testing;
  const baseURI = "https://ipfs.rarible.com/";

  beforeEach(async () => {
    const trait1 = ["Test1", ["v1", "v2", "v3"], [1, 2, 9997]]
    const trait2 = ["Test2", ["v1", "v2", "v3"], [3333, 3333, 3334]]
    const trait3 = ["Test3", ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"], [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000]]

    testing = await ERC721Gen.new();

    let transferProxy = accounts[8];
    let operatorProxy = accounts[0];

    await testing.__ERC721Gen_init("T", "T", baseURI, transferProxy, operatorProxy, [[accounts[3], 100]], [trait1, trait2, trait3], 100, 10);
  });

  it("should set base uri with toke addr", async () => {
    const curBaseURI = await testing.baseURI();
    assert.equal(curBaseURI, baseURI + testing.address.toLowerCase() + "/", "token base URI")
  })

  it("should return correct tokenURI", async () => {
    const tokenURI0 = await testing.tokenURI(0);
    const tokenURI1 = await testing.tokenURI(1);

    const shouldBeURI = baseURI + testing.address.toLowerCase() + "/" + "{id}"

    assert.equal(tokenURI0, shouldBeURI, "token URI")
    assert.equal(tokenURI1, shouldBeURI, "token URI")
  })

  it("fails if artist is incorrect", async () => {
    await truffleAssert.fails(
      testing.mint(testing.address, accounts[1], 1),
      truffleAssert.ErrorType.REVERT,
      "artist is not an owner"
    )
  })

  it("mints a token if everything's correct", async () => {
    const tx = await testing.mint(accounts[0], accounts[1], 1);
    console.log(tx.receipt.gasUsed)
    const GenArtMintEvent = await testing.getPastEvents("GenArtMint", {
      fromBlock: tx.receipt.blockNumber,
      toBlock: tx.receipt.blockNumber
    });
    const ev = GenArtMintEvent[0];
    const tokenId = ev.args.tokenId;
    assert(tokenId, "tokenId");

    const Transfer = await testing.getPastEvents("Transfer", {
      fromBlock: tx.receipt.blockNumber,
      toBlock: tx.receipt.blockNumber
    });

    const transfer1 = Transfer[0].args;
    assert.equal(transfer1.from, "0x0000000000000000000000000000000000000000", "from zero")
    assert.equal(transfer1.to, accounts[0], "to artsit")
    assert.equal(transfer1.tokenId.toString(), tokenId.toString(), "tokenId transfer 1")

    const transfer2 = Transfer[1].args;
    assert.equal(transfer2.from, accounts[0], "from artist")
    assert.equal(transfer2.to, accounts[1], "to buyer")
    assert.equal(transfer2.tokenId.toString(), tokenId.toString(), "tokenId transfer 1")
  })

  it("fails if more than total requested", async () => {
    for (let i = 0; i < 10; i++) {
      const tx = await testing.mint(accounts[0], accounts[1], 10);
      console.log(tx.receipt.gasUsed)
    }

    await truffleAssert.fails(
      testing.mint(accounts[0], accounts[1], 1),
      truffleAssert.ErrorType.REVERT,
      "all minted"
    )
  })

  it("default approver should work", async () => {
    const tx = await testing.mint(accounts[0], accounts[1], 1);

    const GenArtMintEvent = await testing.getPastEvents("GenArtMint", {
      fromBlock: tx.receipt.blockNumber,
      toBlock: tx.receipt.blockNumber
    });

    const ev = GenArtMintEvent[0];
    const tokenId = ev.args.tokenId;

    assert.equal(await testing.ownerOf(tokenId), accounts[1], "owner of")

    await testing.transferFrom(accounts[1], accounts[8], tokenId, { from: accounts[8] })

    assert.equal(await testing.ownerOf(tokenId), accounts[8], "owner of")

    await truffleAssert.fails(
      testing.transferFrom(accounts[8], accounts[0], tokenId, { from: accounts[0] }),
      truffleAssert.ErrorType.REVERT,
      "ERC721: transfer caller is not owner nor approved"
    )
  })

  it("minted value should increment", async () => {
    const trait1 = ["Test1", ["v1", "v2", "v3"], [1, 2, 9997]]
    const trait2 = ["Test2", ["v1", "v2", "v3"], [3333, 3333, 3334]]
    const trait3 = ["Test3", ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"], [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000]]

    const erc721test = await ERC721GenTest.new();

    let transferProxy = accounts[8];
    let operatorProxy = accounts[0];

    await erc721test.__ERC721Gen_init("T", "T", baseURI, transferProxy, operatorProxy, [[accounts[3], 100]], [trait1, trait2, trait3], 100, 10);

    assert.equal(await erc721test.getMinted(), 0, "minted")

    for (let i = 1; i < 11; i++) {
      await erc721test.mint(accounts[0], accounts[1], 1);
      assert.equal(await erc721test.getMinted(), i, "minted")
    }

    await erc721test.mint(accounts[0], accounts[1], 7);
    assert.equal(await erc721test.getMinted(), 17, "minted")
  })

})