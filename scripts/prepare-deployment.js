const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Preparando deployment del BIG BANG Token...");
    
    try {
        // Verificar configuración
        console.log("\n📋 Verificando configuración:");
        
        const sepoliaUrl = process.env.SEPOLIA_RPC_URL;
        const privateKey = process.env.PRIVATE_KEY;
        const etherscanKey = process.env.ETHERSCAN_API_KEY;
        
        console.log(`   SEPOLIA_RPC_URL: ${sepoliaUrl ? '✅ Configurado' : '❌ No configurado'}`);
        console.log(`   PRIVATE_KEY: ${privateKey ? '✅ Configurado' : '❌ No configurado'}`);
        console.log(`   ETHERSCAN_API_KEY: ${etherscanKey ? '✅ Configurado' : '❌ No configurado'}`);
        
        if (!sepoliaUrl || !privateKey || !etherscanKey) {
            console.log("\n❌ Configuración incompleta!");
            console.log("📝 Por favor configura las variables de entorno en .env");
            return;
        }
        
        // Verificar conexión a Sepolia
        console.log("\n🌐 Verificando conexión a Sepolia...");
        try {
            const provider = new ethers.JsonRpcProvider(sepoliaUrl);
            const network = await provider.getNetwork();
            console.log(`   ✅ Conectado a Sepolia (Chain ID: ${network.chainId})`);
        } catch (error) {
            console.log("   ❌ Error conectando a Sepolia:", error.message);
            return;
        }
        
        // Verificar balance
        console.log("\n💰 Verificando balance...");
        try {
            const provider = new ethers.JsonRpcProvider(sepoliaUrl);
            const wallet = new ethers.Wallet(privateKey, provider);
            const balance = await wallet.getBalance();
            const balanceEth = ethers.formatEther(balance);
            
            console.log(`   Balance: ${balanceEth} ETH`);
            
            if (parseFloat(balanceEth) < 0.01) {
                console.log("   ⚠️  Balance bajo. Necesitas al menos 0.01 ETH para gas");
                console.log("   💡 Obtén ETH gratis en: https://sepoliafaucet.com/");
            } else {
                console.log("   ✅ Balance suficiente para deployment");
            }
        } catch (error) {
            console.log("   ❌ Error verificando balance:", error.message);
        }
        
        // Verificar contrato
        console.log("\n📄 Verificando contrato...");
        try {
            const BigBangToken = await ethers.getContractFactory("BigBangToken");
            console.log("   ✅ Contrato compilado correctamente");
        } catch (error) {
            console.log("   ❌ Error compilando contrato:", error.message);
            return;
        }
        
        // Información final
        console.log("\n🎯 Información del deployment:");
        console.log("   Token: BIG BANG (BBNG)");
        console.log("   Supply: 21,000,000 BBNG");
        console.log("   Red: Sepolia Testnet");
        console.log("   Gas estimado: ~1,790,854");
        
        console.log("\n💰 Distribución automática:");
        console.log("   Cyberpunk Architect: 5,250,000 BBNG (25%)");
        console.log("   Couch Otter: 2,100,000 BBNG (10%)");
        console.log("   Jus: 5,250,000 BBNG (25%)");
        console.log("   PrisonedMoney: 2,100,000 BBNG (10%)");
        console.log("   Venta Pública: 6,300,000 BBNG (30%)");
        
        console.log("\n🚀 Para hacer el deployment:");
        console.log("   npx hardhat run scripts/deploy.js --network sepolia");
        
        console.log("\n📝 Después del deployment:");
        console.log("   1. Copia la dirección del contrato");
        console.log("   2. Verifica en Etherscan: https://sepolia.etherscan.io/");
        console.log("   3. Actualiza frontend/config.js con la nueva dirección");
        
        console.log("\n✅ ¡Sistema listo para deployment!");
        
    } catch (error) {
        console.error("❌ Error durante la preparación:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 