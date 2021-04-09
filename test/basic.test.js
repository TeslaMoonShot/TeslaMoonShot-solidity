const { accounts } = require('@openzeppelin/test-environment');
const { BN } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const TeslaMoonShot = artifacts.require("TestTeslaMoonShot");

contract('TeslaMoonShot', ([deployer]) => {

    let token;
    before(async() => {
        token = await TeslaMoonShot.deployed();
    });

    it("should return the name", async ()=> {
        const name = await token.name();

        expect(name).to.equal('TeslaMoonShot');
    });

    it("should return the symbol", async ()=> {
        const symbol = await token.symbol();

        expect(symbol).to.equal('TMS');
    });

    it("should return the decimals", async ()=> {
        const decimals = await token.decimals();

        assert.equal(decimals.toString(), '0');
    });

    it("should return the totalSupply", async ()=> {
        const totalSupply = await token.totalSupply();

        assert.equal(totalSupply.toString(), '100000000000');
    });

    it("should return the balance of the deployer", async ()=> {
        const balanceOf = await token.balanceOf(deployer);

        assert.equal(balanceOf.toString(), '100000000000');
    });

    it('should return the address of uniswap Router', async() => {
        const uniswapRouter = await token.uniswapV2Router();
        expect(web3.utils.isAddress(uniswapRouter)).to.be.true;
        expect((web3.eth.getCode(uniswapRouter)).toString().length).to.be.at.least(5);
    });

    it('should return the address of the uniswap PAIR', async() => {
        const uniswapV2Pair = await token.uniswapV2Pair();
        expect(web3.utils.isAddress(uniswapV2Pair)).to.be.true;
        expect((web3.eth.getCode(uniswapV2Pair)).toString().length).to.be.at.least(5);
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
        console.log(await token.isExcludedFromReward(deployer));
    });

    it('should return if the address is excluded from fee', async() => {
        console.log(await token.isExcludedFromFee(deployer));
    });

    it('should return the tax fee', async() => {
        console.log((await token.getTaxFee(new BN('100000'))).toString());
    });

    it('should return the burn fee', async() => {
        console.log((await token.getBurnFee(new BN('100000'))).toString());
    });

    it('should return the liquidity fee', async() => {
        console.log((await token.getLiquidityFee(new BN('100000'))).toString());
    });

    it('should return the rate', async() => {
        console.log((await token.getRate()).toString());
    });

    it('should return the reflectionFromToken with transferFee', async() => {
        console.log((await token.reflectionFromToken(new BN('100000'), true)).toString());
    });

    it('should return the reflectionFromToken without transferFee', async() => {
        console.log((await token.reflectionFromToken(new BN('100000'), false)).toString());
    });

    it('should return the tokenFromReflection', async() => {
        console.log((await token.tokenFromReflection(new BN('100000'))).toString());
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