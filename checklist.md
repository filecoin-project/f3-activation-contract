## F3 Activation Procedure (FRC-0099)

### Purpose
This document outlines the procedure for activating F3 on the Filecoin network, adhering to [FRC-0099](https://github.com/filecoin-project/FIPs/blob/master/FRCs/frc-0099.md). The process involves a multi-step approach, leveraging a smart contract to ensure transparency and community consensus.

This checklist will be copied into the ["tracking issue"](https://github.com/filecoin-project/f3-activation-contract/issues/22) before we start the activation procedure so that the current status can be tracked and commented upon.

### Meta
* Mainnet contract address: [0xA19080A1Bcb82Bb61bcb9691EC94653Eb5315716](https://filecoin.blockscout.com/address/0xA19080A1Bcb82Bb61bcb9691EC94653Eb5315716?tab=contract)
* Multisig owning contract: [0x53bd89Ff2Ff97541f42ACC3AFC0C0030e7410422](https://safe.filecoin.io/settings/setup?safe=filecoin:0x53bd89Ff2Ff97541f42ACC3AFC0C0030e7410422)

### Steps
1.  **Parameter Selection and Bootstrap Epoch Determination**
    *   Goal: Establish the "good parameter set" for F3 and the initial epoch for its activation.
    *   Action: Analyze [nv25 passive testing results](https://github.com/filecoin-project/go-f3/issues/802). Consider network performance, stability, and community input.
    * Status: not started
    *   Output: A finalized set of F3 parameters and a proposed bootstrap epoch are posted in the "tracking issue".

2.  **Manifest Definition, Storage, and Communication**
    *   Goals: 
         * Formally define the parameters and bootstrap epoch for distribution.
         * Ensure all stakeholders are informed and aligned.
    *   Action:
        * Create a PR against [mainnet-manifest.json](https://github.com/filecoin-project/f3-activation-contract/blob/master/tasks/mainnet-manifest.json) that clearly defines all F3 parameters and the selected bootstrap epoch.
        * Request review from Lotus (@masih), Forest (@LesnyRumcajs), and Venus (@simlecode).
        * Post a link to the PR in #fil-implementers.
        * Post a link to the PR in the "tracking issue".
        *   Commit the manifest file into the `f3-activation-contract` repository.
    *   Status: not started
    *   Output: A verifiable manifest file stored in the repository
        *   Manifest Link: [*Link to manifest file in repository*]

3.  **Smart Contract Interaction using SAFE Transaction Builder**
    *   Goal: Prepare the transaction that sets the parameters in the smart contract.
    *   Action:
        *   Use the SAFE Transaction Builder to craft a transaction that interacts with the F3 activation smart contract.
        *   The transaction should call the function on the smart contract that sets the F3 parameters and bootstrap epoch.
        *   Verify that the encoded manifest is correctly formatted and points to the parameters.
    *   Status: not started
    *   Output: screenshot of what was submitted to "SAFE Transaction Builder" 

4.  **Multi-Sig Approval**
    *   Goal: Achieve consensus among implementation partners
    *   Action:
        *   Implementation partners (Lotus, Forest, Venus) should review the proposed transaction via the CLI tooling.
        *   Each partner uses their key to sign the transaction, indicating their approval of the F3 parameters and bootstrap epoch.
    *   Status: not started

5.  **Transaction Publication and Execution**
    *   Goal: Execute the transaction that sets the parameters in the smart contract, effectively starting the clock for F3 activation on the network.
    *   Action:
        *   Once the required number of signatures is collected, publish the signed transaction to the Filecoin network.
        *   The smart contract will execute the transaction, setting the F3 parameters and scheduling the bootstrap epoch.
        *   Post the transaction hash to the "tracking issue".
    *   Status: not started
    *   Output: Transaction hash of the activation transaction
        *   Transaction Hash: [*Transaction Hash of the Activation Transaction*]

6.  **Verification and Monitoring**
    *   Goal: Confirm successful activation.
    *   Action:
        *   After the bootstrap epoch, verify that F3 is active on the network by monitoring relevant metrics.
        *   Close with comment the "tracking issue": "F3 is activated on mainnet.  Closing this issue.  Continuous network performance happens outside this issue."
    *   Status: not started

