#!/bin/bash

echo "🚀 Iniciando BIG BANG Token - Entorno de Desarrollo"
echo "=================================================="

# Verificar si el nodo Hardhat está corriendo
if ! pgrep -f "hardhat node" > /dev/null; then
    echo "📡 Iniciando nodo Hardhat..."
    npm run node &
    sleep 5
else
    echo "✅ Nodo Hardhat ya está corriendo"
fi

# Verificar si el contrato está desplegado
if [ ! -f "contract-address.json" ]; then
    echo "🔨 Desplegando contrato..."
    npm run deploy
fi

echo "🌐 Iniciando servidor frontend..."
echo "📱 Abre http://localhost:8000 en tu navegador"
echo "🔗 Contrato: $(jq -r '.address' contract-address.json)"

cd frontend
python3 -m http.server 8000 