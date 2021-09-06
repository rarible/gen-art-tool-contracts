const truffleAssert = require('truffle-assertions');
const events = require("./events");
const fakeBlock = require("./fake-block")

const ERC721Gen = artifacts.require("ERC721Gen.sol");
const ERC1155Gen = artifacts.require("ERC1155Gen.sol");

contract("ERC1155Gen", accounts => {
	let erc721;
	let erc1155;

	beforeEach(async () => {
		const trait1 = ["Test1", ["v1", "v2", "v3"], [1, 2, 9997]]
		const trait2 = ["Test2", ["v1", "v2", "v3"], [3333, 3333, 3334]]
		const trait3 = ["Test3", ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"], [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000]]

		erc721 = await ERC721Gen.new();
		await erc721.__ERC721Gen_init("T", "T", [trait1, trait2, trait3]);

		erc1155 = await ERC1155Gen.new();
		await erc1155.__ERC1155Gen_init(erc721.address, 10000, "uri");
	});

	it("mints single 721", async () => {
		const tx = await erc1155.mint721(accounts[0], accounts[1], 1);
		await fakeBlock(accounts);

		const [mint] = events(tx, "Mint721");
		const traits = await erc721.getTokenTraits(mint.args.tokenId);
		assert.equal(traits.length, 3);
	})

	it("doesn't mint 721 if not owner or approved", async () => {
		truffleAssert.fails(
			erc1155.mint721(accounts[0], accounts[1], 1, { from: accounts[1] }),
			truffleAssert.ErrorType.REVERT,
			"ERC1155Gen: caller is not owner nor approved"
		)

		await erc1155.setApprovalForAll(accounts[1], true);
		await erc1155.mint721(accounts[0], accounts[1], 1, { from: accounts[1] });
	})

})