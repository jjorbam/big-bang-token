// Script de debug para conexión de wallet
console.log('🔧 Iniciando debug de wallet...');

// Función para limpiar caché de MetaMask
function clearMetaMaskCache() {
    console.log('🧹 Limpiando caché de MetaMask...');
    
    // Forzar desconexión
    if (window.ethereum) {
        // Remover listeners
        window.ethereum.removeAllListeners();
        console.log('✅ Listeners removidos');
    }
    
    // Limpiar localStorage
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('selectedAccount');
    console.log('✅ localStorage limpiado');
    
    return true;
}

// Función para verificar red
async function checkNetwork() {
    if (!window.ethereum) {
        console.log('❌ MetaMask no detectado');
        return false;
    }
    
    try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const networkId = parseInt(chainId, 16);
        console.log('🌐 Red actual:', networkId);
        
        if (networkId === 11155111) {
            console.log('✅ Conectado a Sepolia');
            return true;
        } else {
            console.log('❌ No estás en Sepolia. Red actual:', networkId);
            return false;
        }
    } catch (error) {
        console.log('❌ Error verificando red:', error);
        return false;
    }
}

// Función para cambiar a Sepolia
async function switchToSepolia() {
    if (!window.ethereum) {
        console.log('❌ MetaMask no detectado');
        return false;
    }
    
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], // Sepolia chainId
        });
        console.log('✅ Cambiado a Sepolia');
        return true;
    } catch (switchError) {
        // Si la red no existe, agregarla
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0xaa36a7',
                        chainName: 'Sepolia',
                        nativeCurrency: {
                            name: 'Sepolia Ether',
                            symbol: 'SEP',
                            decimals: 18
                        },
                        rpcUrls: ['https://sepolia.infura.io/v3/d435f483f92e4b898b203517d0d5e9bf'],
                        blockExplorerUrls: ['https://sepolia.etherscan.io']
                    }]
                });
                console.log('✅ Sepolia agregada y conectada');
                return true;
            } catch (addError) {
                console.log('❌ Error agregando Sepolia:', addError);
                return false;
            }
        } else {
            console.log('❌ Error cambiando a Sepolia:', switchError);
            return false;
        }
    }
}

// Función para conectar wallet específica
async function connectSpecificWallet(targetAddress) {
    if (!window.ethereum) {
        console.log('❌ MetaMask no detectado');
        return false;
    }
    
    try {
        // Solicitar conexión
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        
        console.log('📋 Cuentas disponibles:', accounts);
        
        // Verificar si la cuenta objetivo está disponible
        const targetAccount = accounts.find(acc => 
            acc.toLowerCase() === targetAddress.toLowerCase()
        );
        
        if (targetAccount) {
            console.log('✅ Wallet objetivo encontrada:', targetAccount);
            return targetAccount;
        } else {
            console.log('❌ Wallet objetivo no encontrada. Cuentas disponibles:', accounts);
            console.log('🎯 Wallet objetivo:', targetAddress);
            
            // Mostrar selector de cuentas
            if (typeof showAccountSelector === 'function') {
                const selectedAccount = await showAccountSelector(accounts, targetAddress);
                if (selectedAccount) {
                    console.log('✅ Wallet seleccionada manualmente:', selectedAccount);
                    return selectedAccount;
                }
            }
            
            return false;
        }
    } catch (error) {
        console.log('❌ Error conectando wallet:', error);
        return false;
    }
}

// Función para verificar el estado de las wallets
async function checkWalletStatus() {
    console.log('🔍 Verificando estado de las wallets...');
    
    try {
        // Verificar si MetaMask está instalado
        if (!window.ethereum) {
            console.log('❌ MetaMask no está instalado');
            return;
        }

        // Obtener todas las cuentas (incluyendo las bloqueadas)
        const accounts = await window.ethereum.request({
            method: 'eth_accounts'
        });

        console.log('📋 Cuentas disponibles:', accounts);
        console.log('📊 Total de cuentas:', accounts.length);

        // Intentar obtener cuentas con eth_requestAccounts (solo desbloqueadas)
        try {
            const unlockedAccounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            console.log('🔓 Cuentas desbloqueadas:', unlockedAccounts);
            console.log('📊 Total de cuentas desbloqueadas:', unlockedAccounts.length);
            
            if (unlockedAccounts.length < accounts.length) {
                console.log('⚠️ Hay cuentas bloqueadas. Necesitas desbloquearlas en MetaMask.');
                console.log('💡 Para desbloquear:');
                console.log('   1. Abre MetaMask');
                console.log('   2. Ve a Settings > Security & Privacy');
                console.log('   3. Desbloquea las cuentas que necesites');
            }
        } catch (error) {
            console.log('❌ Error al obtener cuentas desbloqueadas:', error.message);
        }

        // Verificar cuentas disponibles (sin wallet específica por seguridad)
        console.log('📋 Cuentas disponibles para conexión:', accounts.length);
        
        if (accounts.length === 0) {
            console.log('❌ No hay cuentas disponibles para conectar');
        } else {
            console.log('✅ Hay cuentas disponibles para conectar');
        }

    } catch (error) {
        console.log('❌ Error verificando wallets:', error.message);
    }
}

// Función para forzar la actualización de cuentas
async function refreshAccounts() {
    console.log('🔄 Forzando actualización de cuentas...');
    
    try {
        // Desconectar y reconectar para forzar actualización
        await window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }]
        });
        
        console.log('✅ Permisos actualizados');
        await checkWalletStatus();
        
    } catch (error) {
        console.log('❌ Error actualizando permisos:', error.message);
    }
}

// Función para mostrar instrucciones de desbloqueo
function showUnlockInstructions() {
    const instructions = `
🔓 INSTRUCCIONES PARA DESBLOQUEAR WALLETS:

1. Abre la extensión de MetaMask
2. Haz clic en el icono de configuración (⚙️)
3. Ve a "Settings" > "Security & Privacy"
4. Busca la sección "Account Management"
5. Desbloquea las cuentas que necesites
6. O simplemente haz clic en cada cuenta para desbloquearla

💡 También puedes:
- Hacer clic derecho en una cuenta bloqueada
- Seleccionar "Unlock Account"
- Introducir tu contraseña

🔄 Después de desbloquear, recarga la página.
    `;
    
    console.log(instructions);
    alert('Revisa la consola para ver las instrucciones de desbloqueo');
}

// Función principal mejorada
async function debugWallet() {
    console.log('🚀 Iniciando debug completo de wallet...');
    
    // Limpiar cache
    await clearMetaMaskCache();
    
    // Verificar red
    await checkNetwork();
    
    // Verificar estado de wallets
    await checkWalletStatus();
    
    // Mostrar instrucciones si es necesario
    showUnlockInstructions();
    
    console.log('✅ Debug completado. Revisa los logs arriba.');
}

// Exponer funciones globalmente
window.debugWallet = debugWallet;
window.clearMetaMaskCache = clearMetaMaskCache;
window.checkNetwork = checkNetwork;
window.switchToSepolia = switchToSepolia;
window.connectSpecificWallet = connectSpecificWallet;
window.checkWalletStatus = checkWalletStatus;
window.refreshAccounts = refreshAccounts;
window.showUnlockInstructions = showUnlockInstructions;

console.log('🔧 Script de debug cargado. Usa debugWallet() en la consola'); 