# 🚀 INSTRUCCIONES DE DEPLOYMENT - BIG BANG TOKEN

## 📋 **INFORMACIÓN DEL PROYECTO**

- **Nombre**: BIG BANG Token (BBNG)
- **Versión**: 2.0.0
- **Tipo**: ERC20 Token con Staking + Admin Dashboard
- **Red**: Sepolia Testnet
- **Contrato**: 0x61CA5da746eE0D850d173F3b0116E464dd6D334e

---

## 🌐 **DEPLOYMENT A GITHUB**

### **Paso 1: Preparar Repositorio**

```bash
# Verificar estado actual
git status

# Añadir todos los archivos
git add .

# Crear commit
git commit -m "v2.0.0: Dashboard admin + security improvements"

# Subir a GitHub
git push origin main
```

### **Paso 2: Crear Repositorio en GitHub**

1. Ve a https://github.com
2. Haz clic en "New repository"
3. Nombre: `big-bang-token`
4. Descripción: `BIG BANG Token - ERC20 with Staking & Admin Dashboard`
5. Público
6. No inicializar con README (ya existe)
7. Crear repositorio

### **Paso 3: Conectar Repositorio Local**

```bash
# Si no tienes el repositorio remoto configurado
git remote add origin https://github.com/[tu-usuario]/big-bang-token.git

# Subir código
git push -u origin main
```

---

## 🚀 **DEPLOYMENT A VERCEL**

### **Opción 1: Deployment Automático (Recomendado)**

1. Ve a https://vercel.com
2. Inicia sesión con tu cuenta de GitHub
3. Haz clic en "New Project"
4. Importa el repositorio `big-bang-token`
5. Configura las siguientes opciones:

#### **Configuración del Proyecto**
- **Framework Preset**: Other
- **Root Directory**: `./` (raíz del proyecto)
- **Build Command**: (dejar vacío)
- **Output Directory**: `frontend`
- **Install Command**: `npm install`

#### **Variables de Entorno**
```env
CONTRACT_ADDRESS=0x61CA5da746eE0D850d173F3b0116E464dd6D334e
NETWORK=sepolia
PROJECT_NAME=BIG BANG Token
VERSION=2.0.0
```

### **Opción 2: Deployment Manual con Vercel CLI**

```bash
# Instalar Vercel CLI
npm install -g vercel

# Iniciar sesión
vercel login

# Deploy
vercel --prod
```

---

## 📁 **ESTRUCTURA DEL PROYECTO**

```
big-bang-token/
├── contracts/              # Smart contracts
│   └── BigBangToken.sol
├── frontend/              # Aplicación web
│   ├── index.html         # Frontend principal
│   ├── admin-dashboard.html # Dashboard admin
│   ├── app.js             # Lógica principal
│   ├── admin-dashboard.js # Lógica del dashboard
│   ├── styles.css         # Estilos
│   └── vercel.json        # Config Vercel
├── scripts/               # Scripts de deployment
├── test/                  # Tests del contrato
├── docs/                  # Documentación
├── package.json           # Dependencias
├── hardhat.config.js      # Config Hardhat
└── vercel.json           # Config Vercel raíz
```

---

## 🔧 **CONFIGURACIÓN ADICIONAL**

### **Variables de Entorno (Opcional)**

Si necesitas configurar variables adicionales en Vercel:

```env
# Configuración del contrato
CONTRACT_ADDRESS=0x61CA5da746eE0D850d173F3b0116E464dd6D334e
NETWORK=sepolia

# Configuración de la aplicación
PROJECT_NAME=BIG BANG Token
VERSION=2.0.0

# Configuración de desarrollo (solo para desarrollo local)
PRIVATE_KEY=tu_private_key
INFURA_URL=tu_infura_url
ETHERSCAN_API_KEY=tu_etherscan_key
```

### **Dominio Personalizado (Opcional)**

1. En Vercel, ve a Settings > Domains
2. Añade tu dominio personalizado
3. Configura los registros DNS según las instrucciones

---

## 🌐 **URLS ESPERADAS**

Después del deployment exitoso, tendrás acceso a:

- **Frontend Principal**: `https://big-bang-token.vercel.app`
- **Admin Dashboard**: `https://big-bang-token.vercel.app/admin-dashboard.html`
- **Documentación**: `https://big-bang-token.vercel.app/docs/`

---

## 🛡️ **VERIFICACIÓN POST-DEPLOYMENT**

### **1. Verificar Frontend Principal**
- [ ] Cargar la página principal
- [ ] Conectar MetaMask
- [ ] Verificar staking funciona
- [ ] Verificar transferencias funcionan

### **2. Verificar Admin Dashboard**
- [ ] Acceder con wallet owner
- [ ] Verificar funciones de emergencia
- [ ] Verificar configuración de límites
- [ ] Verificar gestión de tasas

### **3. Verificar Contrato**
- [ ] Verificar en Etherscan
- [ ] Ejecutar tests en testnet
- [ ] Verificar funciones administrativas

---

## 🔧 **COMANDOS ÚTILES**

### **Desarrollo Local**
```bash
# Instalar dependencias
npm install

# Ejecutar tests
npm test

# Compilar contratos
npm run compile

# Deploy a testnet
npm run deploy -- --network sepolia

# Iniciar frontend local
npm run frontend
```

### **Deployment**
```bash
# Script de deployment automatizado
./scripts/github-deploy.sh

# Verificar preparación
node scripts/deploy-to-production.js

# Deploy manual a Vercel
vercel --prod
```

---

## 📞 **SOPORTE Y TROUBLESHOOTING**

### **Problemas Comunes**

#### **❌ Error: "Build failed"**
**Solución**: Verificar que todos los archivos están en el directorio correcto

#### **❌ Error: "Contract not found"**
**Solución**: Verificar que la dirección del contrato es correcta

#### **❌ Error: "MetaMask not connected"**
**Solución**: Verificar que el usuario tiene MetaMask instalado

#### **❌ Error: "Admin access denied"**
**Solución**: Verificar que la wallet conectada es el owner del contrato

### **Contacto**
- **Desarrollador**: Cyberpunk Architect
- **Documentación**: `docs/`
- **Issues**: GitHub Issues
- **Testing**: Sepolia Testnet

---

## 📊 **ESTADO DEL PROYECTO**

- ✅ **Fase 1**: Seguridad Interna - COMPLETADA
- ✅ **Fase 2**: Testing Exhaustivo - COMPLETADA
- 🔄 **Fase 3**: Optimización - EN PROGRESO
- ⏳ **Fase 4**: Mainnet - PENDIENTE

---

**Última actualización**: 27 de Julio 2025
**Versión**: 2.0.0
**Estado**: ✅ LISTO PARA DEPLOYMENT 