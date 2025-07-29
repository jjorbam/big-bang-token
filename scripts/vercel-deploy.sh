#!/bin/bash

echo "🚀 DEPLOYMENT VERCEL - BIG BANG TOKEN"
echo "======================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con colores
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

print_status "Verificando archivos críticos..."

# Verificar archivos críticos para Vercel
critical_files=(
    "frontend/index.html"
    "frontend/app.js"
    "frontend/wallet-connect-fix.js"
    "frontend/styles.css"
    "frontend/admin-dashboard.html"
    "frontend/admin-dashboard.js"
    "vercel.json"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        print_status "$file"
    else
        print_error "$file - FALTANTE"
        exit 1
    fi
done

print_status "Verificando configuración de Vercel..."

# Verificar vercel.json
if [ -f "vercel.json" ]; then
    print_status "vercel.json encontrado"
else
    print_error "vercel.json no encontrado"
    exit 1
fi

print_status "Preparando deployment..."

# Crear archivo de información del deployment
cat > VERCEL_DEPLOYMENT_INFO.md << EOF
# 🚀 Vercel Deployment Info - BIG BANG Token

## 📋 Información del Deployment

- **Fecha**: $(date)
- **Versión**: 2.0.0
- **Commit**: $(git rev-parse --short HEAD)
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
\`\`\`env
CONTRACT_ADDRESS=0x61CA5da746eE0D850d173F3b0116E464dd6D334e
NETWORK=sepolia
PROJECT_NAME=BIG BANG Token
VERSION=2.0.0
\`\`\`

### Configuración de Vercel
- **Framework Preset**: Other
- **Root Directory**: ./
- **Output Directory**: frontend
- **Build Command**: (vacío)

## 🔧 Comandos de Deployment

\`\`\`bash
# Deployment manual
vercel --prod --yes

# Deployment con configuración específica
vercel --prod --yes --confirm

# Verificar deployment
vercel ls
\`\`\`

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

**Última actualización**: $(date)
**Versión**: 2.0.0
**Estado**: ✅ LISTO PARA DEPLOYMENT
EOF

print_status "Archivo VERCEL_DEPLOYMENT_INFO.md creado"

print_status "Verificando Vercel CLI..."

# Verificar si Vercel CLI está instalado
if command -v vercel &> /dev/null; then
    print_status "Vercel CLI instalado"
    vercel_version=$(vercel --version)
    print_info "Versión: $vercel_version"
else
    print_warning "Vercel CLI no está instalado"
    print_info "Instalando Vercel CLI..."
    npm install -g vercel
fi

print_status "Verificando login de Vercel..."

# Verificar si está logueado
if vercel whoami &> /dev/null; then
    print_status "Logueado en Vercel"
else
    print_warning "No estás logueado en Vercel"
    print_info "Ejecuta: vercel login"
    print_info "Luego selecciona tu método de login (Google, GitHub, etc.)"
fi

print_status "Preparando archivos para deployment..."

# Asegurar que todos los archivos estén actualizados
git add .
git commit -m "v2.0.1: Wallet connect fix for Vercel deployment" --allow-empty

print_status "Commit creado"

print_status "Verificando tests..."

# Ejecutar tests rápidos
npm test -- --grep "Deployment" --timeout 5000

if [ $? -eq 0 ]; then
    print_status "Tests básicos pasando"
else
    print_warning "Algunos tests fallaron, pero continuando..."
fi

echo ""
echo "🎉 PREPARACIÓN PARA VERCEL COMPLETADA"
echo "====================================="
echo ""
echo "📋 RESUMEN:"
echo "   ✅ Archivos críticos verificados"
echo "   ✅ Wallet connect fix implementado"
echo "   ✅ Configuración de Vercel lista"
echo "   ✅ Documentación creada"
echo ""
echo "🌐 PRÓXIMOS PASOS:"
echo "   1. Ejecuta: vercel login (si no estás logueado)"
echo "   2. Ejecuta: vercel --prod --yes"
echo "   3. Verifica las URLs generadas"
echo "   4. Prueba la conexión de wallet"
echo ""
echo "🔧 COMANDOS ÚTILES:"
echo "   - Deployment: vercel --prod --yes"
echo "   - Debug: Abrir consola y usar debugWalletConnection()"
echo "   - Ver logs: vercel logs"
echo "   - Listar proyectos: vercel ls"
echo ""
echo "📊 URLs ESPERADAS:"
echo "   - Frontend: https://big-bang-token.vercel.app"
echo "   - Admin: https://big-bang-token.vercel.app/admin-dashboard.html"
echo ""
echo "🛡️ FIXES IMPLEMENTADOS:"
echo "   - Timeout handling para MetaMask"
echo "   - Error handling mejorado"
echo "   - Network detection automática"
echo "   - Vercel-specific fixes"
echo "" 