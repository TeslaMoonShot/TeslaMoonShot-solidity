const CoinGecko = require('coingecko-api');
const time = require("@openzeppelin/test-helpers/src/time");
const chalk = require("chalk");
const {BN} = require("@openzeppelin/test-helpers");
const CoinGeckoClient = new CoinGecko();

async function getEthPrice() {

    let data = await CoinGeckoClient.exchanges.fetchTickers('bitfinex', {
        coin_ids: ['ethereum']
    });
    let _coinList = {};
    let _datacc = data.data.tickers.filter(t => t.target === 'USD');
    [
        'ETH'
    ].forEach((i) => {
        let _temp = _datacc.filter(t => t.base === i);
        let _res = _temp.length === 0 ? [] : _temp[0];
        _coinList[i] = _res.last;
    })
    return (_coinList.ETH);
}

async function amountAfterFees(token, amount) {
    const amountToTransfer = new BN(amount);
    const amountTaxFee = await token.getTaxFee(amount);
    console.log(chalk.cyanBright('amountTaxFee -> '), chalk.bold.cyanBright(amountTaxFee.toString()));
    const amountBurnFee = await token.getBurnFee(amount);
    console.log(chalk.yellow('amountBurnFee -> '), chalk.bold.yellow(amountBurnFee.toString()));
    const amountLiquidityFee = await token.getLiquidityFee(amount);
    console.log(chalk.magentaBright('amountLiquidityFee -> '), chalk.bold.magentaBright(amountLiquidityFee.toString()));
    return amountToTransfer.sub(amountTaxFee.add(amountBurnFee).add(amountLiquidityFee));
}

async function swapEthForToken(uniswap, token, user, amount) {

    const estimated = (await token.getEstimatedETHforTMS(amount))[0];

    await uniswap.swapExactETHForTokens(
        amount, await token.getPathForETHtoTMS(), user, await time.latest() + time.duration.hours(1), {value: estimated})
}

module.exports = { getEthPrice, swapEthForToken, amountAfterFees };
