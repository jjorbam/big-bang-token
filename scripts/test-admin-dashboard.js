const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Probando dashboard de administración...");

  // Dirección del contrato desplegado
  const contractAddress = "0x61CA5da746eE0D850d173F3b0116E464dd6D334e";
  
  // Obtener el contrato
  const BigBangToken = await ethers.getContractFactory("BigBangToken");
  const bigBangToken = BigBangToken.attach(contractAddress);

  // Obtener cuenta principal (owner)
  const [owner] = await ethers.getSigners();

  console.log("📋 Owner address:", owner.address);

  try {
    // 1. Verificar que es el owner
    console.log("\n🔍 Verificando ownership...");
    const contractOwner = await bigBangToken.owner();
    console.log("   Contract owner:", contractOwner);
    console.log("   Current signer:", owner.address);
    console.log("   Is owner:", contractOwner.toLowerCase() === owner.address.toLowerCase());

    // 2. Probar funciones de emergencia
    console.log("\n🚨 Probando funciones de emergencia...");
    
    // Emergency pause
    console.log("   Ejecutando emergency pause...");
    await bigBangToken.emergencyPause();
    console.log("   ✅ Emergency pause ejecutado");
    
    // Verificar estado
    const isPaused = await bigBangToken.paused();
    console.log("   Contrato pausado:", isPaused);
    
    // Emergency unpause
    console.log("   Ejecutando emergency unpause...");
    await bigBangToken.emergencyUnpause();
    console.log("   ✅ Emergency unpause ejecutado");
    
    // Verificar estado
    const isPausedAfter = await bigBangToken.paused();
    console.log("   Contrato pausado después:", isPausedAfter);

    // 3. Probar pausado granular
    console.log("\n⏸️ Probando pausado granular...");
    
    // Pausar staking
    await bigBangToken.setStakingPaused(true);
    console.log("   ✅ Staking pausado");
    
    const stakingPaused = await bigBangToken.stakingPaused();
    console.log("   Staking pausado:", stakingPaused);
    
    // Reanudar staking
    await bigBangToken.setStakingPaused(false);
    console.log("   ✅ Staking reanudado");

    // 4. Probar configuración de límites
    console.log("\n⚙️ Probando configuración de límites...");
    
    const currentMaxStake = await bigBangToken.maxStakeAmount();
    console.log("   Max stake actual:", ethers.formatEther(currentMaxStake), "BBNG");
    
    // Actualizar límite
    const newMaxStake = ethers.parseEther("500000");
    await bigBangToken.setMaxStakeAmount(newMaxStake);
    console.log("   ✅ Nuevo límite establecido:", ethers.formatEther(newMaxStake), "BBNG");
    
    // Verificar cambio
    const updatedMaxStake = await bigBangToken.maxStakeAmount();
    console.log("   Max stake actualizado:", ethers.formatEther(updatedMaxStake), "BBNG");

    // 5. Probar configuración de tasas
    console.log("\n📊 Probando configuración de tasas...");
    
    // Obtener tasa actual para 30 días
    const currentRate30 = await bigBangToken.rewardRates(30);
    console.log("   Tasa actual 30 días:", currentRate30.toString(), "basis points");
    
    // Actualizar tasa
    const newRate30 = 750; // 7.5%
    await bigBangToken.updateRewardRate(30, newRate30);
    console.log("   ✅ Nueva tasa 30 días:", newRate30, "basis points");
    
    // Verificar cambio
    const updatedRate30 = await bigBangToken.rewardRates(30);
    console.log("   Tasa actualizada 30 días:", updatedRate30.toString(), "basis points");

    // 6. Probar añadir nuevo período
    console.log("\n➕ Probando añadir nuevo período...");
    
    const newPeriod = 60; // 60 días
    const newRate = 800; // 8%
    
    await bigBangToken.addStakingPeriod(newPeriod, newRate);
    console.log("   ✅ Nuevo período añadido:", newPeriod, "días con", newRate, "basis points");
    
    // Verificar nuevo período
    const addedRate = await bigBangToken.rewardRates(newPeriod);
    console.log("   Tasa del nuevo período:", addedRate.toString(), "basis points");

    // 7. Probar retiro de emergencia
    console.log("\n💰 Probando retiro de emergencia...");
    
    const balance = await bigBangToken.balanceOf(contractAddress);
    console.log("   Balance del contrato:", ethers.formatEther(balance), "BBNG");
    
    if (balance > 0) {
      const withdrawAmount = ethers.parseEther("100"); // 100 BBNG
      await bigBangToken.emergencyWithdraw(withdrawAmount);
      console.log("   ✅ Retiro de emergencia ejecutado:", ethers.formatEther(withdrawAmount), "BBNG");
    } else {
      console.log("   ⚠️ No hay fondos para retirar");
    }

    console.log("\n🎉 ¡Todas las pruebas del dashboard de administración exitosas!");
    console.log("✅ Funciones de emergencia funcionando");
    console.log("✅ Configuración de límites operativa");
    console.log("✅ Gestión de tasas activa");
    console.log("✅ Retiro de emergencia disponible");

  } catch (error) {
    console.error("❌ Error durante las pruebas:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  }); 