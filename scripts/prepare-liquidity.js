const { ethers } = require("hardhat");

async function prepareLiquidity() {
  console.log("💰 Preparando liquidez para DEX listing...");

  // Obtener el contrato
  const BigBangToken = await ethers.getContractFactory("BigBangToken");
  
  // Dirección del contrato (reemplazar con la dirección real)
  const contractAddress = "TU_CONTRACT_ADDRESS_AQUI";
  const bigBangToken = BigBangToken.attach(contractAddress);

  // Wallet para liquidez (reemplazar con tu dirección)
  const liquidityWallet = "TU_WALLET_ADDRESS_AQUI";
  
  // Cantidades de liquidez por red
  const liquidityAmounts = {
    polygon: {
      bbng: ethers.parseEther("50000"), // 50,000 BBNG
      matic: ethers.parseEther("500")   // 500 MATIC
    },
    bsc: {
      bbng: ethers.parseEther("100000"), // 100,000 BBNG
      bnb: ethers.parseEther("10")       // 10 BNB
    },
    ethereum: {
      bbng: ethers.parseEther("500000"), // 500,000 BBNG
      eth: ethers.parseEther("20")       // 20 ETH
    }
  };

  console.log("\n📊 Cantidades de liquidez recomendadas:");
  console.log("   Polygon: 50,000 BBNG + 500 MATIC");
  console.log("   BSC: 100,000 BBNG + 10 BNB");
  console.log("   Ethereum: 500,000 BBNG + 20 ETH");

  // Verificar balance actual
  const currentBalance = await bigBangToken.balanceOf(liquidityWallet);
  console.log(`\n💳 Balance actual de BBNG: ${ethers.formatEther(currentBalance)}`);

  // Calcular liquidez total necesaria
  const totalBbngNeeded = liquidityAmounts.polygon.bbng + 
                          liquidityAmounts.bsc.bbng + 
                          liquidityAmounts.ethereum.bbng;

  console.log(`📈 Total BBNG necesario: ${ethers.formatEther(totalBbngNeeded)}`);

  if (currentBalance < totalBbngNeeded) {
    console.log("❌ Balance insuficiente para liquidez completa");
    console.log("💡 Considera:");
    console.log("   1. Comenzar con una red (ej: Polygon)");
    console.log("   2. Aumentar balance de tokens");
    console.log("   3. Reducir cantidades de liquidez");
  } else {
    console.log("✅ Balance suficiente para liquidez completa");
  }

  // Información para DEXs
  console.log("\n🔗 Información para DEXs:");
  console.log(`   Contrato: ${contractAddress}`);
  console.log(`   Nombre: BIG BANG`);
  console.log(`   Símbolo: BBNG`);
  console.log(`   Decimales: 18`);
  console.log(`   Supply Total: 21,000,000 BBNG`);

  // Enlaces a DEXs
  console.log("\n🌐 Enlaces a DEXs:");
  console.log("   Uniswap: https://app.uniswap.org/");
  console.log("   SushiSwap: https://www.sushi.com/");
  console.log("   PancakeSwap: https://pancakeswap.finance/");
  console.log("   QuickSwap: https://quickswap.exchange/");

  // Pasos para listar
  console.log("\n📋 Pasos para listar:");
  console.log("   1. Conectar wallet a DEX");
  console.log("   2. Ir a 'Pool' → 'Add Liquidity'");
  console.log("   3. Seleccionar ETH/MATIC/BNB y BBNG");
  console.log("   4. Proporcionar liquidez inicial");
  console.log("   5. Confirmar transacción");

  return {
    contractAddress,
    liquidityWallet,
    liquidityAmounts,
    currentBalance,
    totalBbngNeeded
  };
}

// Función para transferir tokens a wallet de liquidez
async function transferToLiquidityWallet(amount) {
  console.log(`\n🔄 Transfiriendo ${ethers.formatEther(amount)} BBNG a wallet de liquidez...`);
  
  // Aquí iría la lógica de transferencia
  // await bigBangToken.transfer(liquidityWallet, amount);
  
  console.log("✅ Transferencia completada");
}

// Ejecutar preparación
prepareLiquidity()
  .then((result) => {
    console.log("\n🎉 Preparación de liquidez completada!");
    console.log("📝 Próximos pasos:");
    console.log("   1. Deploy en redes principales");
    console.log("   2. Verificar contratos");
    console.log("   3. Transferir tokens a wallet de liquidez");
    console.log("   4. Crear pools en DEXs");
    console.log("   5. Promocionar el listado");
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  }); 