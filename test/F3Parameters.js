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

    const f3ParamContractFactory = await ethers.getContractFactory("F3Parameters");
    const f3ParamContract = await f3ParamContractFactory.deploy(owner, expireTime);

    return { f3param: f3ParamContract, expireTime, owner, otherAccount };
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
      const [activationEpoch, manifestData] = await f3param.activationInformation();
      expect(activationEpoch).to.equal(maxUint64);
      expect(manifestData).to.have.lengthOf(2); // 2 bytes for the "0x prefix"
    });
  });

  describe('Parameter updates', function () {
    it("Should update activation epoch and manifest data successfully", async function () {
      const { f3param, owner } = await loadFixture(deployOneYearExpireFixture);
      const currentBlockNumber = BigInt(await ethers.provider.getBlockNumber());
      const minActivationHeadroomBlocks = await f3param.getMinActivationHeadroomBlocks();
      const newActivationEpoch = currentBlockNumber + minActivationHeadroomBlocks + BigInt(1);
      const manifestData = "0x123456";

      await expect(f3param.connect(owner).updateActivationInformation(newActivationEpoch, manifestData))
        .to.emit(f3param, "ActivationInformationUpdated")
        .withArgs(newActivationEpoch);

      const [returnedActivationEpoch, returnedManifestData] = await f3param.activationInformation();
      expect(returnedActivationEpoch).to.equal(newActivationEpoch);
      expect(returnedManifestData).to.equal(manifestData);
    });

    it("Should revert if activation epoch is set to a past block", async function () {
      const { f3param, owner } = await loadFixture(deployOneYearExpireFixture);
      await mine(10)
      const pastBlock = BigInt(await ethers.provider.getBlockNumber() - 2);
      const manifestData = "0x123456";

      await expect(
        f3param.connect(owner).updateActivationInformation(pastBlock, manifestData)
      ).to.be.revertedWithCustomError(f3param, "UpdateActivationEpochInvalid")
        .withArgs(anyValue, pastBlock, "activationEpoch is before current block");
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
        .withArgs(anyValue, newActivationEpoch, "activationEpoch is within minActivationHeadroomBlocks from the current block")
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

    it("Should revert if non-owner attempts to updateActivationInformation", async function() {
      const { f3param, otherAccount } = await loadFixture(deployOneYearExpireFixture);
      const currentBlockNumber = BigInt(await ethers.provider.getBlockNumber());
      const minActivationHeadroomBlocks = await f3param.getMinActivationHeadroomBlocks();
      const newActivationEpoch = currentBlockNumber + minActivationHeadroomBlocks + BigInt(1);
      const manifestData = "0x123456";

      await expect(
        f3param.connect(otherAccount).updateActivationInformation(newActivationEpoch, manifestData)
      ).to.be.revertedWithCustomError(f3param, "OwnableUnauthorizedAccount");
    });

  });
});
