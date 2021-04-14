import { ethers } from "hardhat";
import { TestTeslaMoonShotFactory } from '../typechain/TestTeslaMoonShotFactory';
import { TestTeslaMoonShot } from '../typechain';
import {Signer} from "ethers";
const { expect } = require("chai");

describe('TeslaMoonShot', () => {

    let token: TestTeslaMoonShot;
    let accounts;
    let deployer: Signer;
    before(async() => {
        accounts = await ethers.getSigners();
        deployer = accounts[0];

        const factory = await new TestTeslaMoonShotFactory(deployer);

        token = await factory.deploy('TeslaMoonShot', 'TMS', 0);
        // The address the Contract WILL have once mined
        console.log(token.address);
        // The transaction that was sent to the network to deploy the Contract
        console.log(token.deployTransaction.hash);
        // The contract is NOT deployed yet; we must wait until it is mined
        await token.deployed();
    });

    it("should return the name", async ()=> {
        const name = await token.name();
        expect(name).to.equal("TeslaMoonShot");
    });

    it("should return the symbol", async ()=> {
        const symbol = await token.symbol();

        expect(symbol).to.equal('TMS');
    });

    it("should return the decimals", async ()=> {
        const decimals = await token.decimals();

        expect(decimals).to.eq(0);

    });

    it("should return the totalSupply", async ()=> {
        const totalSupply = await token.totalSupply();

        expect(totalSupply).to.eq('100000000000');
    });

    it("should return the balance of the deployer", async ()=> {
        const balanceOf = await token.balanceOf(await deployer.getAddress());

        expect(balanceOf).to.eq('100000000000');

    });

    it('should return the address of uniswap Router', async() => {
        const uniswapRouter = await token.uniswapV2Router();
    });

    it('should return the address of the uniswap PAIR', async() => {
        const uniswapV2Pair = await token.uniswapV2Pair();
        // expect(web3.utils.isAddress(uniswapV2Pair)).to.be.true;
        // expect((web3.eth.getCode(uniswapV2Pair)).toString().length).to.be.at.least(5);
    });

    it('should return the total fees', async() => {
        console.log((await token.totalFees()).toString())
    })

    it('should return the total burn', async() => {
        console.log((await token.totalBurn()).toString())
    });

    it('should return the Liquidity Pool Balance', async() => {
        console.log((await token.LpTokenBalance()).toString())
    });

    it('should return if the address is excluded from rewards', async() => {
        console.log(await token.isExcludedFromReward(await deployer.getAddress()));
    });

    it('should return if the address is excluded from fee', async() => {
        console.log(await token.isExcludedFromFee(await deployer.getAddress()));
    });

    it('should return the tax fee', async() => {
        console.log((await token.getTaxFee('100000')));
    });

    it('should return the burn fee', async() => {
        console.log((await token.getBurnFee('100000')));
    });

    it('should return the liquidity fee', async() => {
        console.log((await token.getLiquidityFee('100000')));
    });

    it('should return the rate', async() => {
        console.log((await token.getRate()).toString());
    });

    it('should return the reflectionFromToken with transferFee', async() => {
        console.log((await token.reflectionFromToken('100000', false)).toString());
    });

    it('should return the reflectionFromToken without transferFee', async() => {
        console.log((await token.reflectionFromToken('100000', false)).toString());
    });

    it('should return the tokenFromReflection', async() => {
        console.log((await token.tokenFromReflection('100000')));
    });

    it('should return the current Supply', async() => {
        console.log((await token.getCurrentSupply()).toString());
    });

    it('should return the Values', async() => {
        console.log((await token.getValues(1000)).toString());
    });

    it('should return the TValues', async() => {
        console.log((await token.getTValues(1000)).toString());
    });





});