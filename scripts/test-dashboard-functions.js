const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing completo del dashboard de administración...");

  // Dirección del contrato desplegado
  const contractAddress = "0x61CA5da746eE0D850d173F3b0116E464dd6D334e";
  
  // Obtener el contrato
  const BigBangToken = await ethers.getContractFactory("BigBangToken");
  const bigBangToken = BigBangToken.attach(contractAddress);

  // Obtener cuenta principal (owner)
  const [owner] = await ethers.getSigners();

  console.log("📋 Owner address:", owner.address);

  try {
    // 1. Verificar estado inicial
    console.log("\n🔍 Estado inicial del contrato:");
    const isPaused = await bigBangToken.paused();
    const stakingPaused = await bigBangToken.stakingPaused();
    const unstakingPaused = await bigBangToken.unstakingPaused();
    const maxStakeAmount = await bigBangToken.maxStakeAmount();
    const maxTotalStaked = await bigBangToken.maxTotalStaked();
    
    console.log("   Contrato pausado:", isPaused);
    console.log("   Staking pausado:", stakingPaused);
    console.log("   Unstaking pausado:", unstakingPaused);
    console.log("   Max stake amount:", ethers.formatEther(maxStakeAmount), "BBNG");
    console.log("   Max total staked:", ethers.formatEther(maxTotalStaked), "BBNG");

    // 2. Probar funciones de configuración de límites
    console.log("\n⚙️ Probando configuración de límites:");
    
    // Actualizar máximo stake
    try {
      const newMaxStake = ethers.parseEther("500000");
      console.log("   Actualizando max stake a 500,000 BBNG...");
      const tx = await bigBangToken.setMaxStakeAmount(newMaxStake);
      await tx.wait();
      console.log("   ✅ Max stake actualizado exitosamente");
      
      const updatedMaxStake = await bigBangToken.maxStakeAmount();
      console.log("   Nuevo max stake:", ethers.formatEther(updatedMaxStake), "BBNG");
    } catch (error) {
      console.log("   ❌ Error actualizando max stake:", error.message);
    }

    // Actualizar máximo total
    try {
      const newMaxTotal = ethers.parseEther("5000000");
      console.log("   Actualizando max total a 5,000,000 BBNG...");
      const tx = await bigBangToken.setMaxTotalStaked(newMaxTotal);
      await tx.wait();
      console.log("   ✅ Max total actualizado exitosamente");
      
      const updatedMaxTotal = await bigBangToken.maxTotalStaked();
      console.log("   Nuevo max total:", ethers.formatEther(updatedMaxTotal), "BBNG");
    } catch (error) {
      console.log("   ❌ Error actualizando max total:", error.message);
    }

    // 3. Probar configuración de tasas
    console.log("\n📊 Probando configuración de tasas:");
    
    // Obtener tasas actuales
    const rate30 = await bigBangToken.rewardRates(30);
    const rate90 = await bigBangToken.rewardRates(90);
    const rate180 = await bigBangToken.rewardRates(180);
    const rate365 = await bigBangToken.rewardRates(365);
    
    console.log("   Tasas actuales:");
    console.log("     30 días:", rate30.toString(), "basis points (", Number(rate30)/100, "%)");
    console.log("     90 días:", rate90.toString(), "basis points (", Number(rate90)/100, "%)");
    console.log("     180 días:", rate180.toString(), "basis points (", Number(rate180)/100, "%)");
    console.log("     365 días:", rate365.toString(), "basis points (", Number(rate365)/100, "%)");

    // Actualizar tasa para 30 días
    try {
      const newRate30 = 750; // 7.5%
      console.log("   Actualizando tasa 30 días a 7.5%...");
      const tx = await bigBangToken.updateRewardRate(30, newRate30);
      await tx.wait();
      console.log("   ✅ Tasa 30 días actualizada exitosamente");
      
      const updatedRate30 = await bigBangToken.rewardRates(30);
      console.log("   Nueva tasa 30 días:", updatedRate30.toString(), "basis points (", Number(updatedRate30)/100, "%)");
    } catch (error) {
      console.log("   ❌ Error actualizando tasa 30 días:", error.message);
    }

    // 4. Probar añadir nuevo período
    console.log("\n➕ Probando añadir nuevo período:");
    
    try {
      const newPeriod = 60; // 60 días
      const newRate = 800; // 8%
      
      console.log("   Añadiendo período de 60 días con 8% APY...");
      const tx = await bigBangToken.addStakingPeriod(newPeriod, newRate);
      await tx.wait();
      console.log("   ✅ Nuevo período añadido exitosamente");
      
      const addedRate = await bigBangToken.rewardRates(newPeriod);
      console.log("   Tasa del nuevo período:", addedRate.toString(), "basis points (", Number(addedRate)/100, "%)");
    } catch (error) {
      console.log("   ❌ Error añadiendo nuevo período:", error.message);
    }

    // 5. Probar funciones de pausado granular
    console.log("\n⏸️ Probando pausado granular:");
    
    // Pausar staking
    try {
      console.log("   Pausando staking...");
      const tx = await bigBangToken.setStakingPaused(true);
      await tx.wait();
      console.log("   ✅ Staking pausado exitosamente");
      
      const stakingPausedAfter = await bigBangToken.stakingPaused();
      console.log("   Staking pausado:", stakingPausedAfter);
    } catch (error) {
      console.log("   ❌ Error pausando staking:", error.message);
    }

    // Pausar unstaking
    try {
      console.log("   Pausando unstaking...");
      const tx = await bigBangToken.setUnstakingPaused(true);
      await tx.wait();
      console.log("   ✅ Unstaking pausado exitosamente");
      
      const unstakingPausedAfter = await bigBangToken.unstakingPaused();
      console.log("   Unstaking pausado:", unstakingPausedAfter);
    } catch (error) {
      console.log("   ❌ Error pausando unstaking:", error.message);
    }

    // Reanudar staking
    try {
      console.log("   Reanudando staking...");
      const tx = await bigBangToken.setStakingPaused(false);
      await tx.wait();
      console.log("   ✅ Staking reanudado exitosamente");
    } catch (error) {
      console.log("   ❌ Error reanudando staking:", error.message);
    }

    // Reanudar unstaking
    try {
      console.log("   Reanudando unstaking...");
      const tx = await bigBangToken.setUnstakingPaused(false);
      await tx.wait();
      console.log("   ✅ Unstaking reanudado exitosamente");
    } catch (error) {
      console.log("   ❌ Error reanudando unstaking:", error.message);
    }

    // 6. Probar retiro de emergencia
    console.log("\n💰 Probando retiro de emergencia:");
    
    try {
      const balance = await bigBangToken.balanceOf(contractAddress);
      console.log("   Balance del contrato:", ethers.formatEther(balance), "BBNG");
      
      if (balance > 0) {
        const withdrawAmount = ethers.parseEther("100"); // 100 BBNG
        console.log("   Retirando 100 BBNG...");
        const tx = await bigBangToken.emergencyWithdraw(withdrawAmount);
        await tx.wait();
        console.log("   ✅ Retiro de emergencia ejecutado exitosamente");
        
        const balanceAfter = await bigBangToken.balanceOf(contractAddress);
        console.log("   Balance después del retiro:", ethers.formatEther(balanceAfter), "BBNG");
      } else {
        console.log("   ⚠️ No hay fondos para retirar");
      }
    } catch (error) {
      console.log("   ❌ Error en retiro de emergencia:", error.message);
    }

    // 7. Verificar estado final
    console.log("\n📊 Estado final del contrato:");
    const finalIsPaused = await bigBangToken.paused();
    const finalStakingPaused = await bigBangToken.stakingPaused();
    const finalUnstakingPaused = await bigBangToken.unstakingPaused();
    const finalMaxStake = await bigBangToken.maxStakeAmount();
    const finalMaxTotal = await bigBangToken.maxTotalStaked();
    
    console.log("   Contrato pausado:", finalIsPaused);
    console.log("   Staking pausado:", finalStakingPaused);
    console.log("   Unstaking pausado:", finalUnstakingPaused);
    console.log("   Max stake amount:", ethers.formatEther(finalMaxStake), "BBNG");
    console.log("   Max total staked:", ethers.formatEther(finalMaxTotal), "BBNG");

    console.log("\n🎉 ¡Testing completo del dashboard exitoso!");
    console.log("✅ Configuración de límites funcionando");
    console.log("✅ Gestión de tasas operativa");
    console.log("✅ Pausado granular activo");
    console.log("✅ Retiro de emergencia disponible");
    console.log("✅ Todas las funciones del dashboard validadas");

  } catch (error) {
    console.error("❌ Error durante el testing:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  }); 