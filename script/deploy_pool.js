const { ethers } = require("ethers");

// === Config ===
const WETH = "0xC97B4e92fB267bB11b1CD2d475F9E8c16b433289";
const USDT = "0x38e659126AeB5dE4C243229b34Bd99f11D5bb2D3";

const UNISWAP_V3_FACTORY = "0x13aA6774D72963A690bD43073a1B1a0AA21c9BA0";
const POSITION_MANAGER = "0xc5587d796aB656490BA5b73553A0b7a20a14bBce";

const RPC_URL = "https://rpc.primordial.bdagscan.com";
const DEPLOYER_PK = "";
const FEE = 3000; // 0.3%

/*
    Run script: node script/deploy_pool.js
    Pool created: 0xC79DA839Fd3044a477D6542A1e7B7c99B7dE7169
*/

// === Interfaces ===
const IFactoryAbi = new ethers.Interface([
    "function getPool(address token0, address token1, uint24 fee) external view returns (address)"
]);
const IPositionManagerAbi = new ethers.Interface([
    "function createAndInitializePoolIfNecessary(address token0, address token1, uint24 fee, uint160 sqrtPriceX96)",
]);

// === Main ===
async function deployPool() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(DEPLOYER_PK, provider);

    const [token0, token1, price] = WETH.toLowerCase() < USDT.toLowerCase() ? [WETH, USDT, 4585618311359384700632587n] : [USDT, WETH, 269791326103028563087020970n];
    const factory = new ethers.Contract(UNISWAP_V3_FACTORY, IFactoryAbi, provider);
    const positionManager = new ethers.Contract(POSITION_MANAGER, IPositionManagerAbi, wallet);

    console.log("Creating pool ...");
    await (await positionManager.createAndInitializePoolIfNecessary(token0, token1, FEE, price)).wait();    
    const poolAddress = await factory.getPool(token0, token1, FEE);

    console.log(`Pool address at: ${poolAddress}`);
}

deployPool();

