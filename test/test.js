const TeslaMoonShot = artifacts.require("TeslaMoonShot");

contract('TeslaMoonShot', ([deployer]) => {

    let token;
    before(async() => {
        token = await TeslaMoonShot.new('TeslaMoonShot', 'TMS', 0);
    })

    it("should return the name", async ()=> {
        const name = await token.name();

        assert.equal(name, 'TeslaMoonShot');
    });

    it("should return the symbol", async ()=> {
        const symbol = await token.symbol();

        assert.equal(symbol, 'TMS');
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

});