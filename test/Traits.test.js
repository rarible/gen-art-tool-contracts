const TraitsTest = artifacts.require("TraitsTest.sol");

contract("Traits", accounts => {
	let testing;

	beforeEach(async () => {
		testing = await TraitsTest.new();
	});

	it("getTraitValue works", async () => {
		const trait = ["Test", ["v1", "v2", "v3"], [1, 2, 9997]]
		assert.equal(await testing._testGetTraitValue(trait, 0), 0);
		assert.equal(await testing._testGetTraitValue(trait, 1), 1);
		assert.equal(await testing._testGetTraitValue(trait, 2), 1);
		assert.equal(await testing._testGetTraitValue(trait, 3), 2);
		assert.equal(await testing._testGetTraitValue(trait, 9999), 2);
	})

	it("generate random traits work", async () => {
		const trait1 = ["Test1", ["v1", "v2", "v3"], [1, 2, 9997]]
		const trait2 = ["Test2", ["v1", "v2", "v3"], [3333, 3333, 3334]]
		const trait3 = ["Test3", ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"], [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000]]

		await testing.__TraitsTest_init([trait1, trait2, trait3]);

		for (let i = 0; i < 50; i++) {
			await web3.eth.sendTransaction({ from: accounts[0], to: accounts[0], gasPrice: 0 });
			const result = await testing._testGenerateRandomTraits();
			assert.equal(result.length, 3);
			console.log("generated", result.map(x => x.toString()));
		}
	})

	it("random gives diff numbers for diff seeds", async () => {
		const v1_1 = await testing._testRandom(0, 10000);
		const v2_1 = await testing._testRandom(0, 10000);
		const v3_1 = await testing._testRandom(1, 10000);

		assert.equal(v1_1.toString(), v2_1.toString());
		assert.notEqual(v1_1.toString(), v3_1.toString());

		await web3.eth.sendTransaction({ from: accounts[0], to: accounts[0], gasPrice: 0 });

		const v1_2 = await testing._testRandom(0, 10000);
		const v2_2 = await testing._testRandom(0, 10000);
		const v3_2 = await testing._testRandom(1, 10000);

		assert.equal(v1_2.toString(), v2_2.toString());
		assert.notEqual(v1_2.toString(), v3_2.toString());

		assert.notEqual(v1_1.toString(), v1_2.toString());
	})
})