#!/bin/bash

echo "🚀 BIG BANG Token - Servidor de Desarrollo Móvil"
echo "=================================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "frontend/index.html" ]; then
    echo "❌ Error: Ejecuta este script desde el directorio raíz del proyecto"
    exit 1
fi

# Obtener la IP local
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)

echo "📱 Configuración para móvil:"
echo "   IP Local: $LOCAL_IP"
echo "   Puerto: 8003"
echo "   URL: http://$LOCAL_IP:8003"
echo ""

echo "🌐 Para acceder desde móvil:"
echo "   1. Asegúrate de que tu móvil esté en la misma red WiFi"
echo "   2. Abre Safari/Chrome en tu móvil"
echo "   3. Ve a: http://$LOCAL_IP:8003"
echo ""

echo "🔄 Iniciando servidor..."
echo "   Presiona Ctrl+C para detener"
echo ""

# Navegar al directorio frontend y iniciar servidor
cd frontend
python3 -m http.server 8003 --bind 0.0.0.0 