const { accounts } = require('@openzeppelin/test-environment');
const { BN, time } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const TeslaMoonShot = artifacts.require("TestTeslaMoonShot");
const IUniswapRouter = artifacts.require("IUniswapV2Router01");

contract('TeslaMoonShot', ([deployer, user1, user2, user3, user4]) => {

    let token;
    let uniswap;
    before(async () => {
        token = await TeslaMoonShot.deployed();
        await token.setSwapAndLiquifyEnabled(true);
        uniswap = await IUniswapRouter.at('0x7a250d5630b4cf539739df2c5dacb4c659f2488d');
        await token.approve('0x7a250d5630b4cf539739df2c5dacb4c659f2488d', 10000);
        await uniswap.addLiquidityETH(
            token.address,
            10000,
            10000,
            web3.utils.toWei('1', 'ether'),
            deployer,
            await time.latest() + time.duration.hours(1),
            {value:web3.utils.toWei('1')})
        console.log('>',(await token.LpTokenBalance()).toString());

        console.log((await token.decimals()).toString());
    });

    it("should return the rTotal", async() => {
        console.log((await token.getRTotal()).toString());
    })

    it("should transfer from deployer to user1", async ()=> {
        console.log('>',(await token.LpTokenBalance()).toString());

        console.log((await token.balanceOf(deployer)).toString());
        console.log((await token.balanceOf(user1)).toString());
        await token.transfer(user1, 1_000_000, { from: deployer});
        console.log((await token.balanceOf(deployer)).toString());
        console.log((await token.balanceOf(user1)).toString());
    });

    it("should transfer from user1 to user2", async ()=> {
        console.log((await token.balanceOf(user1)).toString());
        console.log((await token.balanceOf(user2)).toString());
        await token.transfer(user2, 500_000, { from: user1});
        console.log((await token.balanceOf(user1)).toString());
        console.log((await token.balanceOf(user2)).toString());
    });

    it("should transfer from user2 to user3", async ()=> {
        console.log((await token.balanceOf(user2)).toString());
        console.log((await token.balanceOf(user3)).toString());
        await token.transfer(user3, 100_000, { from: user2});
        console.log((await token.balanceOf(user2)).toString());
        console.log((await token.balanceOf(user3)).toString());
    });

    it("should return totalSupply", async() => {
        console.log((await token.totalSupply()).toString());
    })

    it('should return the total fees', async() => {
        console.log((await token.totalFees()).toString())
    })

    it('should return the total burn', async() => {
        console.log((await token.totalBurn()).toString())
    });

    it('should return the Liquidity Pool Balance', async() => {
        console.log((await token.LpTokenBalance()).toString())
    });

});