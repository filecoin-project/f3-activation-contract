
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const JAN_1ST_2030_EPOCH_SECONDS = Math.floor(new Date('2030-01-01T00:00:00Z').getTime() / 1000);
const ONE_GWEI = 1_000_000_000n;

export default buildModule("F3ParametersModule", (m) => {
  const owner = m.getParameter("owner", m.getAccount(0));
  const expiration = m.getParameter("expiration", JAN_1ST_2030_EPOCH_SECONDS);

  const f3params = m.contract("F3Parameters", [owner, expiration]);
  return { f3params };
});
