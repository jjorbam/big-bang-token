const { ethers } = require("hardhat");

async function verifyFounders() {
  console.log("🔍 Verificando direcciones de fundadores...");
  
  const founders = {
    creator: {
      name: "Cyberpunk Architect",
      address: "0x95BCeA7C05a85B8de810e00B9c42f5B268029272",
      percentage: 25,
      amount: "5,250,000 BBNG"
    },
    founder1: {
      name: "Couch Otter",
      address: "0x2D99d8BF0E6D2EA939ABF570Fc67DF2E106bAe97",
      percentage: 10,
      amount: "2,100,000 BBNG"
    },
    founder2: {
      name: "Jus",
      address: "0x64FC52F582026d6cF2D30A7f2A9074Ee671585E8",
      percentage: 25,
      amount: "5,250,000 BBNG"
    },
    founder3: {
      name: "PrisonedMoney",
      address: "0x6aa148f6755Aa0CE69814955291DF76C50949e33",
      percentage: 10,
      amount: "2,100,000 BBNG"
    }
  };

  console.log("\n📋 Distribución de fundadores:");
  console.log("==================================");
  
  for (const [key, founder] of Object.entries(founders)) {
    console.log(`\n👤 ${founder.name}:`);
    console.log(`   Dirección: ${founder.address}`);
    console.log(`   Porcentaje: ${founder.percentage}%`);
    console.log(`   Cantidad: ${founder.amount}`);
    
    // Verificar si la dirección es válida
    if (ethers.isAddress(founder.address)) {
      console.log(`   ✅ Dirección válida`);
    } else {
      console.log(`   ❌ Dirección inválida`);
    }
  }

  console.log("\n💰 Venta Pública:");
  console.log(`   Porcentaje: 30%`);
  console.log(`   Cantidad: 6,300,000 BBNG`);
  console.log(`   Destino: Wallet del deployer`);

  console.log("\n⚠️  IMPORTANTE:");
  console.log("   1. Verifica que todas las direcciones sean correctas");
  console.log("   2. Asegúrate de que los fundadores tengan acceso a sus wallets");
  console.log("   3. Los tokens se distribuirán automáticamente al hacer deploy");
  console.log("   4. No se pueden cambiar las direcciones después del deploy");

  return founders;
}

// Función para simular la distribución
async function simulateDistribution() {
  console.log("\n🎯 Simulación de distribución:");
  
  const totalSupply = 21000000;
  const creatorShare = (totalSupply * 25) / 100;
  const founderShare1 = (totalSupply * 10) / 100;
  const founderShare2 = (totalSupply * 25) / 100;
  const founderShare3 = (totalSupply * 10) / 100;
  const publicSaleShare = totalSupply - creatorShare - founderShare1 - founderShare2 - founderShare3;

  console.log(`\n📊 Distribución total: ${totalSupply.toLocaleString()} BBNG`);
  console.log(`   Cyberpunk Architect: ${creatorShare.toLocaleString()} BBNG (25%)`);
  console.log(`   Couch Otter: ${founderShare1.toLocaleString()} BBNG (10%)`);
  console.log(`   Jus: ${founderShare2.toLocaleString()} BBNG (25%)`);
  console.log(`   PrisonedMoney: ${founderShare3.toLocaleString()} BBNG (10%)`);
  console.log(`   Venta Pública: ${publicSaleShare.toLocaleString()} BBNG (30%)`);

  // Verificar que la suma sea correcta
  const total = creatorShare + founderShare1 + founderShare2 + founderShare3 + publicSaleShare;
  console.log(`\n✅ Total verificado: ${total.toLocaleString()} BBNG`);
  
  if (total === totalSupply) {
    console.log("✅ Distribución correcta");
  } else {
    console.log("❌ Error en la distribución");
  }
}

// Ejecutar verificación
verifyFounders()
  .then(() => {
    return simulateDistribution();
  })
  .then(() => {
    console.log("\n🎉 Verificación completada!");
    console.log("📝 Próximos pasos:");
    console.log("   1. Confirmar direcciones con todos los fundadores");
    console.log("   2. Preparar wallets para recibir tokens");
    console.log("   3. Proceder con el deploy en red principal");
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  }); 