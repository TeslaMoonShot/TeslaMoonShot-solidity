const { amountAfterFees, swapEthForToken } = require("./utils/utils");
const { time } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const TeslaMoonShot = artifacts.require("TestTeslaMoonShot");
const IUniswapRouter2 = artifacts.require("IUniswapV2Router02");


contract('TeslaMoonShot', ([deployer, user1, user2, user3, user4, user5, user6, user7, user8, user9]) => {
    let token;
    let uniswapV2Router02;
    let uniswapPair;
    let uniswapRouter2Address = '0x7a250d5630b4cf539739df2c5dacb4c659f2488d'
    let taxFee;
    let burnFee;
    let liquidityFee;
    let deployerBalance;
    let user1Balance;
    let user2Balance;
    let user3Balance;
    let user4Balance;
    let user5Balance;
    let user6Balance;
    let user7Balance;
    let user8Balance;
    let user9Balance;
    let contractBalance;

    before(async () => {
        token = await TeslaMoonShot.deployed();
        uniswapPair = await token.uniswapV2Pair();
        uniswapV2Router02 = await IUniswapRouter2.at(uniswapRouter2Address);
        await token.approve(uniswapV2Router02.address, 50_000_000_000);
        await uniswapV2Router02.addLiquidityETH(
            token.address,
            50_000_000_000,
            50_000_000_000,
            web3.utils.toWei('200', 'ether'),
            deployer,
            await time.latest() + time.duration.hours(1),
            {value:web3.utils.toWei('200', 'ether')})
         taxFee = await token.taxFee();
         burnFee = await token.burnFee();
         liquidityFee = await token.liquidityFee();
    });

    beforeEach(async() => {
        deployerBalance = await token.balanceOf(deployer);
        user1Balance = await token.balanceOf(user1);
        user2Balance = await token.balanceOf(user2);
        user3Balance = await token.balanceOf(user3);
        user4Balance = await token.balanceOf(user4);
        user5Balance = await token.balanceOf(user5);
        user6Balance = await token.balanceOf(user6);
        user7Balance = await token.balanceOf(user7);
        user8Balance = await token.balanceOf(user8);
        user9Balance = await token.balanceOf(user9);
        contractBalance = await token.balanceOf(token.address);
        console.log(contractBalance.toString());

    })

    it("should return tax fee", async() => {
        expect(taxFee.toString()).to.equal('5');
    })

    it("should return burn fee", async() => {
        expect(burnFee.toString()).to.equal('2');
    })

    it("should return liquidity fee", async() => {
        expect(liquidityFee.toString()).to.equal('1');
    })

    it("should return the rTotal", async() => {
        expect((await token.getRTotal()).toString()).to.equal('115792089237316195423570985008687907853269984665640564039457584007900000000000');
    })

    it("should transfer 100 000 000 TMS from deployer to user1", async ()=> {
        expect((await token.balanceOf(deployer)).toString()).to.equal('50000000000');
        expect((await token.balanceOf(user1)).toString()).to.equal('0');
        await token.transfer(user1, 100_000_000, { from: deployer});
        expect((await token.balanceOf(deployer)).toString()).to.equal('49900000000');
        expect((await token.balanceOf(user1)).toString()).to.equal('100000000');
    });

    it("should transfer 500 000 TMS from user1 to user2", async ()=> {
        const amountToTranfer = '500000';
        expect((await token.balanceOf(user1)).toString()).to.equal('100000000');
        expect((await token.balanceOf(user2)).toString()).to.equal('0');
        await token.transfer(user2, 500_000, { from: user1});
        expect(await amountAfterFees(token, amountToTranfer)).to.be.bignumber.equal(await token.balanceOf(user2));
        expect((await token.balanceOf(user1)).toString()).to.equal('99500024');
        expect((await token.balanceOf(user2)).toString()).to.equal('460000');
    });

    it("should transfer 500 000 TMS from user2 to user3", async ()=> {
        const amountToTranfer = '100000';

        expect((await token.balanceOf(user2)).toString()).to.equal('460000');
        expect((await token.balanceOf(user3)).toString()).to.equal('0');

        await token.transfer(user3, 100_000, { from: user2});
        expect(await amountAfterFees(token, amountToTranfer)).to.be.bignumber.equal(await token.balanceOf(user3));

        expect((await token.balanceOf(user2)).toString()).to.equal('360000');
        expect((await token.balanceOf(user3)).toString()).to.equal('92000');

    });
    it('test', async() => {
        console.log((await token.test(100000)).toString());
        console.log((await token.test(1000000)).toString());
        console.log((await token.test(10000000)).toString());
    });

    it("should return totalSupply", async() => {
        expect((await token.totalSupply()).toString()).to.equal('99999988000');
    });

    it('should return the total fees', async() => {
        expect((await token.totalFees()).toString()).to.equal('30000');

    });

    it('should return the total burn', async() => {
        expect((await token.totalBurn()).toString()).to.equal('12000');
    });

    it('should return the Liquidity Pool Balance', async() => {
        expect((await token.LpTokenBalance()).toString()).to.equal('0');
    });

    it('Should swap 1 000 000 TMS with deployer', async() => {
        expect(deployerBalance.toString()).to.equal('49900014970')
        await swapEthForToken(uniswapV2Router02, token, deployer, 1000000);
        expect((await token.balanceOf(deployer)).toString()).to.equal('49901014970');
    });

    it('Should swap 2 000 000 TMS with user1', async() => {
        expect(user1Balance.toString()).to.equal('99500029')
        await swapEthForToken(uniswapV2Router02, token, user1, 2000000);
        expect((await token.balanceOf(user1)).toString()).to.equal('101340131');
    });

    it('Should swap 4 000 000 TMS with user2', async() => {
        expect(user2Balance.toString()).to.equal('360000')
        await swapEthForToken(uniswapV2Router02, token, user2, 4000000);
        expect((await token.balanceOf(user2)).toString()).to.equal('4040008');
    });

    it('Should swap 8 000 000 TMS with user3', async() => {
        expect(user3Balance.toString()).to.equal('92000')
        await swapEthForToken(uniswapV2Router02, token, user3, 8000000);
        expect((await token.balanceOf(user3)).toString()).to.equal('7452030');
    });

    it('Should swap 16 000 000 TMS with user4', async() => {
        expect(user4Balance.toString()).to.equal('0')
        await swapEthForToken(uniswapV2Router02, token, user4, 16000000);
        expect((await token.balanceOf(user4)).toString()).to.equal('14720117');
    });

    it('Should swap 32 000 000 TMS with user5', async() => {
        expect(user5Balance.toString()).to.equal('0')
        await swapEthForToken(uniswapV2Router02, token, user5, 32000000);
        expect((await token.balanceOf(user5)).toString()).to.equal('29440471');
    });

    it('Should swap 64 000 000 TMS with user6', async() => {
        expect(user6Balance.toString()).to.equal('0')
        await swapEthForToken(uniswapV2Router02, token, user6, 64000000);
        expect((await token.balanceOf(user6)).toString()).to.equal('58881884');
    });

    it('Should swap 128 000 000 TMS with user7', async() => {
        expect(user7Balance.toString()).to.equal('0')
        await swapEthForToken(uniswapV2Router02, token, user7, 128000000);
        expect((await token.balanceOf(user7)).toString()).to.equal('117767537');
    });

    it('Should swap 256 000 000 TMS with user8', async() => {
        expect(user8Balance.toString()).to.equal('0')
        await swapEthForToken(uniswapV2Router02, token, user8, 256000000);
        expect((await token.balanceOf(user8)).toString()).to.equal('235550153');
    });

    it('Should swap 512 000 000 TMS with user9', async() => {
        expect(user9Balance.toString()).to.equal('0')
        await swapEthForToken(uniswapV2Router02, token, user9, 512000000);
        expect((await token.balanceOf(user9)).toString()).to.equal('471160641');
    });

    it("should return totalSupply", async() => {
        expect((await token.totalSupply()).toString()).to.equal('99979548000');
    });

    it('should return the total fees', async() => {
        expect((await token.totalFees()).toString()).to.equal('51130000');
    });

    it('should return the total fees', async() => {
        expect((await token.TotalBurnedLpTokens()).toString()).to.equal('0');
    });

});