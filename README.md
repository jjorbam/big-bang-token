# 🚀 BIG BANG Token (BBNG)

**Token ERC20 con sistema de staking avanzado y recompensas dinámicas**

## 🌟 Características

- **Token ERC20** - Estándar completo con funcionalidades avanzadas
- **Sistema de Staking** - Múltiples períodos con diferentes APY
- **Recompensas Dinámicas** - 5% a 20% APY según período
- **dApp Moderna** - Interfaz futurista con diseño cyberpunk
- **Multiidioma** - Soporte para Español, Inglés y Portugués
- **Responsive** - Optimizado para móviles y desktop

## 📊 Estadísticas del Token

- **Nombre**: BIG BANG
- **Símbolo**: BBNG
- **Decimales**: 18
- **Supply Total**: 1,000,000,000 BBNG
- **Red**: Sepolia Testnet (Ethereum)

## 🎯 Funcionalidades

### **Staking System**
- **30 días**: 5% APY
- **90 días**: 10% APY  
- **180 días**: 15% APY
- **365 días**: 20% APY

### **dApp Features**
- ✅ Conexión con MetaMask
- ✅ Gestión de balance de tokens
- ✅ Sistema de staking completo
- ✅ Transferencias entre wallets
- ✅ Dashboard en tiempo real
- ✅ Interfaz multiidioma

## 🛠️ Tecnologías

- **Smart Contracts**: Solidity + OpenZeppelin
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Blockchain**: Ethereum (Sepolia Testnet)
- **Wallet**: MetaMask Integration
- **Deployment**: Hardhat + Ethers.js

## 🚀 Deployment

### **Frontend Live**
- **Vercel**: [https://big-bang-token.vercel.app](https://big-bang-token.vercel.app)
- **Netlify**: [https://big-bang-token.netlify.app](https://big-bang-token.netlify.app)

### **Contract Address**
- **Sepolia**: `0x...` (Actualizar con dirección real)

## 📁 Estructura del Proyecto

```
big-bang-token/
├── contracts/
│   └── BigBangToken.sol      # Smart Contract principal
├── frontend/
│   ├── index.html            # Página principal
│   ├── styles.css            # Estilos CSS
│   ├── app.js               # Lógica principal
│   ├── config.js            # Configuración
│   ├── translations.js      # Traducciones
│   └── debug-wallet.js      # Utilidades de debug
├── scripts/
│   ├── deploy.js            # Script de deployment
│   ├── verify.js            # Verificación en Etherscan
│   └── check-deploy-ready.js # Verificación pre-deployment
├── test/
│   └── BigBangToken.test.js # Tests unitarios
└── docs/
    └── sepolia-setup.md     # Guía de configuración
```

## 🔧 Instalación Local

### **Prerrequisitos**
- Node.js (v16+)
- npm o yarn
- MetaMask extension

### **Setup**
```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/big-bang-token.git
cd big-bang-token

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env
# Editar .env con tus claves privadas

# Compilar contratos
npx hardhat compile

# Ejecutar tests
npx hardhat test

# Deploy a Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

### **Frontend Local**
```bash
cd frontend
python3 -m http.server 8003
# Abrir http://localhost:8003
```

## 🌐 Redes Sociales

- **Website**: [https://bigbangtoken.com](https://bigbangtoken.com)
- **Twitter**: [@BigBangToken](https://twitter.com/BigBangToken)
- **Telegram**: [@BigBangToken](https://t.me/BigBangToken)
- **Discord**: [Big Bang Token](https://discord.gg/bigbangtoken)

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto

- **Email**: info@bigbangtoken.com
- **GitHub**: [@tu-usuario](https://github.com/tu-usuario)

---

**⭐ Si te gusta este proyecto, dale una estrella en GitHub!** 