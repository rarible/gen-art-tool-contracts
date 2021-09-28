const TraitsTest = artifacts.require("TraitsTest.sol");
const fakeBlock = require("../library/fake-block");

contract("Traits", accounts => {
  let testing;

  beforeEach(async () => {
    testing = await TraitsTest.new();
  });

  it("getTraitValue works", async () => {
    const trait = [[1, 2, 9997]]

    assert.equal(await testing._testGetTraitValue(trait, 0), 0);
    assert.equal(await testing._testGetTraitValue(trait, 1), 1);
    assert.equal(await testing._testGetTraitValue(trait, 2), 1);
    assert.equal(await testing._testGetTraitValue(trait, 3), 2);
    assert.equal(await testing._testGetTraitValue(trait, 9999), 2);
  })

  it("getRandom works", async () => {
    assert.equal((await testing._testGetRandom(10000, 0)).toString(), "7911");
    assert.equal((await testing._testGetRandom(10000, 1)).toString(), "8781");
  })

  it("random gives diff numbers for diff seeds", async () => {
    const trait = [[1, 2, 9997]]
    const testing = await TraitsTest.new([trait]);

    const v1_1 = await testing._testRandom(0, 10000);
    const v2_1 = await testing._testRandom(0, 10000);
    const v3_1 = await testing._testRandom(1, 10000);

    assert.equal(v1_1.toString(), v2_1.toString());
    assert.notEqual(v1_1.toString(), v3_1.toString());

    await fakeBlock(accounts);

    const v1_2 = await testing._testRandom(0, 10000);
    const v2_2 = await testing._testRandom(0, 10000);
    const v3_2 = await testing._testRandom(1, 10000);

    assert.equal(v1_2.toString(), v2_2.toString());
    assert.notEqual(v1_2.toString(), v3_2.toString());

    assert.notEqual(v1_1.toString(), v1_2.toString());
  })
})