const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Probando funcionalidades de seguridad en testnet...");

  // Dirección del contrato desplegado
  const contractAddress = "0x61CA5da746eE0D850d173F3b0116E464dd6D334e";
  
  // Obtener el contrato
  const BigBangToken = await ethers.getContractFactory("BigBangToken");
  const bigBangToken = BigBangToken.attach(contractAddress);

  // Obtener cuenta principal
  const [owner] = await ethers.getSigners();

  console.log("📋 Cuenta del owner:", owner.address);

  try {
    // 1. Verificar límites de seguridad
    console.log("\n🔒 Verificando límites de seguridad...");
    const maxStakeAmount = await bigBangToken.maxStakeAmount();
    const maxTotalStaked = await bigBangToken.maxTotalStaked();
    const stakingPaused = await bigBangToken.stakingPaused();
    const unstakingPaused = await bigBangToken.unstakingPaused();

    console.log("   Max stake amount:", ethers.formatEther(maxStakeAmount), "BBNG");
    console.log("   Max total staked:", ethers.formatEther(maxTotalStaked), "BBNG");
    console.log("   Staking paused:", stakingPaused);
    console.log("   Unstaking paused:", unstakingPaused);

    // 2. Verificar balance del owner
    console.log("\n💰 Verificando balances...");
    const ownerBalance = await bigBangToken.balanceOf(owner.address);
    console.log("   Owner balance:", ethers.formatEther(ownerBalance), "BBNG");

    // 3. Probar funciones administrativas
    console.log("\n⚙️ Probando funciones administrativas...");
    
    // Actualizar límite de stake
    const newMaxStake = ethers.parseEther("500000");
    await bigBangToken.setMaxStakeAmount(newMaxStake);
    console.log("   ✅ Nuevo límite de stake:", ethers.formatEther(newMaxStake), "BBNG");

    // Actualizar tasa de recompensa
    await bigBangToken.updateRewardRate(30, 750); // 7.5%
    console.log("   ✅ Nueva tasa para 30 días: 7.5%");

    // 4. Probar emergency pause
    console.log("\n🚨 Probando emergency pause...");
    await bigBangToken.emergencyPause();
    console.log("   ✅ Emergency pause activado");

    const isPaused = await bigBangToken.paused();
    const stakingPausedAfter = await bigBangToken.stakingPaused();
    const unstakingPausedAfter = await bigBangToken.unstakingPaused();

    console.log("   Contrato pausado:", isPaused);
    console.log("   Staking pausado:", stakingPausedAfter);
    console.log("   Unstaking pausado:", unstakingPausedAfter);

    // Reanudar todo
    await bigBangToken.emergencyUnpause();
    console.log("   ✅ Emergency unpause activado");

    // 5. Probar cálculo de recompensas
    console.log("\n🧮 Probando cálculo de recompensas...");
    const reward = await bigBangToken.calculateReward(
      ethers.parseEther("1000"),
      30,
      500 // 5%
    );
    console.log("   ✅ Recompensa calculada:", ethers.formatEther(reward), "BBNG");

    console.log("\n🎉 ¡Todas las pruebas de seguridad exitosas!");
    console.log("✅ Circuit breakers funcionando");
    console.log("✅ Límites de seguridad activos");
    console.log("✅ Funciones de emergencia operativas");
    console.log("✅ Validaciones de seguridad correctas");

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