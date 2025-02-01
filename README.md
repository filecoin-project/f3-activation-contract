# F3 Activation Contract

This repository contains the on-chain contract for managing the Fast Finality (F3) parameters for Filecoin. The contract allows for dynamic updates based on mainnet test results, streamlining the activation process with a single network upgrade.

For the full motivation and detailed design, please refer to the [FIP discussion](https://github.com/filecoin-project/FIPs/discussions/1102).

## Key Features

- **On-Chain Parameter Management:** Enables real-time updates based on test results.
- **Controlled Update Mechanism:** Requires consensus from Lotus, Forest, and Venus teams.
- **Finalization and Self-Disabling:** Automatically disables after six months if not activated.

## Development
1. Install yarn (e.g., `brew install yarn`)
2. Initialize yarn in the repo: `yarn`
3. Set `PRIVATE_KEY` environment variable (e.g., `export PRIVATE_KEY='0000000000000000000000000000000000000000000000000000000000000000'`)
4. Run tests: `yarn hardhat test`

There are some notes in [devnotes.md](devnotes.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

