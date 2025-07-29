const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Diagnosticando funciones de emergencia...");

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
    
    console.log("   Contrato pausado:", isPaused);
    console.log("   Staking pausado:", stakingPaused);
    console.log("   Unstaking pausado:", unstakingPaused);

    // 2. Verificar funciones disponibles
    console.log("\n🔍 Verificando funciones disponibles:");
    
    // Intentar llamar pause() normal
    try {
      console.log("   Probando pause() normal...");
      const tx = await bigBangToken.pause();
      await tx.wait();
      console.log("   ✅ pause() normal funcionó");
      
      // Verificar estado
      const isPausedAfter = await bigBangToken.paused();
      console.log("   Contrato pausado después:", isPausedAfter);
      
      // Unpause
      console.log("   Probando unpause() normal...");
      const tx2 = await bigBangToken.unpause();
      await tx2.wait();
      console.log("   ✅ unpause() normal funcionó");
      
    } catch (error) {
      console.log("   ❌ Error con pause() normal:", error.message);
    }

    // 3. Probar funciones de emergencia una por una
    console.log("\n🚨 Probando funciones de emergencia:");
    
    // Probar setStakingPaused
    try {
      console.log("   Probando setStakingPaused(true)...");
      const tx = await bigBangToken.setStakingPaused(true);
      await tx.wait();
      console.log("   ✅ setStakingPaused(true) funcionó");
      
      const stakingPausedAfter = await bigBangToken.stakingPaused();
      console.log("   Staking pausado después:", stakingPausedAfter);
      
      // Revertir
      console.log("   Probando setStakingPaused(false)...");
      const tx2 = await bigBangToken.setStakingPaused(false);
      await tx2.wait();
      console.log("   ✅ setStakingPaused(false) funcionó");
      
    } catch (error) {
      console.log("   ❌ Error con setStakingPaused:", error.message);
    }

    // Probar setUnstakingPaused
    try {
      console.log("   Probando setUnstakingPaused(true)...");
      const tx = await bigBangToken.setUnstakingPaused(true);
      await tx.wait();
      console.log("   ✅ setUnstakingPaused(true) funcionó");
      
      const unstakingPausedAfter = await bigBangToken.unstakingPaused();
      console.log("   Unstaking pausado después:", unstakingPausedAfter);
      
      // Revertir
      console.log("   Probando setUnstakingPaused(false)...");
      const tx2 = await bigBangToken.setUnstakingPaused(false);
      await tx2.wait();
      console.log("   ✅ setUnstakingPaused(false) funcionó");
      
    } catch (error) {
      console.log("   ❌ Error con setUnstakingPaused:", error.message);
    }

    // 4. Probar emergencyPause con más detalle
    console.log("\n🚨 Probando emergencyPause con detalle:");
    try {
      console.log("   Ejecutando emergencyPause...");
      const tx = await bigBangToken.emergencyPause();
      console.log("   ✅ Transaction enviada, esperando confirmación...");
      await tx.wait();
      console.log("   ✅ emergencyPause ejecutado exitosamente");
      
      // Verificar todos los estados
      const isPausedAfter = await bigBangToken.paused();
      const stakingPausedAfter = await bigBangToken.stakingPaused();
      const unstakingPausedAfter = await bigBangToken.unstakingPaused();
      
      console.log("   Estados después de emergencyPause:");
      console.log("     - Contrato pausado:", isPausedAfter);
      console.log("     - Staking pausado:", stakingPausedAfter);
      console.log("     - Unstaking pausado:", unstakingPausedAfter);
      
    } catch (error) {
      console.log("   ❌ Error detallado con emergencyPause:");
      console.log("     - Error message:", error.message);
      console.log("     - Error code:", error.code);
      console.log("     - Error data:", error.data);
    }

    console.log("\n🎉 Diagnóstico completado");

  } catch (error) {
    console.error("❌ Error durante el diagnóstico:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  }); 