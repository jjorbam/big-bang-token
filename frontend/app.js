// Configuración global
let web3;
let bigBangContract;
let userAccount;
let contractAddress;
let walletConnectProvider;

// Detección de dispositivo
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
const isChrome = /Chrome/i.test(navigator.userAgent);
const isSafari = /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);

// ABI completo del contrato BigBangToken
const CONTRACT_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "initialOwner",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "allowance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "ERC20InsufficientAllowance",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "ERC20InsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "approver",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidApprover",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidReceiver",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidSender",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidSpender",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "lockPeriod",
                "type": "uint256"
            }
        ],
        "name": "Staked",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "reward",
                "type": "uint256"
            }
        ],
        "name": "Unstaked",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newRewardRate",
                "type": "uint256"
            }
        ],
        "name": "RewardRateUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "TokensMinted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "TokensBurned",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "burn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "burnFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "stakingDays",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "rate",
                "type": "uint256"
            }
        ],
        "name": "calculateReward",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "emergencyWithdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "stakingDays",
                "type": "uint256"
            }
        ],
        "name": "getClosestPeriod",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getUserStakes",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "startTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "endTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "claimed",
                        "type": "bool"
                    }
                ],
                "internalType": "struct BigBangToken.StakeInfo[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "periodInDays",
                "type": "uint256"
            }
        ],
        "name": "isPeriodValid",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paused",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "periodInDays",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "rate",
                "type": "uint256"
            }
        ],
        "name": "addStakingPeriod",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "periodInDays",
                "type": "uint256"
            }
        ],
        "name": "rewardRates",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "periodInDays",
                "type": "uint256"
            }
        ],
        "name": "stake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "stakingPeriods",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalStaked",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "unpause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "stakeIndex",
                "type": "uint256"
            }
        ],
        "name": "unstake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "periodInDays",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "newRate",
                "type": "uint256"
            }
        ],
        "name": "updateRewardRate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Usar configuración global
const NETWORKS = window.CONFIG ? window.CONFIG.NETWORKS : {
    1: { name: "Ethereum Mainnet", explorer: "https://etherscan.io" },
    11155111: { name: "Sepolia Testnet", explorer: "https://sepolia.etherscan.io" },
    137: { name: "Polygon", explorer: "https://polygonscan.com" },
    56: { name: "BSC", explorer: "https://bscscan.com" },
    31337: { name: "Hardhat Local", explorer: "" }
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM cargado, inicializando aplicación...');
    initializeLanguage();
    initializeApp();
    setupEventListeners();
    loadContractAddress();
    console.log('✅ Aplicación inicializada correctamente');
});

// Función para inicializar el idioma
function initializeLanguage() {
    // Obtener idioma guardado o usar español por defecto
    const savedLanguage = localStorage.getItem('language') || 'es';
    
    // Configurar el selector de idioma
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = savedLanguage;
        
        // Event listener para cambio de idioma
        languageSelect.addEventListener('change', function() {
            const selectedLanguage = this.value;
            changeLanguage(selectedLanguage);
        });
    }
    
    // Aplicar idioma inicial
    updatePageLanguage(savedLanguage);
}

// Inicializar la aplicación
async function initializeApp() {
    console.log('🚀 Inicializando BIG BANG Token App...');
    
    // Verificar si estamos regresando de MetaMask Mobile
    checkIfReturningFromMetaMask();
    
    // Verificar si MetaMask está instalado
    if (typeof window.ethereum !== 'undefined') {
        console.log('✅ MetaMask detectado');
        await connectWallet();
    } else {
        console.log('❌ MetaMask no detectado');
        showError('Por favor instala MetaMask para usar esta aplicación');
    }
}

// Función para verificar si estamos regresando de MetaMask Mobile
function checkIfReturningFromMetaMask() {
    console.log('🔍 Verificando si regresamos de MetaMask Mobile...');
    
    const isConnecting = localStorage.getItem('metamask_connecting');
    const connectTime = localStorage.getItem('metamask_connect_time');
    
    if (isConnecting && connectTime) {
        const timeDiff = Date.now() - parseInt(connectTime);
        
        // Si han pasado menos de 5 minutos, verificar conexión
        if (timeDiff < 5 * 60 * 1000) {
            console.log('🔄 Detectado regreso de MetaMask Mobile');
            
            // Esperar un poco para que MetaMask se inicialice
            setTimeout(() => {
                checkMobileConnection();
            }, 2000);
        } else {
            // Limpiar estado si ha pasado mucho tiempo
            localStorage.removeItem('metamask_connecting');
            localStorage.removeItem('metamask_connect_time');
        }
    }
}

// Configurar event listeners
function setupEventListeners() {
    console.log('🔗 Configurando event listeners...');
    
    // Navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            showSection(target);
            updateActiveNav(this);
            
            // Cerrar menú móvil después de navegar
            const mobileNav = document.getElementById('mobileNav');
            if (mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
            }
        });
    });

    // Menú móvil toggle
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const mobileNav = document.getElementById('mobileNav');
            mobileNav.classList.toggle('active');
        });
    }

    // Cerrar menú móvil al hacer clic fuera
    document.addEventListener('click', (e) => {
        const mobileNav = document.getElementById('mobileNav');
        const menuToggle = document.getElementById('menuToggle');
        
        if (!mobileNav.contains(e.target) && !menuToggle.contains(e.target)) {
            mobileNav.classList.remove('active');
        }
    });

    // Wallet
    const connectWalletBtn = document.getElementById('connectWallet');
    const disconnectWalletBtn = document.getElementById('disconnectWallet');
    
    console.log('📋 Botones wallet encontrados:');
    console.log('- Conectar:', connectWalletBtn);
    console.log('- Desconectar:', disconnectWalletBtn);
    
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', function() {
            console.log('🔗 Botón conectar wallet clickeado');
            connectWallet();
        });
        console.log('✅ Event listener agregado al botón conectar');
    } else {
        console.error('❌ Botón conectar wallet no encontrado');
    }
    
    if (disconnectWalletBtn) {
        disconnectWalletBtn.addEventListener('click', disconnectWallet);
        console.log('✅ Event listener agregado al botón desconectar');
    } else {
        console.error('❌ Botón desconectar wallet no encontrado');
    }

    // Formularios
    const stakingForm = document.getElementById('stakingForm');
    const transferForm = document.getElementById('transferForm');
    
    if (stakingForm) {
        stakingForm.addEventListener('submit', handleStaking);
        console.log('✅ Event listener agregado al formulario de staking');
    }
    
    if (transferForm) {
        transferForm.addEventListener('submit', handleTransfer);
        console.log('✅ Event listener agregado al formulario de transferencia');
    }

    // Botones MAX
    const maxAmountBtn = document.getElementById('maxAmount');
    const maxTransferBtn = document.getElementById('maxTransfer');
    
    if (maxAmountBtn) {
        maxAmountBtn.addEventListener('click', setMaxStakeAmount);
        console.log('✅ Event listener agregado al botón MAX staking');
    }
    
    if (maxTransferBtn) {
        maxTransferBtn.addEventListener('click', setMaxTransferAmount);
        console.log('✅ Event listener agregado al botón MAX transfer');
    }

    // Inputs para preview
    const stakeAmountInput = document.getElementById('stakeAmount');
    const stakePeriodInput = document.getElementById('stakePeriod');
    
    if (stakeAmountInput) {
        stakeAmountInput.addEventListener('input', updateStakingPreview);
        console.log('✅ Event listener agregado al input de cantidad');
    }
    
    if (stakePeriodInput) {
        stakePeriodInput.addEventListener('change', updateStakingPreview);
        console.log('✅ Event listener agregado al select de período');
    }
    
    console.log('✅ Todos los event listeners configurados');
}

// Cargar dirección del contrato
async function loadContractAddress() {
    try {
        // Usar configuración global si está disponible
        if (window.CONFIG && window.CONFIG.CONTRACT_ADDRESS) {
            contractAddress = window.CONFIG.CONTRACT_ADDRESS;
            console.log('📋 Contrato cargado desde config:', contractAddress);
        } else {
            const response = await fetch('../contract-address.json');
            if (response.ok) {
                const data = await response.json();
                contractAddress = data.address;
                console.log('📋 Contrato cargado:', contractAddress);
            } else {
                console.log('⚠️ No se encontró contract-address.json, usando dirección por defecto');
                contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
            }
        }
        updateContractInfo();
    } catch (error) {
        console.log('⚠️ Error cargando contrato:', error);
        contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    }
}

// Conectar wallet
async function connectWallet() {
    console.log('🔗 Botón conectar wallet clickeado');
    
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
    
    // Si no hay ethereum, mostrar instrucciones
    if (!window.ethereum) {
        if (isIOS && isChrome) {
            showIOSChromeInstructions();
        } else if (isIOS && isSafari) {
            showIOSSafariInstructions();
        } else if (isMobile) {
            showMobileMetaMaskInstructions();
        } else {
            showMetaMaskInstallInstructions();
        }
        return;
    }
    
    try {
        showLoading('Conectando wallet...');
        
        // Solicitar cuentas
        console.log('✅ MetaMask detectado, solicitando cuentas...');
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        console.log('📋 Cuentas disponibles:', accounts);
        
        if (accounts.length === 0) {
            hideLoading();
            showError('No se encontraron cuentas en MetaMask');
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
        
        if (error.code === 4001) {
            showError('Conexión cancelada por el usuario');
        } else if (error.code === -32002) {
            showError('MetaMask ya está procesando una solicitud. Por favor, revisa la extensión.');
        } else {
            showError('Error al conectar: ' + error.message);
        }
    }
}

// Desconectar wallet
function disconnectWallet() {
    console.log('🔌 Desconectando wallet...');
    
    // Desconectar WalletConnect si está activo
    if (walletConnectProvider) {
        try {
            walletConnectProvider.disconnect();
            console.log('🔌 WalletConnect desconectado');
        } catch (error) {
            console.log('⚠️ Error desconectando WalletConnect:', error);
        }
        walletConnectProvider = null;
    }
    
    // Limpiar variables
    web3 = null;
    bigBangContract = null;
    userAccount = null;
    
    // Limpiar localStorage
    localStorage.removeItem('userAccount');
    localStorage.removeItem('metamask_connecting');
    localStorage.removeItem('metamask_connect_time');
    
    // Actualizar UI
    updateWalletUI();
    
    // Limpiar datos del usuario
    clearUserData();
    
    console.log('✅ Wallet desconectado completamente');
}

// Inicializar contrato
async function initializeContract() {
    if (!web3 || !contractAddress) {
        console.error('❌ Web3 o contractAddress no disponible');
        return false;
    }
    
    try {
        console.log('📦 Inicializando contrato en:', contractAddress);
        bigBangContract = new web3.eth.Contract(CONTRACT_ABI, contractAddress);
        
        // Verificar que el contrato existe
        const name = await bigBangContract.methods.name().call();
        console.log('✅ Contrato verificado:', name);
        
        // Verificar que estamos en la red correcta
        const chainId = await web3.eth.getChainId();
        console.log('🌐 Chain ID:', chainId);
        
        if (chainId !== 11155111) {
            console.warn('⚠️ No estás en Sepolia. Chain ID:', chainId);
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Error inicializando contrato:', error);
        
        // Verificar si es un error de red
        if (error.message.includes('Network') || error.message.includes('connection')) {
            showError('Error de conexión a la red. Asegúrate de estar en Sepolia.');
        } else if (error.message.includes('contract')) {
            showError('Error al conectar con el contrato. Verifica la dirección.');
        } else {
            showError('Error al conectar con el contrato: ' + error.message);
        }
        
        return false;
    }
}

// Manejar cambio de cuenta
function handleAccountChange(accounts) {
    if (accounts.length === 0) {
        disconnectWallet();
    } else {
        userAccount = accounts[0];
        updateWalletUI();
        loadUserData();
    }
}

// Manejar cambio de red
async function handleChainChange(chainId) {
    const networkId = parseInt(chainId, 16);
    console.log('🔄 Red cambiada a:', NETWORKS[networkId]?.name || 'Desconocida');
    
    // Recargar datos
    await loadUserData();
    updateNetworkInfo();
}

// Actualizar UI del wallet
function updateWalletUI() {
    const connectBtn = document.getElementById('connectWallet');
    const walletInfo = document.getElementById('walletInfo');
    const walletAddress = document.getElementById('walletAddress');
    const adminDashboardBtn = document.getElementById('adminDashboardBtn');
    
    if (userAccount) {
        connectBtn.style.display = 'none';
        walletInfo.style.display = 'flex';
        walletAddress.textContent = `${userAccount.substring(0, 6)}...${userAccount.substring(38)}`;
        
        // Verificar si es el owner para mostrar el botón de admin
        checkIfOwner();
    } else {
        connectBtn.style.display = 'flex';
        walletInfo.style.display = 'none';
        adminDashboardBtn.style.display = 'none';
    }
}

// Verificar si el usuario conectado es el owner
async function checkIfOwner() {
    if (!bigBangContract || !userAccount) return;
    
    try {
        const owner = await bigBangContract.methods.owner().call();
        const adminDashboardBtn = document.getElementById('adminDashboardBtn');
        
        if (userAccount.toLowerCase() === owner.toLowerCase()) {
            adminDashboardBtn.style.display = 'inline-block';
            adminDashboardBtn.onclick = () => {
                window.open('admin-dashboard.html', '_blank');
            };
        } else {
            adminDashboardBtn.style.display = 'none';
        }
    } catch (error) {
        console.error('Error verificando owner:', error);
    }
}

// Cargar datos del usuario
async function loadUserData() {
    if (!bigBangContract || !userAccount) return;
    
    try {
        // Balance de tokens
        const balance = await bigBangContract.methods.balanceOf(userAccount).call();
        const formattedBalance = web3.utils.fromWei(balance, 'ether');
        document.getElementById('tokenBalance').textContent = parseFloat(formattedBalance).toLocaleString();
        
        // Total en staking
        const totalStaked = await bigBangContract.methods.totalStaked().call();
        const formattedStaked = web3.utils.fromWei(totalStaked, 'ether');
        document.getElementById('totalStaked').textContent = `${parseFloat(formattedStaked).toLocaleString()} BBNG`;
        
        // Cargar stakes activos
        await loadUserStakes();
        
        // Actualizar información de red
        updateNetworkInfo();
        
    } catch (error) {
        console.error('❌ Error cargando datos del usuario:', error);
    }
}

// Cargar stakes del usuario
async function loadUserStakes() {
    if (!bigBangContract || !userAccount) return;
    
    try {
        const stakes = await bigBangContract.methods.getUserStakes().call({ from: userAccount });
        const stakesContainer = document.getElementById('activeStakes');
        
        if (stakes.length === 0) {
            stakesContainer.innerHTML = '<p class="no-data">No tienes stakes activos</p>';
            return;
        }
        
        let stakesHTML = '';
        stakes.forEach((stake, index) => {
            const amount = web3.utils.fromWei(stake.amount, 'ether');
            const startTime = new Date(stake.startTime * 1000);
            const endTime = new Date(stake.endTime * 1000);
            const now = new Date();
            const isCompleted = now >= endTime;
            const isClaimed = stake.claimed;
            
            const status = isClaimed ? 'completed' : (isCompleted ? 'ready' : 'active');
            const statusText = isClaimed ? 'Reclamado' : (isCompleted ? 'Listo para reclamar' : 'Activo');
            
            stakesHTML += `
                <div class="stake-item">
                    <div class="stake-header">
                        <span class="stake-amount">${parseFloat(amount).toLocaleString()} BBNG</span>
                        <span class="stake-status ${status}">${statusText}</span>
                    </div>
                    <div class="stake-details">
                        <div>Inicio: ${startTime.toLocaleDateString()}</div>
                        <div>Fin: ${endTime.toLocaleDateString()}</div>
                        <div>Período: ${Math.round((stake.endTime - stake.startTime) / (24 * 60 * 60))} días</div>
                        <div>Estado: ${isClaimed ? 'Reclamado' : (isCompleted ? 'Completado' : 'En progreso')}</div>
                    </div>
                    ${!isClaimed && isCompleted ? `
                        <div class="stake-actions">
                            <button class="btn btn-primary" onclick="claimStake(${index})">
                                <i class="fas fa-unlock"></i> Reclamar
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        });
        
        stakesContainer.innerHTML = stakesHTML;
        
    } catch (error) {
        console.error('❌ Error cargando stakes:', error);
    }
}

// Reclamar stake
async function claimStake(stakeIndex) {
    if (!bigBangContract || !userAccount) return;
    
    try {
        showLoading('Reclamando stake...');
        
        await bigBangContract.methods.unstake(stakeIndex).send({ from: userAccount });
        
        hideLoading();
        showSuccess('Stake reclamado exitosamente');
        await loadUserData();
        
    } catch (error) {
        console.error('❌ Error reclamando stake:', error);
        hideLoading();
        showError('Error al reclamar stake: ' + error.message);
    }
}

// Manejar staking
async function handleStaking(e) {
    e.preventDefault();
    
    if (!bigBangContract || !userAccount) {
        showError('Por favor conecta tu wallet primero');
        return;
    }
    
    const amount = document.getElementById('stakeAmount').value;
    const period = parseInt(document.getElementById('stakePeriod').value);
    
    if (!amount || amount <= 0) {
        showError('Por favor ingresa una cantidad válida');
        return;
    }
    
    try {
        showLoading('Haciendo staking...');
        
        const amountWei = web3.utils.toWei(amount, 'ether');
        await bigBangContract.methods.stake(amountWei, period).send({ from: userAccount });
        
        hideLoading();
        showSuccess('Staking realizado exitosamente');
        
        // Limpiar formulario
        document.getElementById('stakeAmount').value = '';
        updateStakingPreview();
        
        // Recargar datos
        await loadUserData();
        
    } catch (error) {
        console.error('❌ Error haciendo staking:', error);
        hideLoading();
        showError('Error al hacer staking: ' + error.message);
    }
}

// Manejar transferencia
async function handleTransfer(e) {
    e.preventDefault();
    
    if (!bigBangContract || !userAccount) {
        showError('Por favor conecta tu wallet primero');
        return;
    }
    
    const recipient = document.getElementById('recipientAddress').value;
    const amount = document.getElementById('transferAmount').value;
    
    if (!recipient || !web3.utils.isAddress(recipient)) {
        showError('Por favor ingresa una dirección válida');
        return;
    }
    
    if (!amount || amount <= 0) {
        showError('Por favor ingresa una cantidad válida');
        return;
    }
    
    try {
        showLoading('Transferiendo tokens...');
        
        const amountWei = web3.utils.toWei(amount, 'ether');
        await bigBangContract.methods.transfer(recipient, amountWei).send({ from: userAccount });
        
        hideLoading();
        showSuccess('Transferencia realizada exitosamente');
        
        // Limpiar formulario
        document.getElementById('recipientAddress').value = '';
        document.getElementById('transferAmount').value = '';
        
        // Recargar datos
        await loadUserData();
        
    } catch (error) {
        console.error('❌ Error transfiriendo:', error);
        hideLoading();
        showError('Error al transferir: ' + error.message);
    }
}

// Actualizar preview de staking
function updateStakingPreview() {
    const amount = parseFloat(document.getElementById('stakeAmount').value) || 0;
    const period = parseInt(document.getElementById('stakePeriod').value) || 30;
    
    if (amount > 0) {
        // Calcular recompensa estimada (simplificado)
        const rate = period === 30 ? 5 : period === 90 ? 10 : period === 180 ? 15 : 20;
        const reward = (amount * rate * period) / (100 * 365);
        
        document.getElementById('estimatedReward').textContent = `${reward.toFixed(2)} BBNG`;
        
        // Calcular fecha de finalización
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + period);
        document.getElementById('endDate').textContent = endDate.toLocaleDateString();
    } else {
        document.getElementById('estimatedReward').textContent = '0 BBNG';
        document.getElementById('endDate').textContent = '-';
    }
}

// Establecer cantidad máxima para staking
async function setMaxStakeAmount() {
    if (!bigBangContract || !userAccount) return;
    
    try {
        const balance = await bigBangContract.methods.balanceOf(userAccount).call();
        const formattedBalance = web3.utils.fromWei(balance, 'ether');
        document.getElementById('stakeAmount').value = formattedBalance;
        updateStakingPreview();
    } catch (error) {
        console.error('❌ Error obteniendo balance:', error);
    }
}

// Establecer cantidad máxima para transferencia
async function setMaxTransferAmount() {
    if (!bigBangContract || !userAccount) return;
    
    try {
        const balance = await bigBangContract.methods.balanceOf(userAccount).call();
        const formattedBalance = web3.utils.fromWei(balance, 'ether');
        document.getElementById('transferAmount').value = formattedBalance;
    } catch (error) {
        console.error('❌ Error obteniendo balance:', error);
    }
}

// Actualizar información del contrato
async function updateContractInfo() {
    if (!bigBangContract) return;
    
    try {
        const maxSupply = await bigBangContract.methods.getMaxSupply().call();
        const totalSupply = await bigBangContract.methods.totalSupply().call();
        const totalStaked = await bigBangContract.methods.totalStaked().call();
        
        document.getElementById('maxSupply').textContent = web3.utils.fromWei(maxSupply, 'ether') + ' BBNG';
        document.getElementById('totalSupply').textContent = web3.utils.fromWei(totalSupply, 'ether') + ' BBNG';
        document.getElementById('globalTotalStaked').textContent = web3.utils.fromWei(totalStaked, 'ether') + ' BBNG';
        
    } catch (error) {
        console.error('❌ Error actualizando información del contrato:', error);
    }
}

// Actualizar información de red
async function updateNetworkInfo() {
    if (!web3) return;
    
    try {
        const chainId = await web3.eth.getChainId();
        const network = NETWORKS[chainId];
        
        document.getElementById('networkName').textContent = network ? network.name : 'Desconocida';
        document.getElementById('contractAddress').textContent = contractAddress ? 
            `${contractAddress.substring(0, 6)}...${contractAddress.substring(38)}` : '-';
        
    } catch (error) {
        console.error('❌ Error actualizando información de red:', error);
    }
}

// Limpiar datos del usuario
function clearUserData() {
    document.getElementById('tokenBalance').textContent = '0';
    document.getElementById('totalStaked').textContent = '0 BBNG';
    document.getElementById('pendingRewards').textContent = '0 BBNG';
    document.getElementById('activeStakes').innerHTML = '<p class="no-data" data-i18n="no_active_stakes">No tienes stakes activos</p>';
}

// Mostrar sección
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Actualizar navegación activa
function updateActiveNav(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// Función para mostrar/ocultar botón de emergencia
function toggleEmergencyButton(show = false) {
    const emergencyBtn = document.getElementById('emergencyCleanup');
    if (emergencyBtn) {
        emergencyBtn.style.display = show ? 'block' : 'none';
    }
}

// Función de limpieza de emergencia
function emergencyCleanup() {
    console.log('🧹 Limpieza de emergencia...');
    
    // Cerrar todos los modales
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
    });
    
    // Limpiar cualquier elemento de loading
    const loadingElements = document.querySelectorAll('[id*="loading"]');
    loadingElements.forEach(element => {
        if (document.body.contains(element)) {
            document.body.removeChild(element);
        }
    });
    
    // Ocultar botón de emergencia
    toggleEmergencyButton(false);
    
    showSuccess('Limpieza completada. Puedes intentar conectar de nuevo.');
}

// Mostrar loading
function showLoading(message) {
    // Limpiar cualquier modal de loading existente
    const existingLoading = document.getElementById('loadingModal');
    if (existingLoading) {
        document.body.removeChild(existingLoading);
    }
    
    // Crear nuevo modal de loading
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'loadingModal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="loading-spinner"></div>
            <h3>Procesando...</h3>
            <p id="loadingMessage">${message}</p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Mostrar botón de emergencia después de 5 segundos
    setTimeout(() => {
        toggleEmergencyButton(true);
    }, 5000);
    
    // Auto-ocultar después de 30 segundos para evitar que se quede colgado
    setTimeout(() => {
        const currentLoading = document.getElementById('loadingModal');
        if (currentLoading && document.body.contains(currentLoading)) {
            document.body.removeChild(currentLoading);
            showError('Operación cancelada por timeout. Por favor, intenta de nuevo.');
            toggleEmergencyButton(false);
        }
    }, 30000);
}

// Ocultar loading
function hideLoading() {
    const loadingModal = document.getElementById('loadingModal');
    if (loadingModal) {
        document.body.removeChild(loadingModal);
    }
    
    // Limpiar cualquier modal de selector de cuentas que pueda estar colgado
    const accountSelectorModal = document.getElementById('accountSelectorModal');
    if (accountSelectorModal) {
        document.body.removeChild(accountSelectorModal);
    }
    
    // Limpiar cualquier otro modal que pueda estar colgado
    const otherModals = document.querySelectorAll('.modal');
    otherModals.forEach(modal => {
        if (modal.id !== 'loadingModal' && modal.id !== 'accountSelectorModal') {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }
    });
    
    // Ocultar botón de emergencia
    toggleEmergencyButton(false);
}

// Mostrar modal de éxito
function showSuccess(message) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="success-icon">✅</div>
            <h3>Éxito</h3>
            <p>${message}</p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
    }, 3000);
}

// Mostrar modal de error
function showError(message) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="error-icon">❌</div>
            <h3>Error</h3>
            <p>${message}</p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
    }, 5000);
}

// Cerrar modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Función global para cerrar modales
window.closeModal = closeModal; 

// Mostrar selector de cuentas
async function showAccountSelector(accounts, targetWallet) {
    return new Promise((resolve) => {
        console.log('🎯 Creando modal de selector de cuentas...');
        
        // Crear modal
        const modal = document.createElement('div');
        modal.className = 'account-selector-modal';
        modal.id = 'accountSelectorModal';
        
        // Crear contenido del modal
        const modalContent = document.createElement('div');
        modalContent.className = 'account-selector-content';
        
        // Título
        const title = document.createElement('h3');
        title.className = 'account-selector-title';
        title.textContent = '🔗 Selecciona tu Wallet';
        modalContent.appendChild(title);
        
        // Descripción
        const description = document.createElement('p');
        description.className = 'account-selector-description';
        description.textContent = 'Elige la cuenta que quieres usar para conectar:';
        modalContent.appendChild(description);
        
        // Lista de cuentas
        const accountList = document.createElement('div');
        accountList.className = 'account-selector-list';
        
        // Agregar cada cuenta
        accounts.forEach((account, index) => {
            const isTarget = account.toLowerCase() === targetWallet.toLowerCase();
            const shortAddress = account.slice(0, 6) + '...' + account.slice(-4);
            
            const accountItem = document.createElement('div');
            accountItem.className = `account-selector-item ${isTarget ? 'target-account' : ''}`;
            
            // Información de la cuenta
            const accountInfo = document.createElement('div');
            
            const accountAddress = document.createElement('div');
            accountAddress.className = 'account-selector-address';
            accountAddress.textContent = shortAddress;
            accountInfo.appendChild(accountAddress);
            
            // Badge para cuenta objetivo
            if (isTarget) {
                const badge = document.createElement('span');
                badge.className = 'account-selector-badge';
                badge.textContent = 'Recomendada';
                accountInfo.appendChild(badge);
            }
            
            accountItem.appendChild(accountInfo);
            
            // Evento click
            accountItem.addEventListener('click', () => {
                console.log('✅ Cuenta seleccionada:', account);
                closeModal();
                resolve(account);
            });
            
            accountList.appendChild(accountItem);
        });
        
        modalContent.appendChild(accountList);
        
        // Botones de acción
        const actions = document.createElement('div');
        actions.className = 'account-selector-actions';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'account-selector-btn cancel';
        cancelBtn.textContent = 'Cancelar';
        cancelBtn.addEventListener('click', () => {
            console.log('❌ Selección cancelada');
            closeModal();
            resolve(null);
        });
        
        actions.appendChild(cancelBtn);
        modalContent.appendChild(actions);
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Función para cerrar modal
        function closeModal() {
            const modal = document.getElementById('accountSelectorModal');
            if (modal) {
                modal.remove();
            }
        }
        
        // Cerrar con Escape
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                resolve(null);
                document.removeEventListener('keydown', handleEscape);
            }
        };
        
        document.addEventListener('keydown', handleEscape);
        
        // Cerrar al hacer click fuera del modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
                resolve(null);
            }
        });
    });
}

// Función para conectar la cuenta seleccionada
async function connectSelectedAccount(selectedAccount) {
    try {
        showLoading('Conectando cuenta seleccionada...');
        console.log('🔗 Iniciando conexión con cuenta:', selectedAccount);
        
        userAccount = selectedAccount;
        console.log('👤 Cuenta conectada:', userAccount);
        console.log('📋 Estado después de asignar cuenta:', {
            userAccount: userAccount,
            web3: !!web3,
            contractAddress: contractAddress
        });
        
        // Verificar que estamos en Sepolia
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const networkId = parseInt(chainId, 16);
        
        if (networkId !== 11155111) {
            console.log('🔄 Cambiando a Sepolia...');
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0xaa36a7' }],
                });
            } catch (switchError) {
                if (switchError.code === 4902) {
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
                } else {
                    throw switchError;
                }
            }
        }
        
        // Inicializar Web3
        web3 = new Web3(window.ethereum);
        
        // Inicializar contrato
        const contractInitialized = await initializeContract();
        
        if (!contractInitialized) {
            hideLoading();
            showError('Error al inicializar el contrato. Verifica la conexión a la red.');
            return;
        }
        
        // Actualizar UI
        updateWalletUI();
        await loadUserData();
        
        // Escuchar cambios de cuenta
        window.ethereum.on('accountsChanged', handleAccountChange);
        window.ethereum.on('chainChanged', handleChainChange);
        
        hideLoading();
        showSuccess('Wallet conectada exitosamente');
        
    } catch (error) {
        hideLoading();
        console.error('❌ Error conectando cuenta seleccionada:', error);
        
        if (error.code === 4001) {
            showError('Conexión cancelada por el usuario.');
        } else if (error.code === -32002) {
            showError('Por favor, desbloquea MetaMask y vuelve a intentar.');
        } else if (error.message.includes('User rejected')) {
            showError('Conexión rechazada por el usuario.');
        } else {
            showError('Error al conectar cuenta: ' + error.message);
        }
    }
}

// Exponer funciones globalmente para debug
window.emergencyCleanup = emergencyCleanup;
window.toggleEmergencyButton = toggleEmergencyButton;
window.hideLoading = hideLoading;
window.showLoading = showLoading;
window.tryConnectMetaMaskMobile = tryConnectMetaMaskMobile;

// Función para intentar conectar con MetaMask Mobile desde Safari iOS
async function tryConnectMetaMaskMobile() {
    console.log('🔗 Intentando conectar con MetaMask Mobile...');
    
    try {
        showLoading('Conectando con MetaMask Mobile...');
        
        // Guardar estado de conexión en localStorage
        localStorage.setItem('metamask_connecting', 'true');
        localStorage.setItem('metamask_connect_time', Date.now().toString());
        
        // Intentar múltiples métodos según la documentación oficial
        const currentUrl = encodeURIComponent(window.location.href);
        
        // Método 1: Deep link directo (recomendado por MetaMask)
        const deepLink = `metamask://dapp/${currentUrl}`;
        console.log('🔗 Deep link creado:', deepLink);
        
        // Método 2: Universal link como fallback
        const universalLink = `https://metamask.app.link/dapp/${currentUrl}`;
        console.log('🔗 Universal link creado:', universalLink);
        
        // Intentar abrir MetaMask Mobile con deep link
        console.log('🔗 Intentando abrir MetaMask con deep link...');
        window.location.href = deepLink;
        
        // Detectar si se abrió correctamente
        const appOpened = await detectMetaMaskAppOpen();
        console.log('🔗 App abierta:', appOpened);
        
        if (!appOpened) {
            console.log('🔄 Intentando universal link como fallback');
            window.location.href = universalLink;
            
            // Detectar nuevamente
            await detectMetaMaskAppOpen();
        }
        
        // Esperar y verificar si regresamos
        setTimeout(() => {
            hideLoading();
            showSuccess('MetaMask Mobile abierto. Por favor, confirma la conexión en la app y regresa aquí.');
            
            // Verificar conexión cuando regresemos
            setTimeout(() => {
                console.log('🔄 Verificando conexión después de regresar...');
                checkMobileConnection();
            }, 3000);
            
        }, 2000);
        
    } catch (error) {
        hideLoading();
        console.error('❌ Error con deep link:', error);
        showError('Error al conectar con MetaMask Mobile. Intenta desde la app directamente.');
    }
}

// Función para verificar conexión después de regresar de MetaMask Mobile
async function checkMobileConnection() {
    console.log('🔍 Verificando conexión después de regresar de MetaMask Mobile...');
    
    try {
        // Verificar si MetaMask está disponible
        if (window.ethereum) {
            console.log('✅ MetaMask detectado después del deep link');
            
            // Intentar obtener cuentas
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            
            if (accounts && accounts.length > 0) {
                console.log('✅ Cuentas obtenidas:', accounts);
                
                // Conectar con la primera cuenta
                await connectSelectedAccount(accounts[0]);
                
                // Limpiar estado
                localStorage.removeItem('metamask_connecting');
                localStorage.removeItem('metamask_connect_time');
                
            } else {
                console.log('❌ No se obtuvieron cuentas');
                showError('No se pudieron obtener las cuentas. Por favor, intenta de nuevo.');
            }
        } else {
            console.log('❌ MetaMask no disponible después del deep link');
            showError('MetaMask no está disponible. Por favor, instala la app y vuelve a intentar.');
        }
        
    } catch (error) {
        console.error('❌ Error verificando conexión:', error);
        showError('Error al verificar la conexión. Por favor, intenta de nuevo.');
    }
}

// Función para detectar si MetaMask Mobile se abrió correctamente
function detectMetaMaskAppOpen() {
    return new Promise((resolve) => {
        const startTime = Date.now();
        
        // Verificar si la página se ocultó (indicando que se abrió la app)
        const checkVisibility = () => {
            if (document.hidden) {
                console.log('✅ MetaMask Mobile detectado como abierto');
                resolve(true);
            } else if (Date.now() - startTime > 3000) {
                console.log('❌ Timeout: MetaMask Mobile no se abrió');
                resolve(false);
            } else {
                setTimeout(checkVisibility, 100);
            }
        };
        
        checkVisibility();
    });
}

// Función para verificar si MetaMask Mobile está instalado
async function checkMetaMaskMobileInstalled() {
    return new Promise((resolve) => {
        // Intentar abrir MetaMask Mobile con un deep link de prueba
        const testUrl = 'metamask://';
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = testUrl;
        
        let timeout;
        const checkInstalled = () => {
            clearTimeout(timeout);
            document.body.removeChild(iframe);
            resolve(true);
        };
        
        timeout = setTimeout(() => {
            document.body.removeChild(iframe);
            resolve(false);
        }, 1000);
        
        iframe.onload = checkInstalled;
        iframe.onerror = () => {
            clearTimeout(timeout);
            document.body.removeChild(iframe);
            resolve(false);
        };
        
        document.body.appendChild(iframe);
    });
}

// Función para conectar via deep link
async function connectViaDeepLink() {
    try {
        showLoading('Conectando con MetaMask Mobile...');
        
        // Crear deep link para conectar wallet
        const deepLink = `metamask://dapp/${encodeURIComponent(window.location.href)}`;
        
        // Intentar abrir MetaMask Mobile
        window.location.href = deepLink;
        
        // Esperar respuesta
        setTimeout(() => {
            hideLoading();
            showSuccess('MetaMask Mobile abierto. Por favor, confirma la conexión en la app.');
        }, 2000);
        
    } catch (error) {
        hideLoading();
        console.error('❌ Error con deep link:', error);
        showError('Error al conectar con MetaMask Mobile. Intenta desde la app directamente.');
    }
}

// Función para mostrar instrucciones específicas para iOS en Safari
function showIOSSafariInstructions() {
    console.log('🍎 Mostrando instrucciones para iOS Safari...');
    
    const modalContent = `
        <div class="modal-content">
            <h3>📱 Conectar MetaMask en Safari iOS</h3>
            <h4>MetaMask no funciona directamente en Safari iOS</h4>
            
            <ol>
                <li><strong>Opción 1 (Recomendada):</strong> Usa la app MetaMask
                    <ul>
                        <li>Abre la app MetaMask en tu iPhone</li>
                        <li>Ve a Configuración → Navegador</li>
                        <li>Habilita el navegador interno</li>
                        <li>Regresa aquí desde la app MetaMask</li>
                    </ul>
                </li>
                <li><strong>Opción 2:</strong> Intenta conectar directamente
                    <ul>
                        <li>Presiona el botón de abajo</li>
                        <li>Si tienes MetaMask instalado, se abrirá</li>
                        <li>Confirma la conexión en la app</li>
                    </ul>
                </li>
            </ol>
            
            <div class="modal-actions">
                <button id="deepLinkBtn" class="btn btn-primary">
                    🔗 Conectar con MetaMask Mobile
                </button>
                <button class="btn btn-secondary" onclick="closeModal('iosSafariModal')">
                    ❌ Cancelar
                </button>
            </div>
        </div>
    `;
    
    // Crear modal
    const modal = document.createElement('div');
    modal.id = 'iosSafariModal';
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = modalContent;
    
    // Agregar al DOM
    document.body.appendChild(modal);
    
    // Agregar event listener al botón
    setTimeout(() => {
        const deepLinkBtn = document.getElementById('deepLinkBtn');
        if (deepLinkBtn) {
            console.log('🔗 Agregando event listener al botón deep link...');
            deepLinkBtn.addEventListener('click', () => {
                console.log('🔗 Botón deep link presionado');
                tryConnectMetaMaskMobile();
            });
        } else {
            console.log('❌ No se encontró el botón deep link');
        }
    }, 100);
    
    // Cerrar con Escape
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal('iosSafariModal');
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    console.log('✅ Modal de instrucciones iOS Safari mostrado');
}

// Función para mostrar instrucciones específicas para iOS en Chrome
function showIOSChromeInstructions() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'iosChromeModal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <h3>📱 iOS + Chrome = Problema</h3>
            <p>MetaMask no funciona en Chrome en iOS. Necesitas usar Safari o la app de MetaMask:</p>
            
            <div style="background: #1a1a1a; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h4 style="color: #00d4ff; margin-bottom: 15px;">🚀 Opción 1: Usar Safari</h4>
                <ol>
                    <li>Abre Safari en tu iPhone/iPad</li>
                    <li>Ve a esta misma web: <strong>big-bang-token.vercel.app</strong></li>
                    <li>Instala MetaMask desde App Store</li>
                    <li>Haz clic en "Conectar Wallet"</li>
                    <li>MetaMask se abrirá automáticamente</li>
                </ol>
            </div>
            
            <div style="background: #1a1a1a; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h4 style="color: #00d4ff; margin-bottom: 15px;">📱 Opción 2: Usar MetaMask App</h4>
                <ol>
                    <li>Instala MetaMask desde App Store</li>
                    <li>Abre la app MetaMask</li>
                    <li>Ve a la pestaña "Browser"</li>
                    <li>Navega a: <strong>big-bang-token.vercel.app</strong></li>
                    <li>Haz clic en "Conectar Wallet"</li>
                </ol>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                <a href="https://apps.apple.com/app/metamask/id1438144202" target="_blank" class="btn btn-primary" style="display: inline-block; margin: 10px;">
                    📥 Descargar MetaMask para iOS
                </a>
            </div>
            
            <div style="text-align: center; margin-top: 15px;">
                <button class="btn btn-secondary" onclick="closeModal('iosChromeModal')">
                    Entendido
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar con Escape
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal('iosChromeModal');
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Cerrar al hacer clic fuera del modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal('iosChromeModal');
        }
    });
}

// Función para mostrar instrucciones específicas para móviles
function showMobileMetaMaskInstructions() {
    console.log('📱 Mostrando instrucciones para móvil con Web3Modal...');
    
    const modalContent = `
        <div class="modal-content">
            <h3>📱 Conectar Wallet en Móvil</h3>
            <h4>Elige tu método preferido:</h4>
            
            <div style="margin: 20px 0;">
                <h4 style="color: #00d4ff; margin-bottom: 10px;">🎯 Opción 1: Web3Modal (Recomendado)</h4>
                <p>Conecta con cualquier wallet móvil usando Web3Modal:</p>
                <ul>
                    <li>MetaMask Mobile</li>
                    <li>Trust Wallet</li>
                    <li>Coinbase Wallet</li>
                    <li>WalletConnect</li>
                    <li>Y más de 200 wallets</li>
                </ul>
                <button id="web3ModalBtn" class="btn btn-primary" style="margin: 10px 0;">
                    🔗 Conectar con Web3Modal
                </button>
            </div>
            
            <div style="margin: 20px 0;">
                <h4 style="color: #00d4ff; margin-bottom: 10px;">�� Opción 2: MetaMask Mobile</h4>
                <p>Si tienes MetaMask instalado:</p>
                <ol>
                    <li>Abre la app MetaMask</li>
                    <li>Ve a Configuración → Navegador</li>
                    <li>Habilita el navegador interno</li>
                    <li>Regresa aquí desde la app</li>
                </ol>
                <button id="metamaskMobileBtn" class="btn btn-secondary" style="margin: 10px 0;">
                    📱 Usar MetaMask Mobile
                </button>
            </div>
            
            <div style="margin: 20px 0;">
                <h4 style="color: #00d4ff; margin-bottom: 10px;">📥 Descargar Wallets</h4>
                <div style="text-align: center;">
                    <a href="https://apps.apple.com/app/metamask/id1438144202" target="_blank" class="btn btn-secondary" style="margin: 5px;">
                        📱 MetaMask iOS
                    </a>
                    <a href="https://play.google.com/store/apps/details?id=io.metamask" target="_blank" class="btn btn-secondary" style="margin: 5px;">
                        🤖 MetaMask Android
                    </a>
                    <a href="https://apps.apple.com/app/trust-wallet/id1418479307" target="_blank" class="btn btn-secondary" style="margin: 5px;">
                        📱 Trust Wallet iOS
                    </a>
                    <a href="https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp" target="_blank" class="btn btn-secondary" style="margin: 5px;">
                        🤖 Trust Wallet Android
                    </a>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn btn-secondary" onclick="closeModal('mobileMetaMaskModal')">
                    ❌ Cancelar
                </button>
            </div>
        </div>
    `;
    
    // Crear modal
    const modal = document.createElement('div');
    modal.id = 'mobileMetaMaskModal';
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = modalContent;
    
    // Agregar al DOM
    document.body.appendChild(modal);
    
    // Agregar event listeners
    setTimeout(() => {
        const web3ModalBtn = document.getElementById('web3ModalBtn');
        const metamaskMobileBtn = document.getElementById('metamaskMobileBtn');
        
        if (web3ModalBtn) {
            web3ModalBtn.addEventListener('click', () => {
                console.log('🔗 Botón Web3Modal presionado');
                closeModal('mobileMetaMaskModal');
                connectWithWeb3Modal();
            });
        }
        
        if (metamaskMobileBtn) {
            metamaskMobileBtn.addEventListener('click', () => {
                console.log('📱 Botón MetaMask Mobile presionado');
                closeModal('mobileMetaMaskModal');
                tryConnectMetaMaskMobile();
            });
        }
    }, 100);
    
    // Cerrar con Escape
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal('mobileMetaMaskModal');
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    console.log('✅ Modal de instrucciones móvil mostrado');
}

// Función para mostrar instrucciones de instalación de MetaMask
function showMetaMaskInstallInstructions() {
    console.log('📱 Detectando dispositivo móvil...');
    
    // Detectar si es móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    // Crear modal de instrucciones
    const modal = document.createElement('div');
    modal.className = 'account-selector-modal';
    modal.id = 'metaMaskInstallModal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'account-selector-content';
    
    // Título
    const title = document.createElement('h3');
    title.className = 'account-selector-title';
    title.textContent = '📱 Instalar MetaMask';
    modalContent.appendChild(title);
    
    // Descripción
    const description = document.createElement('p');
    description.className = 'account-selector-description';
    description.textContent = 'Para usar BIG BANG Token, necesitas instalar MetaMask en tu dispositivo:';
    modalContent.appendChild(description);
    
    // Instrucciones específicas por dispositivo
    const instructions = document.createElement('div');
    instructions.className = 'meta-mask-instructions';
    instructions.style.cssText = `
        margin: 20px 0;
        text-align: left;
    `;
    
    if (isMobile) {
        if (isIOS) {
            instructions.innerHTML = `
                <div style="margin-bottom: 20px;">
                    <h4 style="color: #00d4ff; margin-bottom: 10px;">🍎 Para iPhone/iPad:</h4>
                    <ol style="color: #ffffff; line-height: 1.6;">
                        <li>Abre la App Store en tu dispositivo</li>
                        <li>Busca "MetaMask"</li>
                        <li>Descarga e instala la aplicación</li>
                        <li>Abre MetaMask y crea una nueva wallet</li>
                        <li>Vuelve a esta página y conecta tu wallet</li>
                    </ol>
                    <div style="margin-top: 15px;">
                        <a href="https://apps.apple.com/app/metamask/id1438144202" 
                           target="_blank" 
                           style="background: linear-gradient(135deg, #00d4ff, #0099cc); 
                                  color: #000; 
                                  padding: 10px 20px; 
                                  border-radius: 8px; 
                                  text-decoration: none; 
                                  font-weight: bold;
                                  display: inline-block;">
                            📱 Descargar MetaMask para iOS
                        </a>
                    </div>
                </div>
            `;
        } else if (isAndroid) {
            instructions.innerHTML = `
                <div style="margin-bottom: 20px;">
                    <h4 style="color: #00d4ff; margin-bottom: 10px;">🤖 Para Android:</h4>
                    <ol style="color: #ffffff; line-height: 1.6;">
                        <li>Abre Google Play Store en tu dispositivo</li>
                        <li>Busca "MetaMask"</li>
                        <li>Descarga e instala la aplicación</li>
                        <li>Abre MetaMask y crea una nueva wallet</li>
                        <li>Vuelve a esta página y conecta tu wallet</li>
                    </ol>
                    <div style="margin-top: 15px;">
                        <a href="https://play.google.com/store/apps/details?id=io.metamask" 
                           target="_blank" 
                           style="background: linear-gradient(135deg, #00d4ff, #0099cc); 
                                  color: #000; 
                                  padding: 10px 20px; 
                                  border-radius: 8px; 
                                  text-decoration: none; 
                                  font-weight: bold;
                                  display: inline-block;">
                            📱 Descargar MetaMask para Android
                        </a>
                    </div>
                </div>
            `;
        } else {
            instructions.innerHTML = `
                <div style="margin-bottom: 20px;">
                    <h4 style="color: #00d4ff; margin-bottom: 10px;">📱 Para Dispositivo Móvil:</h4>
                    <ol style="color: #ffffff; line-height: 1.6;">
                        <li>Busca "MetaMask" en tu tienda de aplicaciones</li>
                        <li>Descarga e instala la aplicación</li>
                        <li>Abre MetaMask y crea una nueva wallet</li>
                        <li>Vuelve a esta página y conecta tu wallet</li>
                    </ol>
                </div>
            `;
        }
    } else {
        // Instrucciones para desktop
        instructions.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h4 style="color: #00d4ff; margin-bottom: 10px;">💻 Para Desktop:</h4>
                <ol style="color: #ffffff; line-height: 1.6;">
                    <li>Ve a <a href="https://metamask.io" target="_blank" style="color: #00d4ff;">metamask.io</a></li>
                    <li>Descarga la extensión para tu navegador</li>
                    <li>Instala y configura MetaMask</li>
                    <li>Recarga esta página y conecta tu wallet</li>
                </ol>
                <div style="margin-top: 15px;">
                    <a href="https://metamask.io/download/" 
                       target="_blank" 
                       style="background: linear-gradient(135deg, #00d4ff, #0099cc); 
                              color: #000; 
                              padding: 10px 20px; 
                              border-radius: 8px; 
                              text-decoration: none; 
                              font-weight: bold;
                              display: inline-block;">
                        💻 Descargar MetaMask para Desktop
                    </a>
                </div>
            </div>
        `;
    }
    
    modalContent.appendChild(instructions);
    
    // Botones de acción
    const actions = document.createElement('div');
    actions.className = 'account-selector-actions';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'account-selector-btn cancel';
    closeBtn.textContent = 'Cerrar';
    closeBtn.addEventListener('click', () => {
        closeModal();
    });
    
    const retryBtn = document.createElement('button');
    retryBtn.className = 'account-selector-btn';
    retryBtn.textContent = 'Reintentar';
    retryBtn.addEventListener('click', () => {
        closeModal();
        setTimeout(() => {
            connectWallet();
        }, 500);
    });
    
    actions.appendChild(closeBtn);
    actions.appendChild(retryBtn);
    modalContent.appendChild(actions);
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Función para cerrar modal
    function closeModal() {
        const modal = document.getElementById('metaMaskInstallModal');
        if (modal) {
            modal.remove();
        }
    }
    
    // Cerrar con Escape
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    // Cerrar al hacer click fuera del modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Función de debug para verificar el estado
function debugApp() {
    console.log('🔧 Debug de la aplicación...');
    
    // Verificar elementos del DOM
    const connectBtn = document.getElementById('connectWallet');
    const disconnectBtn = document.getElementById('disconnectWallet');
    const walletInfo = document.getElementById('walletInfo');
    
    console.log('📋 Elementos del DOM:');
    console.log('- Botón conectar:', connectBtn);
    console.log('- Botón desconectar:', disconnectBtn);
    console.log('- Info wallet:', walletInfo);
    
    // Verificar MetaMask
    console.log('📋 MetaMask:');
    console.log('- window.ethereum:', !!window.ethereum);
    console.log('- Tipo de ethereum:', typeof window.ethereum);
    
    // Verificar variables globales
    console.log('📋 Variables globales:');
    console.log('- web3:', web3);
    console.log('- userAccount:', userAccount);
    console.log('- contractAddress:', contractAddress);
    console.log('- bigBangContract:', bigBangContract);
    
    // Verificar configuración
    console.log('📋 Configuración:');
    console.log('- CONFIG:', window.CONFIG);
    console.log('- NETWORKS:', NETWORKS);
    
    // Verificar event listeners
    if (connectBtn) {
        console.log('📋 Event listeners del botón conectar:');
        console.log('- onclick:', connectBtn.onclick);
        console.log('- addEventListener presente:', true);
    }
    
    return {
        domElements: {
            connectBtn: !!connectBtn,
            disconnectBtn: !!disconnectBtn,
            walletInfo: !!walletInfo
        },
        metamask: !!window.ethereum,
        variables: {
            web3: !!web3,
            userAccount: !!userAccount,
            contractAddress: !!contractAddress,
            bigBangContract: !!bigBangContract
        },
        config: {
            CONFIG: !!window.CONFIG,
            NETWORKS: !!NETWORKS
        }
    };
}

// Exponer función de debug globalmente
window.debugApp = debugApp; 
window.debugApp = debugApp; 

// Función para conectar con WalletConnect
async function connectWithWalletConnect() {
    console.log('🔗 Intentando conectar con WalletConnect...');
    
    try {
        showLoading('Conectando con WalletConnect...');
        
        // Configurar WalletConnect
        const provider = new WalletConnectProvider.default({
            rpc: {
                11155111: "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", // Sepolia
                1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161" // Mainnet
            },
            qrcode: true,
            pollingInterval: 12000,
        });
        
        // Conectar
        await provider.enable();
        
        // Crear instancia de Web3
        const web3Instance = new Web3(provider);
        
        // Obtener cuentas
        const accounts = await web3Instance.eth.getAccounts();
        
        if (accounts.length === 0) {
            throw new Error('No se obtuvieron cuentas de WalletConnect');
        }
        
        console.log('✅ WalletConnect conectado:', accounts[0]);
        
        // Guardar provider para desconexión
        walletConnectProvider = provider;
        
        // Conectar con la primera cuenta
        await connectSelectedAccount(accounts[0]);
        
        // Escuchar desconexión
        provider.on("disconnect", (code, reason) => {
            console.log('🔌 WalletConnect desconectado:', reason);
            disconnectWallet();
        });
        
    } catch (error) {
        console.error('❌ Error con WalletConnect:', error);
        hideLoading();
        showError('Error al conectar con WalletConnect: ' + error.message);
    }
}

// Función para conectar con Web3Modal
async function connectWithWeb3Modal() {
    console.log('🔗 Intentando conectar con Web3Modal...');
    
    try {
        showLoading('Conectando wallet...');
        
        // Configurar Web3Modal
        const projectId = 'YOUR_PROJECT_ID'; // Obtener de https://cloud.walletconnect.com/
        
        // Configurar chains
        const chains = [
            {
                id: 11155111, // Sepolia
                name: 'Sepolia',
                network: 'sepolia',
                nativeCurrency: {
                    name: 'Sepolia Ether',
                    symbol: 'SEP',
                    decimals: 18,
                },
                rpcUrls: {
                    default: {
                        http: ['https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
                    },
                    public: {
                        http: ['https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
                    },
                },
            },
            {
                id: 1, // Ethereum Mainnet
                name: 'Ethereum',
                network: 'ethereum',
                nativeCurrency: {
                    name: 'Ether',
                    symbol: 'ETH',
                    decimals: 18,
                },
                rpcUrls: {
                    default: {
                        http: ['https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
                    },
                    public: {
                        http: ['https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
                    },
                },
            }
        ];
        
        // Configurar wallets
        const wallets = [
            {
                id: 'metamask',
                name: 'MetaMask',
                icon: 'https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png',
            },
            {
                id: 'walletconnect',
                name: 'WalletConnect',
                icon: 'https://cdn.iconscout.com/icon/free/png-256/walletconnect-2728406-2261817.png',
            },
            {
                id: 'coinbase',
                name: 'Coinbase Wallet',
                icon: 'https://cdn.iconscout.com/icon/free/png-256/coinbase-2728406-2261817.png',
            },
            {
                id: 'trust',
                name: 'Trust Wallet',
                icon: 'https://cdn.iconscout.com/icon/free/png-256/trustwallet-2728406-2261817.png',
            }
        ];
        
        // Crear modal personalizado de Web3Modal
        const modalContent = `
            <div class="modal-content" style="max-width: 500px;">
                <h3>🔗 Conectar Wallet</h3>
                <p>Elige tu wallet preferido:</p>
                
                <div class="wallet-options" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">
                    <button class="wallet-option" data-wallet="metamask" style="display: flex; align-items: center; padding: 15px; border: 1px solid #333; border-radius: 10px; background: #1a1a1a; color: white; cursor: pointer; transition: all 0.3s;">
                        <img src="https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png" style="width: 32px; height: 32px; margin-right: 10px;">
                        <span>MetaMask</span>
                    </button>
                    
                    <button class="wallet-option" data-wallet="walletconnect" style="display: flex; align-items: center; padding: 15px; border: 1px solid #333; border-radius: 10px; background: #1a1a1a; color: white; cursor: pointer; transition: all 0.3s;">
                        <img src="https://cdn.iconscout.com/icon/free/png-256/walletconnect-2728406-2261817.png" style="width: 32px; height: 32px; margin-right: 10px;">
                        <span>WalletConnect</span>
                    </button>
                    
                    <button class="wallet-option" data-wallet="coinbase" style="display: flex; align-items: center; padding: 15px; border: 1px solid #333; border-radius: 10px; background: #1a1a1a; color: white; cursor: pointer; transition: all 0.3s;">
                        <img src="https://cdn.iconscout.com/icon/free/png-256/coinbase-2728406-2261817.png" style="width: 32px; height: 32px; margin-right: 10px;">
                        <span>Coinbase Wallet</span>
                    </button>
                    
                    <button class="wallet-option" data-wallet="trust" style="display: flex; align-items: center; padding: 15px; border: 1px solid #333; border-radius: 10px; background: #1a1a1a; color: white; cursor: pointer; transition: all 0.3s;">
                        <img src="https://cdn.iconscout.com/icon/free/png-256/trustwallet-2728406-2261817.png" style="width: 32px; height: 32px; margin-right: 10px;">
                        <span>Trust Wallet</span>
                    </button>
                </div>
                
                <div style="text-align: center; margin-top: 20px;">
                    <button class="btn btn-secondary" onclick="closeModal('web3Modal')">
                        ❌ Cancelar
                    </button>
                </div>
            </div>
        `;
        
        // Crear modal
        const modal = document.createElement('div');
        modal.id = 'web3Modal';
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.innerHTML = modalContent;
        
        // Agregar al DOM
        document.body.appendChild(modal);
        
        // Agregar event listeners
        setTimeout(() => {
            const walletOptions = document.querySelectorAll('.wallet-option');
            
            walletOptions.forEach(option => {
                option.addEventListener('click', async () => {
                    const walletType = option.dataset.wallet;
                    console.log('🔗 Wallet seleccionado:', walletType);
                    
                    closeModal('web3Modal');
                    
                    // Conectar según el tipo de wallet
                    switch(walletType) {
                        case 'metamask':
                            await connectWithMetaMask();
                            break;
                        case 'walletconnect':
                            await connectWithWalletConnect();
                            break;
                        case 'coinbase':
                            await connectWithCoinbase();
                            break;
                        case 'trust':
                            await connectWithTrustWallet();
                            break;
                        default:
                            showError('Wallet no soportado');
                    }
                });
                
                // Hover effects
                option.addEventListener('mouseenter', () => {
                    option.style.background = '#333';
                    option.style.borderColor = '#00d4ff';
                });
                
                option.addEventListener('mouseleave', () => {
                    option.style.background = '#1a1a1a';
                    option.style.borderColor = '#333';
                });
            });
        }, 100);
        
        // Cerrar con Escape
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal('web3Modal');
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
        
    } catch (error) {
        console.error('❌ Error con Web3Modal:', error);
        hideLoading();
        showError('Error al conectar con Web3Modal: ' + error.message);
    }
}

// Función para conectar con MetaMask
async function connectWithMetaMask() {
    console.log('🔗 Conectando con MetaMask...');
    
    if (!window.ethereum) {
        showError('MetaMask no está instalado. Por favor instala MetaMask primero.');
        return;
    }
    
    try {
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });
        
        if (accounts.length > 0) {
            await connectSelectedAccount(accounts[0]);
        }
    } catch (error) {
        console.error('❌ Error con MetaMask:', error);
        showError('Error al conectar con MetaMask: ' + error.message);
    }
}

// Función para conectar con Coinbase Wallet
async function connectWithCoinbase() {
    console.log('🔗 Conectando con Coinbase Wallet...');
    
    try {
        // Coinbase Wallet tiene su propio provider
        if (window.ethereum && window.ethereum.isCoinbaseWallet) {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            
            if (accounts.length > 0) {
                await connectSelectedAccount(accounts[0]);
            }
        } else {
            showError('Coinbase Wallet no está instalado. Por favor instala Coinbase Wallet primero.');
        }
    } catch (error) {
        console.error('❌ Error con Coinbase Wallet:', error);
        showError('Error al conectar con Coinbase Wallet: ' + error.message);
    }
}

// Función para conectar con Trust Wallet
async function connectWithTrustWallet() {
    console.log('🔗 Conectando con Trust Wallet...');
    
    try {
        // Trust Wallet usa el mismo provider que MetaMask
        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            
            if (accounts.length > 0) {
                await connectSelectedAccount(accounts[0]);
            }
        } else {
            showError('Trust Wallet no está instalado. Por favor instala Trust Wallet primero.');
        }
    } catch (error) {
        console.error('❌ Error con Trust Wallet:', error);
        showError('Error al conectar con Trust Wallet: ' + error.message);
    }
}

console.log('🚀 Versión de la app: 1.0.7 - Conexión simplificada');