const Funder= artifacts.require("Funder.sol");

module.exports=function (deployer){
    deployer.deploy(Funder);
}