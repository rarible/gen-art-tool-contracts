const ERC721Gen = artifacts.require('ERC721Gen');
const ERC721GenFactory = artifacts.require('ERC721GenFactory');

module.exports = async function (deployer, network, accounts) {

	//if it's a test network we don't need this migration
	if (network === "test") {
		return;
	}

	await deployer.deploy(ERC721Gen, { gas: 3200000 });
	const impl = await ERC721Gen.deployed()
	console.log("Deployed new impl at", impl.address);

	const factory = await ERC721GenFactory.deployed()
	await factory.changeImplementation(impl.address, { gas: 100000 })
};
