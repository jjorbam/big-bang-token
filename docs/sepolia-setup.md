# 🚀 Configuración para Deploy en Sepolia

## 📋 **Requisitos Previos**

### **1. Obtener ETH de Sepolia (Gratis)**
- **Sepolia Faucet**: https://sepoliafaucet.com/
- **Alchemy Faucet**: https://sepolia-faucet.pk910.de/
- **Infura Faucet**: https://faucet.sepolia.dev/

**Cantidad recomendada**: 0.1-0.5 ETH para testing

### **2. Configurar Infura (RPC URL)**
1. Ve a https://app.infura.io/
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Copia la URL de Sepolia:
   ```
   https://sepolia.infura.io/v3/TU-PROJECT-ID
   ```

### **3. Obtener API Key de Etherscan**
1. Ve a https://etherscan.io/apis
2. Crea una cuenta gratuita
3. Genera tu API key
4. Copia la API key

### **4. Preparar Wallet**
1. Usa MetaMask o cualquier wallet
2. Exporta la clave privada
3. **IMPORTANTE**: Usa una wallet dedicada para testing
4. **NUNCA** uses tu wallet principal

## 🔧 **Configuración del Archivo .env**

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Configuración de Sepolia
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/TU-PROJECT-ID
PRIVATE_KEY=tu_clave_privada_aqui
ETHERSCAN_API_KEY=tu_api_key_de_etherscan

# Configuración opcional
REPORT_GAS=true
```

## ⚠️ **Seguridad**

- ✅ **NUNCA** compartas tu clave privada
- ✅ **NUNCA** subas el archivo `.env` a GitHub
- ✅ Usa una wallet dedicada para testing
- ✅ Verifica que tienes ETH suficiente en Sepolia

## 🎯 **Próximos Pasos**

1. Configurar las variables de entorno
2. Verificar que tienes ETH en Sepolia
3. Ejecutar el deploy
4. Verificar el contrato en Etherscan 