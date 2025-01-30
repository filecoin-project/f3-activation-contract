// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

/// @title F3Parameters
/// @dev This contract manages parameters for the F3 system, allowing changes until the activation epoch.
///      It ensures a review period for the community before activation.
/// @notice https://github.com/filecoin-project/FIPs/discussions/1102

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract F3Parameters is Ownable {
    /// @dev The expiry timestamp after which updates are not allowed.
    ///      Note: updates also aren't allowed after the _activationEpoch.
    uint64 private immutable _expiry;

    /// @dev The block number at which the parameters become active,
    ///      and no further updates to _manifestData are accepted.
    uint64 private _activationEpoch;

    /// @dev The data associated with the manifest for the parameters.
    ///      It is up to consumers (e.g., Lotus) to parse this data and be defensive in what they allowed be mutated as a result.
    bytes private _manifesetData;

    /// @param owner The address of the contract owner.
    /// @param expiry The timestamp after which updates are not allowed.
    constructor(address owner, uint64 expiry) Ownable(owner) {
        _expiry = expiry;
        _activationEpoch = type(uint64).max;
    }

    /// @notice Returns the expiry timestamp.
    /// @return The expiry timestamp.
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
	uint128 public constant MIN_ACTIVATION_HEADROOM_BLOCKS = MIN_ACTIVATION_HEADROOM / BLOCK_TIME;

    /// @notice Returns the minimum activation headroom in blocks.
    /// @return The minimum activation headroom in blocks.
    function getMinActivationHeadroomBlocks() public pure returns (uint128) {
        return MIN_ACTIVATION_HEADROOM_BLOCKS;
    }

    /// @notice Emitted when the activation information is updated.
    /// @param activationEpoch The new activation epoch block number.
    event ActivationInformationUpdated(uint64 activationEpoch);

	/// @notice Updates the activation epoch and manifest data.
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
            revert UpdateActivationEpochInvalid(uint64(block.number), activationEpoch, "activationEpoch is before current block");
        }
        if (uint128(activationEpoch - block.number) < MIN_ACTIVATION_HEADROOM_BLOCKS) {
            revert UpdateActivationEpochInvalid(uint64(block.number), activationEpoch, "activationEpoch is within minActivationHeadroomBlocks from the current block");
        }
        
        _activationEpoch = activationEpoch;
        _manifesetData = manifestData;

        emit ActivationInformationUpdated(activationEpoch);
    }

}
