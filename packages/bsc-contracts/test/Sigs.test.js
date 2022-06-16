const Sigs = artifacts.require("Sigs");
contract("Sigs", accounts => {

    var signer;

    beforeEach(async () => {
        signer = accounts[0];
        sigs = await Sigs.new({from: signer});
    });

    it("should recover secret.", async () =>  {
        console.log("SIGNER: ", signer);
        var secret = await sigs.secretHash(10777994);
        console.log("secret: ", secret);
    });

});
