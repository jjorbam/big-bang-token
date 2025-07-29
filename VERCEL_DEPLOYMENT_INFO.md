# 🚀 Vercel Deployment Info - BIG BANG Token

## 📋 Información del Deployment

- **Fecha**: martes, 29 de julio de 2025, 22:26:10 CEST
- **Versión**: 2.0.0
- **Commit**: 2516875
- **Estado**: ✅ LISTO PARA VERCEL

## 🔧 Fixes Implementados

### Wallet Connect Fix
- ✅ **wallet-connect-fix.js** - Mejoras para conexión en Vercel
- ✅ **Timeout handling** - Manejo de timeouts de MetaMask
- ✅ **Error handling** - Manejo mejorado de errores
- ✅ **Network detection** - Detección automática de red
- ✅ **Vercel-specific fixes** - Soluciones específicas para Vercel

## 🌐 URLs Esperadas

- **Frontend Principal**: https://big-bang-token.vercel.app
- **Admin Dashboard**: https://big-bang-token.vercel.app/admin-dashboard.html

## 🛠️ Configuración

### Variables de Entorno (Opcional)
```env
CONTRACT_ADDRESS=0x61CA5da746eE0D850d173F3b0116E464dd6D334e
NETWORK=sepolia
PROJECT_NAME=BIG BANG Token
VERSION=2.0.0
```

### Configuración de Vercel
- **Framework Preset**: Other
- **Root Directory**: ./
- **Output Directory**: frontend
- **Build Command**: (vacío)

## 🔧 Comandos de Deployment

```bash
# Deployment manual
vercel --prod --yes

# Deployment con configuración específica
vercel --prod --yes --confirm

# Verificar deployment
vercel ls
```

## 🛡️ Problemas Conocidos y Soluciones

### Problema: Wallet no conecta en Vercel
**Solución**: 
1. Verificar que MetaMask esté instalado
2. Asegurarse de estar en la red Sepolia
3. Usar el fix implementado en wallet-connect-fix.js

### Problema: Timeout de conexión
**Solución**:
1. Verificar que MetaMask esté activo
2. Revisar la consola del navegador
3. Usar la función debugWalletConnection()

### Problema: Red incorrecta
**Solución**:
1. Cambiar manualmente a Sepolia en MetaMask
2. Usar la función handleNetworkChange()

## 📞 Soporte

- **Debug**: Abrir consola del navegador y usar debugWalletConnection()
- **Logs**: Revisar logs en Vercel Dashboard
- **Issues**: GitHub Issues

---

**Última actualización**: martes, 29 de julio de 2025, 22:26:10 CEST
**Versión**: 2.0.0
**Estado**: ✅ LISTO PARA DEPLOYMENT
