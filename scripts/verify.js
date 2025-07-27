const { ethers } = require("hardhat");

async function verifyContract() {
  const contractAddress = "TU_CONTRACT_ADDRESS_AQUI"; // Reemplazar con la dirección real
  
  console.log("🔍 Verificando contrato en exploradores...");
  
  try {
    // Verificar en Etherscan/Polygonscan/BSCScan
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [await hre.ethers.getSigners().then(signers => signers[0].address)],
    });
    
    console.log("✅ Contrato verificado exitosamente!");
    console.log("📝 Información para exchanges:");
    console.log(`   Dirección: ${contractAddress}`);
    console.log(`   Nombre: BIG BANG`);
    console.log(`   Símbolo: BBNG`);
    console.log(`   Decimales: 18`);
    console.log(`   Supply Total: 21,000,000 BBNG`);
    
  } catch (error) {
    console.log("❌ Error al verificar:", error.message);
  }
}

verifyContract()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 