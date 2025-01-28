const {
  time,
  loadFixture,
  mine,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");


describe("F3Parameters", function () {
  async function deployOneYearExpireFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;

    const expireTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const F3Param = await ethers.getContractFactory("F3Parameters");
    const f3param = await F3Param.deploy(owner, expireTime);

    return { f3param, expireTime, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right expireTime", async function () {
      const { f3param, expireTime } = await loadFixture(deployOneYearExpireFixture);

      expect(await f3param.expiresAt()).to.equal(expireTime);
    });
    it("Should set the right owner", async function () {
      const { f3param, owner } = await loadFixture(deployOneYearExpireFixture);

      expect(await f3param.owner()).to.equal(owner.address);
    });
    it("Activation epoch should be max(uint64) and empty params", async function () {
      const {f3param} = await loadFixture(deployOneYearExpireFixture);

      const maxUint64 = BigInt(2)**BigInt(64)-BigInt(1);
      expect(await f3param.activatesAtEpoch()).to.equal(maxUint64);
      const [activation, params] = await f3param.activationInformation();
      expect(params).to.have.lengthOf(2); // 0x prefix
      expect(activation).to.equal(maxUint64);
    });
  });

  describe('Parameter updates', function () {
    it("Should update activation epoch and manifest data successfully", async function () {
      const { f3param, owner } = await loadFixture(deployOneYearExpireFixture);
      const currentBlockNumber = BigInt(await ethers.provider.getBlockNumber());
      const minActivationHeadroomBlocks = await f3param.getMinActivationHeadroomBlocks();
      const newActivationEpoch = currentBlockNumber + minActivationHeadroomBlocks + BigInt(1);
      const manifestData = "0x123456";

      await f3param.connect(owner).updateActivationInformation(newActivationEpoch, manifestData);

      const [activationEpoch, data] = await f3param.activationInformation();
      expect(activationEpoch).to.equal(newActivationEpoch);
      expect(data).to.equal(manifestData);
    });

  it("Should revert if activation epoch is less than minActivationHeadroomBlocks ahead of current block", async function () {
    const { f3param, owner } = await loadFixture(deployOneYearExpireFixture);
    const currentBlockNumber = BigInt(await ethers.provider.getBlockNumber());
    const minActivationHeadroomBlocks = await f3param.getMinActivationHeadroomBlocks();
    const newActivationEpoch = currentBlockNumber + minActivationHeadroomBlocks - BigInt(1);
    const manifestData = "0x123456";

    await expect(
      f3param.connect(owner).updateActivationInformation(newActivationEpoch, manifestData)
    ).to.be.revertedWithCustomError(f3param, "UpdateActivationEpochInvalid")
      .withArgs(anyValue, newActivationEpoch, "based on block time");
  });

    it("Should revert if update is attempted after expiry", async function () {
      const { f3param, owner } = await loadFixture(deployOneYearExpireFixture);
      const currentBlockNumber = BigInt(await ethers.provider.getBlockNumber());
      const minActivationHeadroomBlocks = await f3param.getMinActivationHeadroomBlocks();
      const newActivationEpoch = currentBlockNumber + minActivationHeadroomBlocks + BigInt(1);
      const manifestData = "0x123456";

      const expiryTime = BigInt(await f3param.expiresAt());
      await time.increaseTo(expiryTime + BigInt(100));

      await expect(
        f3param.connect(owner).updateActivationInformation(newActivationEpoch, manifestData)
      ).to.be.revertedWithCustomError(f3param, "UpdateExpired");
    });

    it("Should revert if activation epoch is set to a past block", async function () {
      const { f3param, owner } = await loadFixture(deployOneYearExpireFixture);
      await mine(10)
      const pastBlock = BigInt(await ethers.provider.getBlockNumber() - 2);
      const manifestData = "0x123456";

      await expect(
        f3param.connect(owner).updateActivationInformation(pastBlock, manifestData)
      ).to.be.revertedWithCustomError(f3param, "UpdateActivationEpochInvalid")
        .withArgs(anyValue, pastBlock, "before current block");
    });

    it("Should revert if update is attempted after activation", async function () {
      const { f3param, owner } = await loadFixture(deployOneYearExpireFixture);
      const currentBlockNumber = BigInt(await ethers.provider.getBlockNumber());
      const minActivationHeadroomBlocks = await f3param.getMinActivationHeadroomBlocks();
      const newActivationEpoch = currentBlockNumber + minActivationHeadroomBlocks + BigInt(1);
      const manifestData = "0x123456";

      await f3param.connect(owner).updateActivationInformation(newActivationEpoch, manifestData);
      await mine(minActivationHeadroomBlocks + BigInt(100))

      await expect(
        f3param.connect(owner).updateActivationInformation(
          newActivationEpoch + minActivationHeadroomBlocks + BigInt(100), manifestData)
      ).to.be.revertedWithCustomError(f3param, "UpdateAlreadyActive");
    });

  });
});
