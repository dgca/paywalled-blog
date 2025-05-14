import hre from "hardhat";

async function main() {
  const mockUSDC = await hre.viem.deployContract("MockUSDC");
  console.log(`MockUSDC deployed to ${mockUSDC.address}`);

  const orderHandler = await hre.viem.deployContract("OrderHandler", [
    mockUSDC.address,
  ]);
  console.log(`OrderHandler deployed to ${orderHandler.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
