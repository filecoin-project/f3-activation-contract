# F3 Activation Contract

This repository contains the on-chain contract for managing the Fast Finality (F3) parameters for Filecoin. The contract allows for dynamic updates based on mainnet test results, streamlining the activation process with a single network upgrade.

For the full motivation and detailed design, please refer to the [FIP discussion](https://github.com/filecoin-project/FIPs/discussions/1102).

## Key Features

- **On-Chain Parameter Management:** Enables real-time updates based on test results.
- **Controlled Update Mechanism:** Requires consensus from Lotus, Forest, and Venus teams.
- **Finalization and Self-Disabling:** Automatically disables after six months if not activated.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

