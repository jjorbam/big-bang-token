// Configuración del frontend BIG BANG Token
const CONFIG = {
    // Dirección del contrato desplegado en Sepolia
    CONTRACT_ADDRESS: '0x6C2455525Ac10CdDd5e36d498BE744EB98aB2a12',
    
    // Configuración de redes
    NETWORKS: {
        1: { name: "Ethereum Mainnet", explorer: "https://etherscan.io" },
        11155111: { name: "Sepolia Testnet", explorer: "https://sepolia.etherscan.io" },
        137: { name: "Polygon", explorer: "https://polygonscan.com" },
        56: { name: "BSC", explorer: "https://bscscan.com" },
        31337: { name: "Hardhat Local", explorer: "" }
    },
    
    // Configuración de staking
    STAKING_PERIODS: [
        { days: 30, apy: 5, label: "30 días - 5% APY" },
        { days: 90, apy: 10, label: "90 días - 10% APY" },
        { days: 180, apy: 15, label: "180 días - 15% APY" },
        { days: 365, apy: 20, label: "365 días - 20% APY" }
    ],
    
    // Información del token
    TOKEN_INFO: {
        name: "BIG BANG",
        symbol: "BBNG",
        decimals: 18,
        maxSupply: "21,000,000"
    },
    
    // Direcciones de fundadores con sus porcentajes
    FOUNDERS: {
        creator: {
            address: "0x95BCeA7C05a85B8de810e00B9c42f5B268029272",
            name: "Cyberpunk Architect",
            percentage: 25
        },
        founder1: {
            address: "0x2D99d8BF0E6D2EA939ABF570Fc67DF2E106bAe97",
            name: "Couch Otter",
            percentage: 10
        },
        founder2: {
            address: "0x64FC52F582026d6cF2D30A7f2A9074Ee671585E8",
            name: "Jus",
            percentage: 25
        },
        founder3: {
            address: "0x6aa148f6755Aa0CE69814955291DF76C50949e33",
            name: "PrisonedMoney",
            percentage: 10
        }
    }
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
} 