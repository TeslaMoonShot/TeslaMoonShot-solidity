import { time, BN } from '@openzeppelin/test-helpers';
import chalk from 'chalk';
import {BigNumber, Contract, Signer} from "ethers";

export async function amountAfterFees(token: Contract, amount: BigNumber) {
    const amountToTransfer: BigNumber = amount;
    const amountTaxFee: BigNumber = await token.getTaxFee(amount);
    console.log(chalk.cyanBright('amountTaxFee -> '), chalk.bold.cyanBright(amountTaxFee.toString()));
    const amountBurnFee: BigNumber = await token.getBurnFee(amount);
    console.log(chalk.yellow('amountBurnFee -> '), chalk.bold.yellow(amountBurnFee.toString()));
    const amountLiquidityFee: BigNumber = await token.getLiquidityFee(amount);
    console.log(chalk.magentaBright('amountLiquidityFee -> '), chalk.bold.magentaBright(amountLiquidityFee.toString()));
    return amountToTransfer.sub(amountTaxFee.add(amountBurnFee).add(amountLiquidityFee));
}

export async function swapEthForToken(uniswap: Contract, token: Contract, user: Signer, amount: BigNumber) {

    const estimated = (await token.getEstimatedETHforTMS(amount))[0];
    const userAddress = await user.getAddress();
    await uniswap.connect(user).swapExactETHForTokens(
        amount, await token.getPathForETHtoTMS(), userAddress, await time.latest() + time.duration.hours(1), {
            value: estimated
        });
}

// module.exports = {  amountAfterFees };
