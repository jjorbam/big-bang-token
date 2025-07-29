const fs = require('fs');
const path = require('path');

console.log("🚀 Preparando deployment a producción...");

// Función para verificar archivos críticos
function checkCriticalFiles() {
    console.log("\n📋 Verificando archivos críticos...");
    
    const criticalFiles = [
        'frontend/index.html',
        'frontend/app.js',
        'frontend/styles.css',
        'frontend/admin-dashboard.html',
        'frontend/admin-dashboard.js',
        'frontend/vercel.json',
        'contracts/BigBangToken.sol',
        'package.json',
        'README.md',
        'docs/admin-dashboard-guide.md',
        'docs/security-improvements.md',
        'contract-address.json'
    ];
    
    let allFilesExist = true;
    
    criticalFiles.forEach(file => {
        if (fs.existsSync(file)) {
            console.log(`   ✅ ${file}`);
        } else {
            console.log(`   ❌ ${file} - FALTANTE`);
            allFilesExist = false;
        }
    });
    
    return allFilesExist;
}

// Función para verificar configuración del contrato
function checkContractConfig() {
    console.log("\n🔍 Verificando configuración del contrato...");
    
    try {
        const contractAddress = JSON.parse(fs.readFileSync('contract-address.json', 'utf8'));
        
        console.log(`   📍 Dirección del contrato: ${contractAddress.address}`);
        console.log(`   🌐 Red: ${contractAddress.network}`);
        console.log(`   👤 Deployer: ${contractAddress.deployer}`);
        console.log(`   🏷️ Versión: ${contractAddress.version}`);
        console.log(`   🛡️ Features: ${contractAddress.security_features.join(', ')}`);
        console.log(`   ✅ Tests: ${contractAddress.tests_passed}`);
        
        return true;
    } catch (error) {
        console.log("   ❌ Error leyendo contract-address.json");
        return false;
    }
}

// Función para verificar configuración de Vercel
function checkVercelConfig() {
    console.log("\n🌐 Verificando configuración de Vercel...");
    
    try {
        const vercelConfig = JSON.parse(fs.readFileSync('frontend/vercel.json', 'utf8'));
        
        console.log(`   📦 Versión: ${vercelConfig.version}`);
        console.log(`   🔧 Builds configurados: ${vercelConfig.builds.length}`);
        console.log(`   🔄 Rewrites configurados: ${vercelConfig.rewrites.length}`);
        console.log(`   🛡️ Headers de seguridad: ${vercelConfig.headers.length}`);
        
        return true;
    } catch (error) {
        console.log("   ❌ Error leyendo vercel.json");
        return false;
    }
}

// Función para crear archivo de deployment
function createDeploymentFile() {
    console.log("\n📝 Creando archivo de deployment...");
    
    const deploymentInfo = {
        project: "BIG BANG Token",
        version: "2.0.0",
        deployment_date: new Date().toISOString(),
        features: [
            "ERC20 Token con staking",
            "Dashboard de administración",
            "Circuit breakers de seguridad",
            "Funciones de emergencia",
            "Configuración dinámica",
            "Frontend responsivo",
            "Multi-idioma"
        ],
        networks: {
            testnet: "Sepolia",
            mainnet: "Ethereum"
        },
        contract_address: "0x61CA5da746eE0D850d173F3b0116E464dd6D334e",
        admin_dashboard: "admin-dashboard.html",
        documentation: [
            "docs/admin-dashboard-guide.md",
            "docs/security-improvements.md",
            "docs/phase-2-testing-plan.md"
        ],
        deployment_steps: [
            "1. Push a GitHub",
            "2. Conectar repositorio a Vercel",
            "3. Configurar variables de entorno",
            "4. Deploy automático",
            "5. Verificar funcionalidad"
        ]
    };
    
    fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
    console.log("   ✅ deployment-info.json creado");
}

// Función para crear README de deployment
function createDeploymentREADME() {
    console.log("\n📚 Creando README de deployment...");
    
    const deploymentREADME = `# 🚀 BIG BANG Token - Deployment Guide

## 📋 Información del Proyecto

- **Nombre**: BIG BANG Token (BBNG)
- **Versión**: 2.0.0
- **Tipo**: ERC20 Token con Staking
- **Red Testnet**: Sepolia
- **Contrato**: 0x61CA5da746eE0D850d173F3b0116E464dd6D334e

## 🌐 URLs de Deployment

### Frontend Principal
- **URL**: https://big-bang-token.vercel.app
- **Admin Dashboard**: https://big-bang-token.vercel.app/admin-dashboard.html

## 🛠️ Tecnologías Utilizadas

### Smart Contract
- **Lenguaje**: Solidity 0.8.0
- **Framework**: Hardhat
- **Librerías**: OpenZeppelin
- **Red**: Sepolia Testnet

### Frontend
- **Lenguaje**: HTML5, CSS3, JavaScript
- **Framework**: Vanilla JS
- **Wallet**: MetaMask
- **Deployment**: Vercel

## 📁 Estructura del Proyecto

\`\`\`
big-bang-token/
├── contracts/           # Smart contracts
├── frontend/           # Aplicación web
├── scripts/            # Scripts de deployment
├── test/              # Tests del contrato
├── docs/              # Documentación
└── deployment-info.json
\`\`\`

## 🚀 Pasos para Deployment

### 1. GitHub
\`\`\`bash
# Clonar repositorio
git clone https://github.com/[username]/big-bang-token.git

# Verificar archivos
npm install
npm test
\`\`\`

### 2. Vercel
\`\`\`bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
\`\`\`

### 3. Variables de Entorno
\`\`\`env
# .env (no subir a GitHub)
PRIVATE_KEY=your_private_key
INFURA_URL=your_infura_url
ETHERSCAN_API_KEY=your_etherscan_key
\`\`\`

## 🛡️ Características de Seguridad

- ✅ Circuit breakers implementados
- ✅ Funciones de emergencia
- ✅ Validaciones exhaustivas
- ✅ Reentrancy protection
- ✅ Overflow protection
- ✅ Admin dashboard seguro

## 📊 Funcionalidades

### Para Usuarios
- Staking de tokens
- Múltiples períodos (30, 90, 180, 365 días)
- Tasas de recompensa dinámicas
- Interfaz multi-idioma
- Responsive design

### Para Administradores
- Dashboard de control
- Funciones de emergencia
- Configuración de límites
- Gestión de tasas
- Log de actividades

## 🔧 Comandos Útiles

\`\`\`bash
# Compilar contratos
npm run compile

# Ejecutar tests
npm test

# Deploy a testnet
npm run deploy -- --network sepolia

# Verificar contrato
npm run verify -- --network sepolia

# Iniciar frontend local
npm run frontend
\`\`\`

## 📞 Soporte

- **Desarrollador**: Cyberpunk Architect
- **Documentación**: docs/
- **Issues**: GitHub Issues
- **Testing**: Sepolia Testnet

## 📈 Estado del Proyecto

- ✅ **Fase 1**: Seguridad Interna - COMPLETADA
- ✅ **Fase 2**: Testing Exhaustivo - COMPLETADA
- 🔄 **Fase 3**: Optimización - EN PROGRESO
- ⏳ **Fase 4**: Mainnet - PENDIENTE

---

**Última actualización**: ${new Date().toLocaleDateString()}
**Versión**: 2.0.0
`;

    fs.writeFileSync('DEPLOYMENT_README.md', deploymentREADME);
    console.log("   ✅ DEPLOYMENT_README.md creado");
}

// Función para verificar .gitignore
function checkGitignore() {
    console.log("\n🔒 Verificando .gitignore...");
    
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    const criticalPatterns = [
        'node_modules',
        '.env',
        'artifacts',
        'cache',
        'coverage',
        '.DS_Store'
    ];
    
    let allPatternsPresent = true;
    
    criticalPatterns.forEach(pattern => {
        if (gitignore.includes(pattern)) {
            console.log(`   ✅ ${pattern}`);
        } else {
            console.log(`   ⚠️ ${pattern} - No encontrado`);
            allPatternsPresent = false;
        }
    });
    
    return allPatternsPresent;
}

// Función principal
async function prepareDeployment() {
    console.log("🚀 PREPARANDO DEPLOYMENT A PRODUCCIÓN");
    console.log("=" .repeat(50));
    
    // Verificaciones
    const filesOK = checkCriticalFiles();
    const contractOK = checkContractConfig();
    const vercelOK = checkVercelConfig();
    const gitignoreOK = checkGitignore();
    
    // Crear archivos de deployment
    createDeploymentFile();
    createDeploymentREADME();
    
    // Resumen
    console.log("\n📊 RESUMEN DE VERIFICACIÓN");
    console.log("=" .repeat(30));
    console.log(`   📁 Archivos críticos: ${filesOK ? '✅' : '❌'}`);
    console.log(`   🔍 Configuración contrato: ${contractOK ? '✅' : '❌'}`);
    console.log(`   🌐 Configuración Vercel: ${vercelOK ? '✅' : '❌'}`);
    console.log(`   🔒 .gitignore: ${gitignoreOK ? '✅' : '❌'}`);
    
    if (filesOK && contractOK && vercelOK && gitignoreOK) {
        console.log("\n🎉 ¡PROYECTO LISTO PARA DEPLOYMENT!");
        console.log("\n📋 PRÓXIMOS PASOS:");
        console.log("   1. git add .");
        console.log("   2. git commit -m 'v2.0.0: Dashboard admin + security improvements'");
        console.log("   3. git push origin main");
        console.log("   4. Conectar repositorio a Vercel");
        console.log("   5. Configurar variables de entorno");
        console.log("   6. Deploy automático");
    } else {
        console.log("\n⚠️ ALGUNOS PROBLEMAS DETECTADOS");
        console.log("   Por favor, corrige los problemas antes del deployment");
    }
}

// Ejecutar
prepareDeployment(); 