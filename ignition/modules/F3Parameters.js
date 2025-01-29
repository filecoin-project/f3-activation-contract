
import { buildModule, ModuleBuilder } from "@nomicfoundation/hardhat-ignition/modules";

const JAN_1ST_2030: number = 1893456000;
const ONE_GWEI: bigint = 1_000_000_000n;

export default buildModule("F3ParametersModule", (m: ModuleBuilder) => {
  const owner = m.getParameter<string>("owner", m.getAccount(0));
  const expiration = m.getParameter<number>("expirationTime", JAN_1ST_2030);

  const f3params = m.contract("F3Parameters", [owner, expiration]);
  return { f3params };
});
