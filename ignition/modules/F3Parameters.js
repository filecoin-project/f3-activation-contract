
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const JAN_1ST_2030 = 1893456000;
const ONE_GWEI = 1_000_000_000n;

module.exports = buildModule("F3ParametersModule", (m) => {
  const owner = m.getParameter("owner", m.getAccount(0))
  const expiration = m.getParameter("expiratinTime", JAN_1ST_2030)

  const f3params = m.contract("F3Parameters", [owner, expiration]);
  return { f3params };
});
