const truffleAssert = require('truffle-assertions');
const events = require("../library/events");
const fakeBlock = require("../library/fake-block");

const ERC721Gen = artifacts.require("ERC721Gen.sol");

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

	it("totalSupply should always return 0", async () => {
		assert.equal(await testing.totalSupply(), 0, "totalSupply always 0")
		await testing.mint(accounts[0], accounts[1], 1);

		assert.equal(await testing.totalSupply(), 0, "totalSupply always 0")
		await testing.mint(accounts[0], accounts[1], 1);

		assert.equal(await testing.totalSupply(), 0, "totalSupply always 0")
		await testing.mint(accounts[0], accounts[1], 1);

		assert.equal(await testing.totalSupply(), 0, "totalSupply always 0")
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
		assert(ev.args.tokenId, "tokenId");
	})

	it("fails if more than total requested", async () => {
		for(let i = 0; i < 10; i ++){
			const tx = await testing.mint(accounts[0], accounts[1], 10);
			console.log(tx.receipt.gasUsed)
		}

		await truffleAssert.fails(
			testing.mint(accounts[0], accounts[1], 1),
			truffleAssert.ErrorType.REVERT,
			"all minted"
		)
	})

})