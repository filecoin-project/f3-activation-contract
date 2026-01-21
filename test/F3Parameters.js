const {
  time,
  loadFixture,
  mine,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

/**
 * @title F3Parameters Test Suite
 * @notice Validates activation epochs, lock-in periods, and ownership security.
 * The contract manages network parameters that activate at specific block heights (epochs).
 */
describe("F3Parameters Security & Logic Tests", function () {
  
  // Fixture for a clean state in every test - Improves performance
  async function deployOneYearExpireFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const expireTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    const [owner, otherAccount] = await ethers.getSigners();
    const f3ParamContractFactory = await ethers.getContractFactory("F3Parameters");
    const f3param = await f3ParamContractFactory.deploy(owner, expireTime);

    return { f3param, expireTime, owner, otherAccount };
  }

  

  describe("Deployment State", function () {
    it("Should initialize with correct expiration and ownership", async function () {
      const { f3param, expireTime, owner } = await loadFixture(deployOneYearExpireFixture);

      expect(await f3param.expiresAt()).to.equal(expireTime);
      expect(await f3param.owner()).to.equal(owner.address);
    });

    it("Should start with max uint64 activation (deactivated state)", async function () {
      const { f3param } = await loadFixture(deployOneYearExpireFixture);
      const MAX_UINT64 = BigInt("18446744073709551615");

      const [activation, params] = await f3param.activationInformation();
      expect(activation).to.equal(MAX_UINT64);
      expect(params).to.equal("0x"); // Optimized check for empty bytes
    });
  });

  describe("Parameter Transition Logic", function () {
    
    it("Should enforce minActivationHeadroomBlocks for updates", async function () {
      const { f3param, owner } = await loadFixture(deployOneYearExpireFixture);
      const currentBlock = BigInt(await ethers.provider.getBlockNumber());
      const headroom = await f3param.getMinActivationHeadroomBlocks();
      
      // Attempting to set an epoch too close to current block
      const invalidEpoch = currentBlock + headroom - 1n;
      
      await expect(f3param.connect(owner).updateActivationInformation(invalidEpoch, "0x1234"))
        .to.be.revertedWithCustomError(f3param, "UpdateActivationEpochInvalid");
    });

    

    it("Should lock-in parameters as they approach activation (Finality Guard)", async function () {
      const { f3param, owner } = await loadFixture(deployOneYearExpireFixture);
      const currentBlock = BigInt(await ethers.provider.getBlockNumber());
      const headroom = await f3param.getMinActivationHeadroomBlocks();
      const finality = BigInt(await f3param.FINALITY());

      const targetEpoch = currentBlock + headroom + 10n;
      await f3param.connect(owner).updateActivationInformation(targetEpoch, "0x1234");

      // Advance time to just before activation but within the finality/lock-in window
      await mine(targetEpoch - currentBlock - finality);

      await expect(f3param.connect(owner).updateActivationInformation(targetEpoch + 100n, "0x1234"))
        .to.be.revertedWithCustomError(f3param, "UpdateAlreadyLockedIn");
    });

    it("Should prevent updates after expiration time", async function () {
      const { f3param, owner } = await loadFixture(deployOneYearExpireFixture);
      const expiry = await f3param.expiresAt();

      // Warp time to past expiry
      await time.increaseTo(expiry + 1n);

      await expect(f3param.connect(owner).updateActivationInformation(0, "0x"))
        .to.be.revertedWithCustomError(f3param, "UpdateExpired");
    });
  });

  
});
