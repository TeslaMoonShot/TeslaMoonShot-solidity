const TeslaMoonShot = artifacts.require('TestTeslaMoonShot');
module.exports = function (deployer) {
    deployer.deploy(TeslaMoonShot, 'TeslaMoonShot', 'TMS', 0);
};