const TeslaMoonShot = artifacts.require('TeslaMoonShot');
module.exports = function (deployer) {
    deployer.deploy(TeslaMoonShot, 'TeslaMoonShot', 'TMS', 0);
};