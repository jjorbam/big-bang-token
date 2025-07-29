// Admin Dashboard JavaScript - Optimizado
let web3;
let bigBangContract;
let userAccount;
let contractAddress = "0x61CA5da746eE0D850d173F3b0116E464dd6D334e"; // Sepolia

// ABI del contrato (solo funciones administrativas)
const CONTRACT_ABI = [
    // Funciones de emergencia
    {
        "inputs": [],
        "name": "emergencyPause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "emergencyUnpause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "bool", "name": "_paused", "type": "bool"}],
        "name": "setStakingPaused",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "bool", "name": "_paused", "type": "bool"}],
        "name": "setUnstakingPaused",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    // Funciones de configuración
    {
        "inputs": [{"internalType": "uint256", "name": "_maxAmount", "type": "uint256"}],
        "name": "setMaxStakeAmount",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_maxTotal", "type": "uint256"}],
        "name": "setMaxTotalStaked",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    // Funciones de tasas
    {
        "inputs": [
            {"internalType": "uint256", "name": "periodInDays", "type": "uint256"},
            {"internalType": "uint256", "name": "newRate", "type": "uint256"}
        ],
        "name": "updateRewardRate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "periodInDays", "type": "uint256"},
            {"internalType": "uint256", "name": "rate", "type": "uint256"}
        ],
        "name": "addStakingPeriod",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    // Funciones de fondos
    {
        "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
        "name": "emergencyWithdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    // Funciones de lectura
    {
        "inputs": [],
        "name": "totalStaked",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "maxStakeAmount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "maxTotalStaked",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "stakingPaused",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "unstakingPaused",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paused",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "name": "rewardRates",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    }
];

// Inicializar dashboard
async function initializeAdminDashboard() {
    try {
        showLoading("Conectando al dashboard...");
        
        // Conectar a MetaMask
        if (typeof window.ethereum !== 'undefined') {
            web3 = new ethers.providers.Web3Provider(window.ethereum);
            
            // Solicitar conexión
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            
            // Verificar que es el owner
            const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, web3.getSigner());
            const owner = await contract.owner();
            
            if (userAccount.toLowerCase() !== owner.toLowerCase()) {
                hideLoading();
                showError("⚠️ Solo el owner puede acceder al dashboard de administración");
                return;
            }
            
            // Inicializar contrato
            bigBangContract = contract;
            
            // Actualizar UI
            document.getElementById('adminAddress').textContent = userAccount;
            await updateStats();
            addLogEntry("Dashboard inicializado correctamente", "success");
            hideLoading();
            
        } else {
            hideLoading();
            showError("❌ MetaMask no está instalado");
        }
    } catch (error) {
        console.error("Error inicializando dashboard:", error);
        hideLoading();
        addLogEntry("Error: " + error.message, "error");
    }
}

// Actualizar estadísticas con mejor UX
async function updateStats() {
    try {
        const totalStaked = await bigBangContract.totalStaked();
        const maxStake = await bigBangContract.maxStakeAmount();
        const maxTotal = await bigBangContract.maxTotalStaked();
        const stakingPaused = await bigBangContract.stakingPaused();
        const unstakingPaused = await bigBangContract.unstakingPaused();
        const isPaused = await bigBangContract.paused();
        
        // Actualizar valores con formato
        document.getElementById('totalStaked').textContent = formatNumber(ethers.utils.formatEther(totalStaked));
        document.getElementById('contractBalance').textContent = formatNumber(ethers.utils.formatEther(maxStake));
        document.getElementById('totalUsers').textContent = "N/A"; // Por implementar
        
        // Actualizar estado del sistema con colores
        const statusElement = document.getElementById('systemStatus');
        if (isPaused) {
            statusElement.textContent = "PAUSADO";
            statusElement.style.color = "#e17055";
            statusElement.style.fontWeight = "bold";
        } else if (stakingPaused || unstakingPaused) {
            statusElement.textContent = "PARCIAL";
            statusElement.style.color = "#fdcb6e";
            statusElement.style.fontWeight = "bold";
        } else {
            statusElement.textContent = "ACTIVO";
            statusElement.style.color = "#00b894";
            statusElement.style.fontWeight = "bold";
        }
        
        // Actualizar indicadores visuales
        updateStatusIndicators(stakingPaused, unstakingPaused, isPaused);
        
    } catch (error) {
        console.error("Error actualizando stats:", error);
        addLogEntry("Error actualizando estadísticas: " + error.message, "error");
    }
}

// Actualizar indicadores visuales de estado
function updateStatusIndicators(stakingPaused, unstakingPaused, isPaused) {
    const stakingIndicator = document.querySelector('.status-indicator');
    const unstakingIndicator = document.querySelector('.status-indicator:nth-child(2)');
    const systemIndicator = document.querySelector('.status-indicator:nth-child(3)');
    
    // Actualizar colores de indicadores
    if (isPaused) {
        systemIndicator.className = 'status-indicator status-paused';
    } else {
        systemIndicator.className = 'status-indicator status-active';
    }
    
    if (stakingPaused) {
        stakingIndicator.className = 'status-indicator status-paused';
    } else {
        stakingIndicator.className = 'status-indicator status-active';
    }
    
    if (unstakingPaused) {
        unstakingIndicator.className = 'status-indicator status-paused';
    } else {
        unstakingIndicator.className = 'status-indicator status-active';
    }
}

// Funciones de emergencia con mejor UX
async function emergencyPause() {
    if (!confirm("⚠️ ¿Está seguro de pausar todo el sistema? Esta acción es irreversible.")) {
        return;
    }
    
    try {
        showLoading("Pausando sistema...");
        addLogEntry("Iniciando emergency pause...");
        const tx = await bigBangContract.emergencyPause();
        await tx.wait();
        addLogEntry("✅ Emergency pause ejecutado exitosamente", "success");
        hideLoading();
        await updateStats();
    } catch (error) {
        hideLoading();
        addLogEntry("❌ Error en emergency pause: " + error.message, "error");
    }
}

async function emergencyUnpause() {
    if (!confirm("✅ ¿Está seguro de reanudar todo el sistema?")) {
        return;
    }
    
    try {
        showLoading("Reanudando sistema...");
        addLogEntry("Iniciando emergency unpause...");
        const tx = await bigBangContract.emergencyUnpause();
        await tx.wait();
        addLogEntry("✅ Emergency unpause ejecutado exitosamente", "success");
        hideLoading();
        await updateStats();
    } catch (error) {
        hideLoading();
        addLogEntry("❌ Error en emergency unpause: " + error.message, "error");
    }
}

async function pauseStaking() {
    try {
        showLoading("Pausando staking...");
        addLogEntry("Pausando staking...");
        const tx = await bigBangContract.setStakingPaused(true);
        await tx.wait();
        addLogEntry("✅ Staking pausado exitosamente", "success");
        hideLoading();
        await updateStats();
    } catch (error) {
        hideLoading();
        addLogEntry("❌ Error pausando staking: " + error.message, "error");
    }
}

async function pauseUnstaking() {
    try {
        showLoading("Pausando unstaking...");
        addLogEntry("Pausando unstaking...");
        const tx = await bigBangContract.setUnstakingPaused(true);
        await tx.wait();
        addLogEntry("✅ Unstaking pausado exitosamente", "success");
        hideLoading();
        await updateStats();
    } catch (error) {
        hideLoading();
        addLogEntry("❌ Error pausando unstaking: " + error.message, "error");
    }
}

// Funciones de configuración con validaciones
async function updateMaxStake() {
    try {
        const newMax = document.getElementById('maxStakeInput').value;
        if (!newMax || newMax <= 0) {
            showError("❌ Ingrese un valor válido");
            return;
        }
        
        if (!confirm(`¿Está seguro de cambiar el máximo stake a ${newMax} BBNG?`)) {
            return;
        }
        
        showLoading("Actualizando máximo stake...");
        addLogEntry(`Actualizando máximo stake a ${newMax} BBNG...`);
        const amount = ethers.utils.parseEther(newMax.toString());
        const tx = await bigBangContract.setMaxStakeAmount(amount);
        await tx.wait();
        addLogEntry("✅ Máximo stake actualizado exitosamente", "success");
        hideLoading();
        await updateStats();
    } catch (error) {
        hideLoading();
        addLogEntry("❌ Error actualizando máximo stake: " + error.message, "error");
    }
}

async function updateMaxTotal() {
    try {
        const newMax = document.getElementById('maxTotalInput').value;
        if (!newMax || newMax <= 0) {
            showError("❌ Ingrese un valor válido");
            return;
        }
        
        if (!confirm(`¿Está seguro de cambiar el máximo total a ${newMax} BBNG?`)) {
            return;
        }
        
        showLoading("Actualizando máximo total...");
        addLogEntry(`Actualizando máximo total a ${newMax} BBNG...`);
        const amount = ethers.utils.parseEther(newMax.toString());
        const tx = await bigBangContract.setMaxTotalStaked(amount);
        await tx.wait();
        addLogEntry("✅ Máximo total actualizado exitosamente", "success");
        hideLoading();
        await updateStats();
    } catch (error) {
        hideLoading();
        addLogEntry("❌ Error actualizando máximo total: " + error.message, "error");
    }
}

// Funciones de tasas con validaciones mejoradas
async function updateRate(period) {
    try {
        let rateInput;
        switch(period) {
            case 30: rateInput = document.getElementById('rate30Input'); break;
            case 90: rateInput = document.getElementById('rate90Input'); break;
            case 180: rateInput = document.getElementById('rate180Input'); break;
            case 365: rateInput = document.getElementById('rate365Input'); break;
        }
        
        const newRate = rateInput.value;
        if (!newRate || newRate <= 0 || newRate > 50) {
            showError("❌ Ingrese una tasa válida (1-50%)");
            return;
        }
        
        if (!confirm(`¿Está seguro de cambiar la tasa para ${period} días a ${newRate}%?`)) {
            return;
        }
        
        showLoading(`Actualizando tasa para ${period} días...`);
        addLogEntry(`Actualizando tasa para ${period} días a ${newRate}%...`);
        const rateInBasisPoints = newRate * 100;
        const tx = await bigBangContract.updateRewardRate(period, rateInBasisPoints);
        await tx.wait();
        addLogEntry(`✅ Tasa para ${period} días actualizada exitosamente`, "success");
        hideLoading();
    } catch (error) {
        hideLoading();
        addLogEntry("❌ Error actualizando tasa: " + error.message, "error");
    }
}

// Funciones de fondos con validaciones
async function emergencyWithdraw() {
    try {
        const amount = document.getElementById('withdrawInput').value;
        if (!amount || amount <= 0) {
            showError("❌ Ingrese una cantidad válida");
            return;
        }
        
        if (!confirm(`⚠️ ¿Está seguro de retirar ${amount} BBNG? Esta acción es irreversible.`)) {
            return;
        }
        
        showLoading("Retirando fondos...");
        addLogEntry(`Retirando ${amount} BBNG...`);
        const amountWei = ethers.utils.parseEther(amount.toString());
        const tx = await bigBangContract.emergencyWithdraw(amountWei);
        await tx.wait();
        addLogEntry("✅ Retiro de emergencia ejecutado exitosamente", "success");
        hideLoading();
        await updateStats();
    } catch (error) {
        hideLoading();
        addLogEntry("❌ Error en retiro de emergencia: " + error.message, "error");
    }
}

async function addStakingPeriod() {
    try {
        const period = document.getElementById('newPeriodInput').value;
        const rate = document.getElementById('newRateInput').value;
        
        if (!period || !rate || period < 30 || period > 365 || rate <= 0 || rate > 50) {
            showError("❌ Ingrese valores válidos (período: 30-365 días, tasa: 1-50%)");
            return;
        }
        
        if (!confirm(`¿Está seguro de añadir un período de ${period} días con ${rate}% APY?`)) {
            return;
        }
        
        showLoading("Añadiendo nuevo período...");
        addLogEntry(`Añadiendo nuevo período: ${period} días con ${rate}% APY...`);
        const rateInBasisPoints = rate * 100;
        const tx = await bigBangContract.addStakingPeriod(period, rateInBasisPoints);
        await tx.wait();
        addLogEntry("✅ Nuevo período añadido exitosamente", "success");
        hideLoading();
    } catch (error) {
        hideLoading();
        addLogEntry("❌ Error añadiendo período: " + error.message, "error");
    }
}

// Funciones de utilidad mejoradas
function addLogEntry(message, type = "action") {
    const log = document.getElementById('adminLog');
    const timestamp = new Date().toLocaleString();
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    
    let className = 'log-action';
    if (type === 'error') className = 'log-error';
    if (type === 'success') className = 'log-success';
    
    entry.innerHTML = `
        <span class="log-timestamp">[${timestamp}]</span>
        <span class="${className}">${message}</span>
    `;
    
    log.insertBefore(entry, log.firstChild);
    
    // Mantener solo los últimos 50 logs
    while (log.children.length > 50) {
        log.removeChild(log.lastChild);
    }
}

function formatNumber(num) {
    return parseFloat(num).toLocaleString('es-ES', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

function showLoading(message) {
    // Crear overlay de loading si no existe
    let loadingOverlay = document.getElementById('loadingOverlay');
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loadingOverlay';
        loadingOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            color: white;
            font-size: 18px;
        `;
        document.body.appendChild(loadingOverlay);
    }
    
    loadingOverlay.innerHTML = `
        <div style="text-align: center;">
            <div style="margin-bottom: 20px;">⏳</div>
            <div>${message}</div>
        </div>
    `;
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

function showError(message) {
    alert(message);
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminDashboard();
    
    // Actualizar stats cada 30 segundos
    setInterval(updateStats, 30000);
}); 