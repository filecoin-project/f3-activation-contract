## F3 Activation Procedure (FRC-0099)

This document outlines the procedure for activating F3 on the Filecoin network, adhering to FRC-0099. The process involves a multi-step approach, leveraging a smart contract to ensure transparency and community consensus.

1.  **Parameter Selection and Bootstrap Epoch Determination**
    *   Goal: Establish the "good parameter set" for F3 and the initial epoch for its activation.
    *   Action: Analyze nv25 passive testing results. Consider network performance, stability, and community input.
    *   Output: A finalized set of F3 parameters and a proposed bootstrap epoch.

2.  **Manifest Definition and Storage**
    *   Goal: Formally define the parameters and bootstrap epoch for distribution.
    *   Action:
        *   Create a manifest file (e.g., JSON) that clearly defines all F3 parameters and the selected bootstrap epoch.
        *   Commit the manifest file into the `f3-activation-contract` repository.
    *   Output: A verifiable manifest file stored in the repository.
    *   **Manifest Link:** \[*Link to manifest file in repository*]

3.  **Communication and Coordination**
    *   Goal: Ensure all stakeholders are informed and aligned.
    *   Action:
        *   Communicate the proposed F3 parameters, bootstrap epoch, and rationale to Lotus, Forest, and Venus implementation teams.
        *   Establish the expected encoding scheme of the manifest so that it is the same across implementations.
        *   Share the manifest file and the address of the smart contract.
    *   **Smart Contract Address:** \[*F3 Activation Smart Contract Address*]

4.  **Smart Contract Interaction using SAFE Transaction Builder**
    *   Goal: Prepare and execute the transaction that sets the parameters in the smart contract.
    *   Action:
        *   Use the SAFE Transaction Builder to craft a transaction that interacts with the F3 activation smart contract.
        *   The transaction should call the function on the smart contract that sets the F3 parameters and bootstrap epoch.
        *   Verify that the encoded manifest is correctly formatted and points to the parameters.
    *   **Multi-Sig Address:** \[*Address of the Multi-Sig contract*]

5.  **Multi-Sig Approval**
    *   Goal: Achieve consensus among implementation partners.
    *   Action:
        *   Implementation partners (Lotus, Forest, Venus) should review the proposed transaction in the SAFE Transaction Builder.
        *   Each partner uses their key to sign the transaction, indicating their approval of the F3 parameters and bootstrap epoch.

6.  **Transaction Publication and Execution**
    *   Goal: Activate F3 on the network.
    *   Action:
        *   Once the required number of signatures is collected, publish the signed transaction to the Filecoin network.
        *   The smart contract will execute the transaction, setting the F3 parameters and scheduling the bootstrap epoch.
    *   **Transaction Hash:** \[*Transaction Hash of the Activation Transaction*]

7.  **Verification and Monitoring**
    *   Goal: Confirm successful activation and ongoing stability.
    *   Action:
        *   After the bootstrap epoch, verify that F3 is active on the network by monitoring relevant metrics .
        *   Continuously monitor network performance and adjust parameters as needed, following the same process.


