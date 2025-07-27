const { ethers } = require("hardhat");

async function checkDeployReady() {
  console.log("🔍 Verificando configuración para deploy...");
  
  // Verificar variables de entorno
  console.log("\n📋 Variables de entorno:");
  
  const sepoliaRpc = process.env.SEPOLIA_RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;
  const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
  
  console.log(`   SEPOLIA_RPC_URL: ${sepoliaRpc ? "✅ Configurado" : "❌ No configurado"}`);
  console.log(`   PRIVATE_KEY: ${privateKey ? "✅ Configurado" : "❌ No configurado"}`);
  console.log(`   ETHERSCAN_API_KEY: ${etherscanApiKey ? "✅ Configurado" : "❌ No configurado"}`);
  
  if (!sepoliaRpc || !privateKey || !etherscanApiKey) {
    console.log("\n❌ Configuración incompleta!");
    console.log("📝 Por favor configura las variables de entorno en el archivo .env");
    console.log("📖 Consulta docs/sepolia-setup.md para más información");
    return false;
  }
  
  // Verificar conexión a Sepolia
  console.log("\n🌐 Verificando conexión a Sepolia...");
  try {
    const provider = new ethers.providers.JsonRpcProvider(sepoliaRpc);
    const network = await provider.getNetwork();
    console.log(`   Chain ID: ${network.chainId}`);
    console.log(`   Nombre: ${network.name}`);
    
    if (network.chainId !== 11155111) {
      console.log("❌ Chain ID incorrecto para Sepolia!");
      return false;
    }
    
    console.log("✅ Conexión a Sepolia exitosa");
  } catch (error) {
    console.log("❌ Error conectando a Sepolia:", error.message);
    return false;
  }
  
  // Verificar wallet
  console.log("\n💳 Verificando wallet...");
  try {
    const wallet = new ethers.Wallet(privateKey);
    console.log(`   Dirección: ${wallet.address}`);
    
    // Verificar balance
    const provider = new ethers.providers.JsonRpcProvider(sepoliaRpc);
    const balance = await provider.getBalance(wallet.address);
    const balanceEth = ethers.utils.formatEther(balance);
    
    console.log(`   Balance: ${balanceEth} ETH`);
    
    if (parseFloat(balanceEth) < 0.01) {
      console.log("⚠️  Balance bajo! Necesitas al menos 0.01 ETH para el deploy");
      console.log("💰 Obtén ETH gratis en: https://sepoliafaucet.com/");
      return false;
    }
    
    console.log("✅ Wallet configurada correctamente");
  } catch (error) {
    console.log("❌ Error con la wallet:", error.message);
    return false;
  }
  
  // Verificar contrato
  console.log("\n📄 Verificando contrato...");
  try {
    const BigBangToken = await ethers.getContractFactory("BigBangToken");
    console.log("✅ Contrato compilado correctamente");
    
    // Verificar constructor
    const deployer = new ethers.Wallet(privateKey);
    const estimatedGas = await BigBangToken.connect(deployer).estimateGas(deployer.address);
    console.log(`   Gas estimado: ${estimatedGas.toString()}`);
    
  } catch (error) {
    console.log("❌ Error con el contrato:", error.message);
    return false;
  }
  
  // Verificar fundadores
  console.log("\n👥 Verificando fundadores...");
  const founders = [
    { name: "Cyberpunk Architect", address: "0x95BCeA7C05a85B8de810e00B9c42f5B268029272" },
    { name: "Couch Otter", address: "0x2D99d8BF0E6D2EA939ABF570Fc67DF2E106bAe97" },
    { name: "Jus", address: "0x64FC52F582026d6cF2D30A7f2A9074Ee671585E8" },
    { name: "PrisonedMoney", address: "0x6aa148f6755Aa0CE69814955291DF76C50949e33" }
  ];
  
  for (const founder of founders) {
    if (ethers.utils.isAddress(founder.address)) {
      console.log(`   ✅ ${founder.name}: ${founder.address}`);
    } else {
      console.log(`   ❌ ${founder.name}: Dirección inválida`);
      return false;
    }
  }
  
  console.log("\n🎉 ¡Todo listo para el deploy!");
  console.log("\n📝 Próximos pasos:");
  console.log("   1. Ejecutar: npx hardhat run scripts/deploy.js --network sepolia");
  console.log("   2. Verificar el contrato en Etherscan");
  console.log("   3. Actualizar frontend/config.js con la nueva dirección");
  
  return true;
}

// Ejecutar verificación
checkDeployReady()
  .then((ready) => {
    if (ready) {
      console.log("\n✅ Sistema listo para deploy en Sepolia");
    } else {
      console.log("\n❌ Sistema no listo. Por favor corrige los errores");
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("❌ Error durante la verificación:", error);
    process.exit(1);
  }); 