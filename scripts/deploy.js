const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Iniciando deployment del contrato BigBangToken...");

  // Obtener la cuenta del deployer
  const [deployer] = await ethers.getSigners();
  console.log("📋 Cuenta del deployer:", deployer.address);
  console.log("💰 Balance del deployer:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

  // Obtener el contrato factory
  const BigBangToken = await ethers.getContractFactory("BigBangToken");
  console.log("📦 Contrato compilado correctamente");

  // Deploy del contrato
  console.log("🔨 Deployando contrato...");
  const bigBangToken = await BigBangToken.deploy(deployer.address);
  
  // Esperar a que se confirme el deployment
  await bigBangToken.waitForDeployment();
  const contractAddress = await bigBangToken.getAddress();
  
  console.log("✅ Contrato BigBangToken deployado en:", contractAddress);

  // Verificar información del contrato
  console.log("\n📊 Información del contrato:");
  console.log("   Nombre:", await bigBangToken.name());
  console.log("   Símbolo:", await bigBangToken.symbol());
      console.log("   Supply Máximo:", ethers.formatEther(await bigBangToken.getMaxSupply()), "BBNG");
    console.log("   Supply Total:", ethers.formatEther(await bigBangToken.totalSupply()), "BBNG");
  console.log("   Owner:", await bigBangToken.owner());

  // Verificar distribución inicial
  console.log("\n🎯 Distribución inicial de tokens:");
  
  const creatorAddress = "0x95BCeA7C05a85B8de810e00B9c42f5B268029272";
  const founder1Address = "0x2D99d8BF0E6D2EA939ABF570Fc67DF2E106bAe97";
  const founder2Address = "0x64FC52F582026d6cF2D30A7f2A9074Ee671585E8";
  const founder3Address = "0x6aa148f6755Aa0CE69814955291DF76C50949e33";

      console.log("   Cyberpunk Architect:", ethers.formatEther(await bigBangToken.balanceOf(creatorAddress)), "BBNG");
    console.log("   Couch Otter:", ethers.formatEther(await bigBangToken.balanceOf(founder1Address)), "BBNG");
    console.log("   Jus:", ethers.formatEther(await bigBangToken.balanceOf(founder2Address)), "BBNG");
    console.log("   PrisonedMoney:", ethers.formatEther(await bigBangToken.balanceOf(founder3Address)), "BBNG");
    console.log("   Deployer (Venta Pública):", ethers.formatEther(await bigBangToken.balanceOf(deployer.address)), "BBNG");

  // Verificar tasas de recompensa
  console.log("\n💰 Tasas de recompensa configuradas:");
          console.log("   30 días:", Number(await bigBangToken.rewardRates(30)) / 100, "% APY");
        console.log("   90 días:", Number(await bigBangToken.rewardRates(90)) / 100, "% APY");
        console.log("   180 días:", Number(await bigBangToken.rewardRates(180)) / 100, "% APY");
        console.log("   365 días:", Number(await bigBangToken.rewardRates(365)) / 100, "% APY");

      // Verificar períodos de staking
    console.log("\n📅 Períodos de staking disponibles:");
    console.log("   30 días");
    console.log("   90 días");
    console.log("   180 días");
    console.log("   365 días");

  console.log("\n🎉 Deployment completado exitosamente!");
  console.log("📝 Dirección del contrato para verificación:", contractAddress);
  
  // Exportar la dirección del contrato para uso en el frontend
  const fs = require('fs');
  const contractInfo = {
    address: contractAddress,
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync('./contract-address.json', JSON.stringify(contractInfo, null, 2));
  console.log("💾 Información del contrato guardada en contract-address.json");

  return contractAddress;
}

// Función para verificar el contrato en Etherscan
async function verifyContract(contractAddress) {
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("🔍 Verificando contrato en Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [await hre.ethers.getSigners().then(signers => signers[0].address)],
      });
      console.log("✅ Contrato verificado exitosamente en Etherscan");
    } catch (error) {
      console.log("❌ Error al verificar el contrato:", error.message);
    }
  }
}

// Ejecutar el deployment
main()
  .then(async (contractAddress) => {
    // Verificar el contrato si no estamos en hardhat/localhost
    await verifyContract(contractAddress);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error durante el deployment:", error);
    process.exit(1);
  }); 