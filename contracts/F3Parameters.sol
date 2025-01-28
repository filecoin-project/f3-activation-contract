// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

/// @title F3Parameters
/// @dev This contract manages parameters for the F3 system, allowing changes until the activation epoch.
///      It ensures a review period for the community before activation.

import "hardhat/console.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract F3Parameters is Ownable {
    /// @dev The expiry block number after which updates are not allowed.
    uint64 private immutable _expiry;

    /// @dev The block number at which the parameters become active.
    uint64 private _activationEpoch;

    /// @dev The data associated with the manifest for the parameters.
    bytes private _manifesetData;

    /// @notice Initializes the contract with the owner and expiry block number.
    /// @param owner The address of the contract owner.
    /// @param expiry The block number after which updates are not allowed.
    constructor(address owner, uint64 expiry) Ownable(owner) {
        _expiry = expiry;
        _activationEpoch = type(uint64).max;
    }

    /// @notice Returns the expiry block number.
    /// @return The expiry block number.
    function expiresAt() public view returns (uint64) {
        return _expiry;
    }

    /// @notice Returns the activation epoch block number.
    /// @return The activation epoch block number.
    function activatesAtEpoch() public view returns (uint64) {
        return _activationEpoch;
    }

    /// @notice Returns the activation epoch and manifest data.
    /// @return The activation epoch and manifest data.
    function activationInformation() public view returns (uint64, bytes memory) {
        return (_activationEpoch, _manifesetData);
    }

    /// @dev Error indicating that an update attempt was made after the expiry block.
    error UpdateExpired();

    /// @dev Error indicating that an update attempt was made after the activation epoch.
    error UpdateAlreadyActive();

    /// @dev Error indicating an invalid activation epoch update attempt.
    /// @param currentEpoch The current block number.
    /// @param activationEpoch The attempted activation epoch.
    /// @param reason The reason for the invalid update.
    error UpdateActivationEpochInvalid(uint64 currentEpoch, uint64 activationEpoch, string reason);

    /// @dev The time in seconds for each block.
    uint128 constant BLOCK_TIME = 30 seconds;

    /// @dev The minimum headroom time in seconds before activation.
    uint128 constant MIN_ACTIVATION_HEADROOM = 4 days;
	/// @dev The minimum headroom time in blocks.
	uint64 public constant MIN_ACTIVATION_HEADROOM_BLOCKS = MIN_ACTIVATION_HEADROOM / BLOCK_TIME;

    /// @notice Returns the minimum activation headroom in blocks.
    /// @return The minimum activation headroom in blocks.
    function getMinActivationHeadroomBlocks() public pure returns (uint64) {
        return MIN_ACTIVATION_HEADROOM_BLOCKS;
    }
    /// @dev Can only be called by the owner and before the expiry and activation epochs.
    /// @param activationEpoch The new activation epoch block number.
    /// @param manifestData The new manifest data.
    function updateActivationInformation(uint64 activationEpoch, bytes calldata manifestData) public onlyOwner {
        if (block.timestamp > _expiry) {
            revert UpdateExpired();
        }
        if (block.number >= _activationEpoch) {
            revert UpdateAlreadyActive();
        }
        if (activationEpoch <= block.number) {
            revert UpdateActivationEpochInvalid(uint64(block.number), activationEpoch, "before current block");
        }
        if (uint128(activationEpoch - block.number) * BLOCK_TIME < MIN_ACTIVATION_HEADROOM) {
            revert UpdateActivationEpochInvalid(uint64(block.number), activationEpoch, "based on block time");
        }
        
        _activationEpoch = activationEpoch;
        _manifesetData = manifestData;
    }

}
