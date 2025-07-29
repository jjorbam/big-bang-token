// 🔧 FIX PARA CONEXIÓN DE WALLET EN VERCEL
// Este archivo contiene mejoras para resolver problemas de conexión de wallet en Vercel

// Función mejorada para conectar wallet
async function connectWalletImproved() {
    console.log('🔗 Iniciando conexión de wallet mejorada...');
    
    // Verificar si estamos en Vercel
    const isVercel = window.location.hostname.includes('vercel.app');
    console.log('🌐 Detectado Vercel:', isVercel);
    
    // Detectar dispositivo
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    
    console.log('📱 Detección de dispositivo:');
    console.log('   Móvil:', isMobile);
    console.log('   iOS:', isIOS);
    console.log('   Chrome:', isChrome);
    console.log('   Safari:', isSafari);
    
    // Verificar si ethereum está disponible
    if (!window.ethereum) {
        console.log('❌ window.ethereum no está disponible');
        
        // En Vercel, a veces hay problemas con la detección de MetaMask
        if (isVercel) {
            console.log('🌐 Detectado Vercel - aplicando fixes específicos...');
            
            // Intentar detectar MetaMask de diferentes maneras
            if (typeof window.ethereum !== 'undefined') {
                console.log('✅ window.ethereum detectado después de retry');
            } else if (typeof ethereum !== 'undefined') {
                console.log('✅ ethereum global detectado');
                window.ethereum = ethereum;
            } else {
                console.log('❌ No se pudo detectar ethereum');
                showMetaMaskInstallInstructions();
                return;
            }
        } else {
            showMetaMaskInstallInstructions();
            return;
        }
    }
    
    try {
        showLoading('Conectando wallet...');
        
        // Verificar si MetaMask está instalado
        const isMetaMaskInstalled = window.ethereum && window.ethereum.isMetaMask;
        console.log('🦊 MetaMask instalado:', isMetaMaskInstalled);
        
        // Solicitar cuentas con timeout
        console.log('✅ Solicitando cuentas...');
        const accounts = await Promise.race([
            window.ethereum.request({ method: 'eth_requestAccounts' }),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout: MetaMask no respondió')), 10000)
            )
        ]);
        
        console.log('📋 Cuentas disponibles:', accounts);
        
        if (!accounts || accounts.length === 0) {
            hideLoading();
            showError('No se encontraron cuentas en MetaMask. Asegúrate de tener al menos una cuenta configurada.');
            return;
        }
        
        // Si hay múltiples cuentas, mostrar selector
        if (accounts.length > 1) {
            console.log('🎯 Mostrando selector de cuentas...');
            await showAccountSelector(accounts);
        } else {
            // Conectar directamente si solo hay una cuenta
            await connectSelectedAccount(accounts[0]);
        }
        
    } catch (error) {
        console.error('❌ Error conectando wallet:', error);
        hideLoading();
        
        // Manejar errores específicos
        if (error.code === 4001) {
            showError('Conexión cancelada por el usuario');
        } else if (error.code === -32002) {
            showError('MetaMask ya está procesando una solicitud. Por favor, revisa la extensión.');
        } else if (error.message.includes('Timeout')) {
            showError('MetaMask no respondió. Verifica que la extensión esté activa.');
        } else if (error.message.includes('User rejected')) {
            showError('Conexión rechazada por el usuario');
        } else {
            showError('Error al conectar: ' + error.message);
        }
    }
}

// Función para verificar el estado de MetaMask
async function checkMetaMaskStatus() {
    console.log('🔍 Verificando estado de MetaMask...');
    
    if (!window.ethereum) {
        console.log('❌ window.ethereum no disponible');
        return { available: false, reason: 'MetaMask no instalado' };
    }
    
    try {
        // Verificar si MetaMask está instalado
        const isMetaMask = window.ethereum.isMetaMask;
        console.log('🦊 Es MetaMask:', isMetaMask);
        
        // Verificar si está conectado
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const isConnected = accounts && accounts.length > 0;
        console.log('🔗 Conectado:', isConnected);
        
        // Verificar red
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        console.log('🌐 Chain ID:', chainId);
        
        return {
            available: true,
            isMetaMask: isMetaMask,
            isConnected: isConnected,
            accounts: accounts,
            chainId: chainId
        };
    } catch (error) {
        console.error('❌ Error verificando MetaMask:', error);
        return { available: false, reason: error.message };
    }
}

// Función para manejar cambios de red
async function handleNetworkChange() {
    console.log('🌐 Manejando cambio de red...');
    
    try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        console.log('🔄 Nueva Chain ID:', chainId);
        
        // Verificar si estamos en la red correcta (Sepolia)
        const sepoliaChainId = '0xaa36a7'; // 11155111 en decimal
        
        if (chainId !== sepoliaChainId) {
            console.log('⚠️ Red incorrecta detectada');
            showError('Por favor, cambia a la red Sepolia en MetaMask');
            
            // Intentar cambiar a Sepolia automáticamente
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: sepoliaChainId }]
                });
                console.log('✅ Cambiado a Sepolia automáticamente');
            } catch (switchError) {
                console.log('❌ Error cambiando red:', switchError);
                
                // Si la red no está configurada, añadirla
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: sepoliaChainId,
                                chainName: 'Sepolia',
                                nativeCurrency: {
                                    name: 'Sepolia Ether',
                                    symbol: 'SEP',
                                    decimals: 18
                                },
                                rpcUrls: ['https://sepolia.infura.io/v3/your-project-id'],
                                blockExplorerUrls: ['https://sepolia.etherscan.io']
                            }]
                        });
                        console.log('✅ Red Sepolia añadida');
                    } catch (addError) {
                        console.log('❌ Error añadiendo red:', addError);
                        showError('Por favor, añade la red Sepolia manualmente en MetaMask');
                    }
                }
            }
        } else {
            console.log('✅ Red correcta (Sepolia)');
        }
    } catch (error) {
        console.error('❌ Error manejando cambio de red:', error);
    }
}

// Función para reinicializar la conexión
async function reinitializeConnection() {
    console.log('🔄 Reinicializando conexión...');
    
    // Limpiar estado actual
    web3 = null;
    bigBangContract = null;
    userAccount = null;
    
    // Verificar estado de MetaMask
    const status = await checkMetaMaskStatus();
    console.log('📊 Estado de MetaMask:', status);
    
    if (!status.available) {
        showError('MetaMask no está disponible: ' + status.reason);
        return;
    }
    
    if (!status.isConnected) {
        showError('MetaMask no está conectado. Por favor, conecta tu wallet.');
        return;
    }
    
    // Intentar reconectar
    try {
        await connectWalletImproved();
    } catch (error) {
        console.error('❌ Error reinicializando conexión:', error);
        showError('Error al reconectar: ' + error.message);
    }
}

// Función para debug de conexión
function debugWalletConnection() {
    console.log('🔍 DEBUG: Información de conexión de wallet');
    console.log('🌐 Hostname:', window.location.hostname);
    console.log('🔗 Protocolo:', window.location.protocol);
    console.log('📱 User Agent:', navigator.userAgent);
    console.log('🦊 window.ethereum:', !!window.ethereum);
    
    if (window.ethereum) {
        console.log('🦊 isMetaMask:', window.ethereum.isMetaMask);
        console.log('🦊 isConnected:', window.ethereum.isConnected());
        console.log('🦊 selectedAddress:', window.ethereum.selectedAddress);
        console.log('🦊 networkVersion:', window.ethereum.networkVersion);
    }
    
    // Verificar si estamos en Vercel
    const isVercel = window.location.hostname.includes('vercel.app');
    console.log('🌐 Es Vercel:', isVercel);
    
    // Verificar Content Security Policy
    const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (meta) {
        console.log('🛡️ CSP:', meta.content);
    } else {
        console.log('🛡️ CSP: No configurado');
    }
}

// Exportar funciones para uso global
window.connectWalletImproved = connectWalletImproved;
window.checkMetaMaskStatus = checkMetaMaskStatus;
window.handleNetworkChange = handleNetworkChange;
window.reinitializeConnection = reinitializeConnection;
window.debugWalletConnection = debugWalletConnection;

console.log('🔧 Wallet Connect Fix cargado'); 