const { ethers } = require("ethers");
const routerAbi = require("./routerABI.json");

// === Config ===
const WETH = "0xC97B4e92fB267bB11b1CD2d475F9E8c16b433289";
const USDT = "0x38e659126AeB5dE4C243229b34Bd99f11D5bb2D3";
const SWAP_ROUTER = "0x45a05B1e370EC9d73c5D8E588dD038b975B1ee36";

const RPC_URL = "https://rpc.primordial.bdagscan.com";
const DEPLOYER_PK = "";
const FEE = 3000; // 0.3%
const POOL_ADDRESS = "0xC79DA839Fd3044a477D6542A1e7B7c99B7dE7169";

/*
    Swap WETH → USDT
    Run script: node script/swap.js
*/

// === Interfaces ===
const IERC20Abi = new ethers.Interface([
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 value) external returns (bool)",
  "function balanceOf(address owner) external view returns (uint256)"
]);
const USDTApprove0Abi = new ethers.Interface([
  "function approve(address spender, uint256 value) external"
]);
const poolAbi = new ethers.Interface([
  "function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16, uint16, uint16, uint8, bool)",
  "function liquidity() view returns (uint128)"
]);

// Helper functions
const approveWeth = async (wallet, amount) => {
  const token = new ethers.Contract(WETH, IERC20Abi, wallet);
  const tx = await token.approve(SWAP_ROUTER, amount);
  const receipt = await tx.wait();
  console.log(`Approve tx hash: ${receipt.hash}`);
};
const approveUsdt = async (wallet, amount) => {
  const token = new ethers.Contract(USDT, USDTApprove0Abi, wallet);
  const tx = await token.approve(SWAP_ROUTER, amount);
  const receipt = await tx.wait();
  console.log(`Approve tx hash: ${receipt.hash}`);
};
// -----
const getBalance = async (tokenAddress, wallet, provider) => {
  const token = new ethers.Contract(tokenAddress, IERC20Abi, provider);
  return await token.balanceOf(wallet);
};
const getPoolValues = async (wallet, provider) => {
  const pool = new ethers.Contract(POOL_ADDRESS, poolAbi, provider);
  let usdtBalance = await getBalance(USDT, wallet.address, provider);
  let wethBalance = await getBalance(WETH, wallet.address, provider);

  console.log("\nUser balance [USDT]:", usdtBalance);
  console.log("User balance [WETH]:", wethBalance);

  const liquidity = await pool.liquidity();
  const { sqrtPriceX96, tick } = await pool.slot0();
  usdtBalance = await getBalance(USDT, POOL_ADDRESS, provider);
  wethBalance = await getBalance(WETH, POOL_ADDRESS, provider);

  console.log("Pool balance [USDT]:", usdtBalance);
  console.log("Pool balance [WETH]:", wethBalance);
  console.log("Price in tick:", tick);
  console.log("new sqrtPriceX96:", sqrtPriceX96);
  console.log("Liquidity in pool:", liquidity.toString());
}

// === Main ===
async function swapTokens() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(DEPLOYER_PK, provider);
  const router = new ethers.Contract(SWAP_ROUTER, routerAbi, wallet);
  const amount = ethers.parseEther("0.001"); // WETH

  // === Approve tokens ===
  await approveWeth(wallet, amount);

  // === Check Allowance ===
  const token = new ethers.Contract(WETH, IERC20Abi, provider);
  console.log(await token.allowance(wallet.address, SWAP_ROUTER));
  await getPoolValues(wallet, provider);

  // === Swap exactInputSingle ===
  const input_params = {
    tokenIn: WETH,
    tokenOut: USDT,
    fee: FEE,
    recipient: wallet.address,
    deadline: Math.floor(Date.now() / 1000) + 600,
    amountIn: amount,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0
  };
  const tx = await router.exactInputSingle(input_params, { value: 0, gasLimit: 10_000_000 });

  // // === Swap exactOutputSingle ===
  // // const output_params = {
  // //   tokenIn: WETH,
  // //   tokenOut: USDT,
  // //   fee: FEE,
  // //   recipient: wallet.address,
  // //   amountOut: amount,
  // //   amountInMaximum: 0,
  // //   sqrtPriceLimitX96: 0
  // // };
  // // const tx = await router.exactOutputSingle(output_params, { value: 0, gasLimit: 10_000_000 });

  const receipt = await tx.wait();
  console.log("\nSwap tx hash:", receipt.hash);

  await getPoolValues(wallet, provider);
}

swapTokens();
