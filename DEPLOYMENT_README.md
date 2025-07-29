# 🚀 BIG BANG Token - Deployment Guide

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

```
big-bang-token/
├── contracts/           # Smart contracts
├── frontend/           # Aplicación web
├── scripts/            # Scripts de deployment
├── test/              # Tests del contrato
├── docs/              # Documentación
└── deployment-info.json
```

## 🚀 Pasos para Deployment

### 1. GitHub
```bash
# Clonar repositorio
git clone https://github.com/[username]/big-bang-token.git

# Verificar archivos
npm install
npm test
```

### 2. Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 3. Variables de Entorno
```env
# .env (no subir a GitHub)
PRIVATE_KEY=your_private_key
INFURA_URL=your_infura_url
ETHERSCAN_API_KEY=your_etherscan_key
```

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

```bash
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
```

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

**Última actualización**: 29/7/2025
**Versión**: 2.0.0
