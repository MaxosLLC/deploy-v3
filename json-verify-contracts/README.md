# Verify contracts

To verify contract using the scan UI: [SCAN](https://primordial.bdagscan.com/contract?chain=EVM)

-------------

> Contract: UniswapV3Factory
> Address: 0x13aA6774D72963A690bD43073a1B1a0AA21c9BA0
> Compiler: 0.7.6
> Optimizer 200
> License: GPL-2.0-or-later
> Constructor args: []
> standar-input-json: UniswapV3Factory.json

-------------

> Contract: multicall2Address
> Address: 0x54E3C45108a4123D803CD1727760c96EA10f921f
> Compiler: 0.7.6
> Optimizer 200
> License: MIT
> Constructor args: []
> standar-input-json: multicall2Address.json

-------------

Contract: tickLensAddress
> Address: 0xa58bEb824C509c4cd2E1B6cAc1EB648CB3cF9c8d
> Compiler: 0.7.6
> Optimizer 1000000
> License: GPL-2.0-or-later
> Constructor args: []
> standar-input-json: 0xa58bEb824C509c4cd2E1B6cAc1EB648CB3cF9c8d.json

-------------

Contract: nonfungibleTokenPositionManagerAddress
> Address: 0xc5587d796aB656490BA5b73553A0b7a20a14bBce
> Compiler: 0.7.6
> Optimizer 200
> License: GPL-2.0-or-later
> Constructor args: [
    0x
    00000000000000000000000013aa6774d72963a690bd43073a1b1a0aa21c9ba0
    000000000000000000000000c97b4e92fb267bb11b1cd2d475f9e8c16b433289
    000000000000000000000000f4e7bc4fb6187db7532dcabc27a2c5ece124b3e8
]
Replace with: v3CoreFactoryAddress - weth9Address - descriptorProxyAddress
> standar-input-json: nonfungibleTokenPositionManagerAddress.json

-------------

Contract: v3MigratorAddress
> Address: 0xd36aaE88283aD096526F695aD9d8BDC6Ba2EED93
> Compiler: 0.7.6
> Optimizer 1000000
> License: GPL-2.0-or-later
> Constructor args: [
    0x
    00000000000000000000000013aa6774d72963a690bd43073a1b1a0aa21c9ba0
    000000000000000000000000c97b4e92fb267bb11b1cd2d475f9e8c16b433289
    000000000000000000000000c5587d796aB656490BA5b73553A0b7a20a14bBce
]
Replace with: v3CoreFactoryAddress - weth9Address - nonfungibleTokenPositionManagerAddress
> standar-input-json: v3MigratorAddress.json

-------------

Contract: SwapRouter02
> Address: 0x45a05B1e370EC9d73c5D8E588dD038b975B1ee36
> Compiler: 0.7.6
> Optimizer 1000000
> License: GPL-2.0-or-later
> Constructor args: [
    0x
    0000000000000000000000000000000000000000000000000000000000000000
    00000000000000000000000013aA6774D72963A690bD43073a1B1a0AA21c9BA0
    000000000000000000000000c5587d796aB656490BA5b73553A0b7a20a14bBce
    000000000000000000000000C97B4e92fB267bB11b1CD2d475F9E8c16b433289
    
]
Replace with: v2CoreFactoryAddress - v3CoreFactoryAddress - nonfungibleTokenPositionManagerAddress - weth9Address
> standar-input-json: SwapRouter02.json
