// const { amountAfterFees, swapEthForToken } = require("./utils/utils");
import { time } from '@openzeppelin/test-helpers';
// const { expect } = require('chai');
// const TeslaMoonShot = artifacts.require("TestTeslaMoonShot");
// const IUniswapRouter2 = artifacts.require("IUniswapV2Router02");

import { ethers } from "hardhat";
import { TestTeslaMoonShotFactory } from '../typechain';
import { TestTeslaMoonShot } from '../typechain';
import {BigNumber, Signer} from "ethers";
import {IUniswapV2Router02, IUniswapV2Router02Interface} from "../typechain/IUniswapV2Router02";
import {IUniswapV2FactoryFactory} from "../typechain/IUniswapV2FactoryFactory";
import {IUniswapV2Router02Factory} from "../typechain/IUniswapV2Router02Factory";
import {amountAfterFees, swapEthForToken} from "./utils/utils";
const { expect } = require("chai");


describe('TeslaMoonShot', () => {
    let token: TestTeslaMoonShot;
    let uniswapV2Router02: IUniswapV2Router02;
    let uniswapPair;
    let uniswapRouter2Address: string = '0x7a250d5630b4cf539739df2c5dacb4c659f2488d'
    let taxFee: number;
    let burnFee: number;
    let liquidityFee: number;
    let deployerBalance: BigNumber;
    let user1Balance: BigNumber;
    let user2Balance: BigNumber;
    let user3Balance: BigNumber;
    let user4Balance: BigNumber;
    let user5Balance: BigNumber;
    let user6Balance: BigNumber;
    let user7Balance: BigNumber;
    let user8Balance: BigNumber;
    let user9Balance: BigNumber;
    let deployerAddress: string;
    let user1Address: string;
    let user2Address: string;
    let user3Address: string;
    let user4Address: string;
    let user5Address: string;
    let user6Address: string;
    let user7Address: string;
    let user8Address: string;
    let user9Address: string;
    let contractBalance: BigNumber;
    let accounts: Signer[];
    let deployer: Signer;

    before(async () => {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        deployerAddress = await accounts[0].getAddress();
        user1Address = await accounts[1].getAddress();
        user2Address = await accounts[2].getAddress();
        user3Address = await accounts[3].getAddress();
        user4Address = await accounts[4].getAddress();
        user5Address = await accounts[5].getAddress();
        user6Address = await accounts[6].getAddress();
        user7Address = await accounts[7].getAddress();
        user8Address = await accounts[8].getAddress();
        user9Address = await accounts[9].getAddress();

        const factory = await new TestTeslaMoonShotFactory(deployer);
        token = await factory.deploy('TeslaMoonShot', 'TMS', 0);
        token = await token.deployed();

        const router = IUniswapV2Router02Factory;
        uniswapPair = await token.uniswapV2Pair();
        uniswapV2Router02 = await router.connect(uniswapRouter2Address, deployer);
        console.log(await uniswapV2Router02.WETH(), '<');
        await token.approve(uniswapV2Router02.address, 50_000_000_000);

        console.log(token.address, uniswapV2Router02.address, deployerAddress);
        await uniswapV2Router02.addLiquidityETH(
            token.address,
            50_000_000_000,
            50_000_000_000,
            ethers.utils.parseEther('200'),
            deployerAddress,
            await time.latest() + time.duration.hours(1),
            {value: ethers.utils.parseEther('200')})
console.log('ok');
         taxFee = await token.taxFee();
         burnFee = await token.burnFee();
         liquidityFee = await token.liquidityFee();

    });

    beforeEach(async() => {
        deployerBalance = await token.balanceOf(deployerAddress);
        user1Balance = await token.balanceOf(await accounts[1].getAddress());
        user2Balance = await token.balanceOf(await accounts[2].getAddress());
        user3Balance = await token.balanceOf(await accounts[3].getAddress());
        user4Balance = await token.balanceOf(await accounts[4].getAddress());
        user5Balance = await token.balanceOf(await accounts[5].getAddress());
        user6Balance = await token.balanceOf(await accounts[6].getAddress());
        user7Balance = await token.balanceOf(await accounts[7].getAddress());
        user8Balance = await token.balanceOf(await accounts[8].getAddress());
        user9Balance = await token.balanceOf(await accounts[9].getAddress());
        contractBalance = await token.balanceOf(token.address);
        console.log(contractBalance.toString());

    });

    it("should return tax fee", async() => {
        expect(taxFee).to.equal(5);
    });

    it("should return burn fee", async() => {
        expect(burnFee).to.equal(2);
    });

    it("should return liquidity fee", async() => {
        expect(liquidityFee).to.equal(1);
    });

    it("should return the rTotal", async() => {
        expect(await token.getRTotal()).to.equal('115792089237316195423570985008687907853269984665640564039457584007900000000000');
    });

    it("should transfer 100 000 000 TMS from deployer to user1", async ()=> {
        expect((await token.balanceOf(deployerAddress)).toString()).to.equal('50000000000');
        expect((await token.balanceOf(user1Address)).toString()).to.equal('0');

        await token.connect(accounts[0]).transfer(user1Address, 100_000_000);
        expect((await token.balanceOf(deployerAddress)).toString()).to.equal('49900000000');
        expect((await token.balanceOf(user1Address)).toString()).to.equal('100000000');
    });

    it("should transfer 500 000 TMS from user1 to user2", async ()=> {
        const amountToTransfer = BigNumber.from('500000');
        expect(await token.balanceOf(user1Address)).to.equal('100000000');
        expect(await token.balanceOf(user2Address)).to.equal('0');
        await token.connect(accounts[1]).transfer(user2Address, 500_000);
        expect(await amountAfterFees(token, amountToTransfer)).to.equal(await token.balanceOf(user2Address));
        expect(await token.balanceOf(user1Address)).to.equal('99500024');
        expect(await token.balanceOf(user2Address)).to.equal('460000');
    });

    it("should transfer 500 000 TMS from user2 to user3", async ()=> {
        const amountToTransfer = BigNumber.from('100000');

        expect(await token.balanceOf(user2Address)).to.equal('460000');
        expect(await token.balanceOf(user3Address)).to.equal('0');

        await token.connect(accounts[2]).transfer(user3Address, 100_000);
        expect(await amountAfterFees(token, amountToTransfer)).to.equal(await token.balanceOf(user3Address));

        expect(await token.balanceOf(user2Address)).to.equal('360000');
        expect(await token.balanceOf(user3Address)).to.equal('92000');

    });

    it("should return totalSupply", async() => {
        expect(await token.totalSupply()).to.equal('99999988000');
    });

    it('should return the total fees', async() => {
        expect(await token.totalFees()).to.equal('30000');

    });

    it('should return the total burn', async() => {
        expect(await token.totalBurn()).to.equal('12000');
    });

    it('should return the Liquidity Pool Balance', async() => {
        expect(await token.LpTokenBalance()).to.equal('0');
    });

    it('Should swap 1 000 000 TMS with deployer', async() => {
        expect(deployerBalance).to.equal('49900014970');
        await swapEthForToken(uniswapV2Router02, token, deployer, BigNumber.from('1000000'));
        expect(await token.balanceOf(deployerAddress)).to.equal('49901014970');
    });

    it('Should swap 2 000 000 TMS with user1', async() => {
        expect(user1Balance).to.equal('99500029')
        await swapEthForToken(uniswapV2Router02, token, accounts[1], BigNumber.from('2000000'));
        expect(await token.balanceOf(user1Address)).to.equal('101340131');
    });

    it('Should swap 4 000 000 TMS with user2', async() => {
        expect(user2Balance).to.equal('360000')
        await swapEthForToken(uniswapV2Router02, token, accounts[2], BigNumber.from('4000000'));
        expect(await token.balanceOf(user2Address)).to.equal('4040008');
    });

    it('Should swap 8 000 000 TMS with user3', async() => {
        expect(user3Balance).to.equal('92000')
        await swapEthForToken(uniswapV2Router02, token, accounts[3], BigNumber.from('8000000'));
        expect(await token.balanceOf(user3Address)).to.equal('7452030');
    });

    it('Should swap 16 000 000 TMS with user4', async() => {
        expect(user4Balance).to.equal('0')
        await swapEthForToken(uniswapV2Router02, token, accounts[4], BigNumber.from('16000000'));
        expect(await token.balanceOf(user4Address)).to.equal('14720117');
    });

    it('Should swap 32 000 000 TMS with user5', async() => {
        expect(user5Balance).to.equal('0')
        await swapEthForToken(uniswapV2Router02, token, accounts[5], BigNumber.from('32000000'));
        expect(await token.balanceOf(user5Address)).to.equal('29440471');
    });

    it('Should swap 64 000 000 TMS with user6', async() => {
        expect(user6Balance).to.equal('0')
        await swapEthForToken(uniswapV2Router02, token, accounts[6], BigNumber.from('64000000'));
        expect(await token.balanceOf(user6Address)).to.equal('58881884');
    });

    it('Should swap 128 000 000 TMS with user7', async() => {
        expect(user7Balance).to.equal('0')
        await swapEthForToken(uniswapV2Router02, token, accounts[7], BigNumber.from('128000000'));
        expect(await token.balanceOf(user7Address)).to.equal('117767537');
    });

    it('Should swap 256 000 000 TMS with user8', async() => {
        expect(user8Balance).to.equal('0')
        await swapEthForToken(uniswapV2Router02, token, accounts[8], BigNumber.from('256000000'));
        expect(await token.balanceOf(user8Address)).to.equal('235550153');
    });

    it('Should swap 512 000 000 TMS with user9', async() => {
        expect(user9Balance).to.equal('0')
        await swapEthForToken(uniswapV2Router02, token, accounts[9], BigNumber.from('512000000'));
        expect(await token.balanceOf(user9Address)).to.equal('471160641');
    });

    it("should return totalSupply", async() => {
        expect(await token.totalSupply()).to.equal('99979548000');
    });

    it('should return the total fees', async() => {
        expect(await token.totalFees()).to.equal('51130000');
    });

    it('should return the total fees', async() => {
        expect(await token.TotalBurnedLpTokens()).to.equal('0');
    });

});