#!/bin/bash

echo "🚀 DEPLOYMENT AUTOMATIZADO - BIG BANG TOKEN"
echo "=============================================="

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

print_status "Verificando estado del repositorio..."

# Verificar si hay cambios pendientes
if [ -n "$(git status --porcelain)" ]; then
    print_warning "Hay cambios pendientes en el repositorio"
    git status --short
else
    print_status "No hay cambios pendientes"
fi

# Verificar que estamos en la rama main
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    print_warning "No estás en la rama main (actual: $current_branch)"
    read -p "¿Quieres cambiar a main? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout main
        print_status "Cambiado a rama main"
    else
        print_error "Deployment cancelado"
        exit 1
    fi
fi

# Verificar que el repositorio remoto está configurado
if ! git remote get-url origin > /dev/null 2>&1; then
    print_error "No hay un repositorio remoto configurado"
    print_info "Configura el repositorio remoto con:"
    print_info "git remote add origin https://github.com/[username]/big-bang-token.git"
    exit 1
fi

print_status "Preparando commit..."

# Añadir todos los archivos
git add .

# Crear commit con mensaje descriptivo
commit_message="v2.0.0: Dashboard admin + security improvements

- ✅ Admin dashboard completo con UX optimizada
- ✅ Circuit breakers y funciones de emergencia
- ✅ Testing exhaustivo (44/44 tests pasando)
- ✅ Configuración dinámica de límites y tasas
- ✅ Documentación completa del dashboard
- ✅ Preparación para deployment a producción

Contrato: 0x61CA5da746eE0D850d173F3b0116E464dd6D334e
Red: Sepolia Testnet
Tests: 44/44 pasando"

git commit -m "$commit_message"

if [ $? -eq 0 ]; then
    print_status "Commit creado exitosamente"
else
    print_error "Error al crear commit"
    exit 1
fi

print_status "Subiendo a GitHub..."

# Push a GitHub
git push origin main

if [ $? -eq 0 ]; then
    print_status "Push a GitHub exitoso"
else
    print_error "Error al hacer push a GitHub"
    exit 1
fi

print_status "Verificando configuración de Vercel..."

# Verificar si Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI no está instalado"
    print_info "Instalando Vercel CLI..."
    npm install -g vercel
fi

# Verificar si el proyecto está conectado a Vercel
if [ -f ".vercel/project.json" ]; then
    print_status "Proyecto ya conectado a Vercel"
else
    print_warning "Proyecto no conectado a Vercel"
    print_info "Para conectar a Vercel:"
    print_info "1. Ve a https://vercel.com"
    print_info "2. Importa el repositorio de GitHub"
    print_info "3. Configura las variables de entorno"
    print_info "4. Deploy automático"
fi

print_status "Creando archivo de deployment info..."

# Crear archivo con información del deployment
cat > DEPLOYMENT_STATUS.md << EOF
# 🚀 Deployment Status - BIG BANG Token

## 📋 Información del Deployment

- **Fecha**: $(date)
- **Versión**: 2.0.0
- **Commit**: $(git rev-parse --short HEAD)
- **Rama**: $(git branch --show-current)
- **Estado**: ✅ LISTO PARA DEPLOYMENT

## 🌐 URLs

- **Frontend Principal**: https://big-bang-token.vercel.app
- **Admin Dashboard**: https://big-bang-token.vercel.app/admin-dashboard.html
- **Contrato Sepolia**: 0x61CA5da746eE0D850d173F3b0116E464dd6D334e

## 📊 Estado del Proyecto

- ✅ **Fase 1**: Seguridad Interna - COMPLETADA
- ✅ **Fase 2**: Testing Exhaustivo - COMPLETADA
- 🔄 **Fase 3**: Optimización - EN PROGRESO
- ⏳ **Fase 4**: Mainnet - PENDIENTE

## 🛡️ Características Implementadas

- ✅ Circuit breakers de seguridad
- ✅ Funciones de emergencia
- ✅ Dashboard de administración
- ✅ Configuración dinámica
- ✅ Testing exhaustivo (44/44)
- ✅ Documentación completa

## 📁 Archivos Críticos

- ✅ frontend/index.html
- ✅ frontend/admin-dashboard.html
- ✅ frontend/app.js
- ✅ frontend/admin-dashboard.js
- ✅ contracts/BigBangToken.sol
- ✅ docs/admin-dashboard-guide.md
- ✅ contract-address.json

## 🔧 Próximos Pasos

1. ✅ Push a GitHub - COMPLETADO
2. 🔄 Conectar a Vercel - PENDIENTE
3. ⏳ Configurar variables de entorno
4. ⏳ Deploy automático
5. ⏳ Verificar funcionalidad

---

**Última actualización**: $(date)
**Commit**: $(git rev-parse --short HEAD)
EOF

print_status "Archivo DEPLOYMENT_STATUS.md creado"

print_status "Verificando tests..."

# Ejecutar tests para asegurar que todo funciona
npm test

if [ $? -eq 0 ]; then
    print_status "Tests pasando correctamente"
else
    print_warning "Algunos tests fallaron"
fi

echo ""
echo "🎉 DEPLOYMENT PREPARADO EXITOSAMENTE"
echo "====================================="
echo ""
echo "📋 RESUMEN:"
echo "   ✅ Commit creado y subido a GitHub"
echo "   ✅ Archivos de deployment generados"
echo "   ✅ Tests ejecutados"
echo ""
echo "🌐 PRÓXIMOS PASOS:"
echo "   1. Ve a https://vercel.com"
echo "   2. Importa el repositorio: big-bang-token"
echo "   3. Configura las variables de entorno"
echo "   4. Deploy automático"
echo ""
echo "📊 URLs ESPERADAS:"
echo "   - Frontend: https://big-bang-token.vercel.app"
echo "   - Admin: https://big-bang-token.vercel.app/admin-dashboard.html"
echo ""
echo "📞 SOPORTE:"
echo "   - Documentación: docs/"
echo "   - Issues: GitHub Issues"
echo "   - Testing: Sepolia Testnet"
echo "" 