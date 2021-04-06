const { accounts } = require('@openzeppelin/test-environment');
const { BN } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const TeslaMoonShot = artifacts.require("TeslaMoonShot");

contract('TeslaMoonShot', ([deployer]) => {

    let token;
    before(async() => {
        token = await TeslaMoonShot.deployed();
    })

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
        console.log(await token.uniswapV2Router());
    });


    it('should return the address of the uniswap PAIR', async() => {
        console.log(await token.uniswapV2Pair());
    })
});