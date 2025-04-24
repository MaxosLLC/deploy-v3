const { ethers } = require("ethers");

// === Config ===
const WETH = "0xC97B4e92fB267bB11b1CD2d475F9E8c16b433289";
const USDT = "0x38e659126AeB5dE4C243229b34Bd99f11D5bb2D3";
const POSITION_MANAGER = "0xc5587d796aB656490BA5b73553A0b7a20a14bBce";

const RPC_URL = "https://rpc.primordial.bdagscan.com";
const DEPLOYER_PK = "";
const FEE = 3000; // 0.3%
const POOL_ADDRESS = "0xC79DA839Fd3044a477D6542A1e7B7c99B7dE7169";

/*
    Run script: node script/increase_liquidity.js
*/

// === Interfaces ===
const IPositionManagerAbi = new ethers.Interface([
    "function createAndInitializePoolIfNecessary(address token0, address token1, uint24 fee, uint160 sqrtPriceX96)",
    `function mint(
    (
      address token0,
      address token1,
      uint24 fee,
      int24 tickLower,
      int24 tickUpper,
      uint256 amount0Desired,
      uint256 amount1Desired,
      uint256 amount0Min,
      uint256 amount1Min,
      address recipient,
      uint256 deadline
    ) params
  ) external payable returns (
    uint256 tokenId,
    uint128 liquidity,
    uint256 amount0,
    uint256 amount1
  )`
]);
const IERC20Abi = new ethers.Interface([
    "function approve(address spender, uint256 value) external returns (bool)",
    "function balanceOf(address owner) external view returns (uint256)"
]);

// Helper functions
const approveToken = async (wallet, tokenAddress, amount) => {
    const token = new ethers.Contract(tokenAddress, IERC20Abi, wallet);
    const tx = await token.approve(POSITION_MANAGER, amount);
    const receipt = await tx.wait();
    console.log(`Approve tx hash: ${receipt.hash}`);
};
const getBalance = async (tokenAddress, wallet, provider) => {
    const token = new ethers.Contract(tokenAddress, IERC20Abi, provider);
    return  await token.balanceOf(wallet);
};

// === Main ===
async function increaseLiquidity() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(DEPLOYER_PK, provider);
    const positionManager = new ethers.Contract(POSITION_MANAGER, IPositionManagerAbi, wallet);

    const amount0 = ethers.parseUnits("0.2", 18); // WETH
    const amount1 = ethers.parseUnits("500", 6);  // USDT

    const [token0, token1, a0d, a1d] = WETH.toLowerCase() < USDT.toLowerCase() ? [WETH, USDT, amount0, amount1] : [USDT, WETH, amount1, amount0];

    // === approve tokens ===
    await approveToken(wallet, token0, a0d);
    await approveToken(wallet, token1, a1d);

    // === Ticks y mint ===
    const mintParams = {
        token0,
        token1,
        fee: FEE,
        tickLower: -887272,
        tickUpper: 887272,
        amount0Desired: a0d,
        amount1Desired: a1d,
        amount0Min: 0,
        amount1Min: 0,
        recipient: wallet.address,
        deadline: Math.floor(Date.now() / 1000) + 60 * 10,
    };

    const tx = await positionManager.mint(mintParams, { gasLimit: 10_000_000 });
    const receipt = await tx.wait();
    console.log("Mint tx hash:", receipt.hash);

    const usdtBalance = await getBalance(USDT, POOL_ADDRESS, provider)
    const wethBalance = await getBalance(WETH, POOL_ADDRESS, provider)

    console.log("Pool balance [USDT]:", usdtBalance)
    console.log("Pool balance [WETH]:", wethBalance)
}

increaseLiquidity();

