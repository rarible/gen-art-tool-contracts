const truffleAssert = require('truffle-assertions');

const ERC721Gen = artifacts.require("ERC721Gen.sol");
const ERC721GenTest = artifacts.require("ERC721GenTest.sol")

contract("Traits", accounts => {
	let testing;
	let genTest;

	beforeEach(async () => {
		const trait1 = ["Test1", ["v1", "v2", "v3"], [1, 2, 9997]]
		const trait2 = ["Test2", ["v1", "v2", "v3"], [3333, 3333, 3334]]
		const trait3 = ["Test3", ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"], [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000]]

		testing = await ERC721Gen.new();
		await testing.__ERC721Gen_init("T", "T", [trait1, trait2, trait3]);

		genTest = await ERC721GenTest.new();
	});

	it("reverts if traits are queried in the same block", async () => {
		const tx = await genTest.mintAndGetTraits(testing.address, accounts[0], false);
		let tokenIdEvent;
		await truffleAssert.eventEmitted(tx, "TokenId", ev => {
			tokenIdEvent = ev;
			return true;
		})

		await web3.eth.sendTransaction({ from: accounts[0], to: accounts[0], gasPrice: 0 });
		const traits = await testing.getTokenTraits(tokenIdEvent.value);
		assert.equal(traits.length, 3);

		await truffleAssert.fails(
			genTest.mintAndGetTraits(testing.address, accounts[0], true),
			truffleAssert.ErrorType.REVERT,
			"can't read traits in the same block"
		);
	})
})