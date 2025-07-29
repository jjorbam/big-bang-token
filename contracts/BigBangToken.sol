// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract BigBangToken is ERC20, ERC20Burnable, Pausable, Ownable, ReentrancyGuard {
    uint256 private constant MAX_SUPPLY = 21000000 * 10**18; // 21 millones de tokens con 18 decimales
    
    // Circuit breakers y límites de seguridad
    uint256 public maxStakeAmount = 1000000 * 10**18; // 1M tokens máximo por stake
    uint256 public maxTotalStaked = 10000000 * 10**18; // 10M tokens máximo total en staking
    bool public stakingPaused = false;
    bool public unstakingPaused = false;
    
    // Eventos para mejor seguimiento
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    event Staked(address indexed user, uint256 amount, uint256 lockPeriod);
    event Unstaked(address indexed user, uint256 amount, uint256 reward);
    event RewardRateUpdated(uint256 newRewardRate);
    event CircuitBreakerUpdated(string breaker, bool paused);
    event LimitsUpdated(string limit, uint256 newValue);
    
    // Estructura para el staking
    struct StakeInfo {
        uint256 amount;         // Cantidad de tokens en staking
        uint256 startTime;      // Tiempo en que comenzó el staking
        uint256 endTime;        // Tiempo en que finaliza el periodo de staking
        bool claimed;           // Si ya se reclamaron los tokens
    }
    
    // Mapeo de direcciones a sus stakes
    mapping(address => StakeInfo[]) public stakes;
    
    // Periodos de staking disponibles (en días)
    uint256[] public stakingPeriods = [30, 90, 180, 365]; // días
    
    // Tasas de recompensa base anual para cada periodo (en porcentaje * 100)
    // Por ejemplo: 500 = 5%, 1000 = 10%
    mapping(uint256 => uint256) public rewardRates;
    
    // Cantidad total de tokens en staking
    uint256 public totalStaked;
    
    constructor(address initialOwner) ERC20("BIG BANG", "BBNG") Ownable(initialOwner) {
        uint256 creatorShare = (MAX_SUPPLY * 25) / 100; // 25% para el creador
        uint256 founderShare1 = (MAX_SUPPLY * 10) / 100; // 10% para el primer fundador
        uint256 founderShare2 = (MAX_SUPPLY * 25) / 100; // 25% para el segundo fundador
        uint256 founderShare3 = (MAX_SUPPLY * 10) / 100; // 10% para el tercer fundador

        // Distribución de los tokens para fundadores
        _mint(0x95BCeA7C05a85B8de810e00B9c42f5B268029272, creatorShare); // Cyberpunk Architect - 25%
        emit TokensMinted(0x95BCeA7C05a85B8de810e00B9c42f5B268029272, creatorShare);
        
        _mint(0x2D99d8BF0E6D2EA939ABF570Fc67DF2E106bAe97, founderShare1);  // Couch Otter - 10%
        emit TokensMinted(0x2D99d8BF0E6D2EA939ABF570Fc67DF2E106bAe97, founderShare1);
        
        _mint(0x64FC52F582026d6cF2D30A7f2A9074Ee671585E8, founderShare2);  // Jus - 25%
        emit TokensMinted(0x64FC52F582026d6cF2D30A7f2A9074Ee671585E8, founderShare2);
        
        _mint(0x6aa148f6755Aa0CE69814955291DF76C50949e33, founderShare3);  // PrisonedMoney - 10%
        emit TokensMinted(0x6aa148f6755Aa0CE69814955291DF76C50949e33, founderShare3);
        
        uint256 publicSaleShare = MAX_SUPPLY - creatorShare - founderShare1 - founderShare2 - founderShare3;
        require(publicSaleShare > 0, "Public sale share must be positive");
        _mint(msg.sender, publicSaleShare); // Tokens restantes para la venta pública (30%)
        emit TokensMinted(msg.sender, publicSaleShare);
        
        // Inicializar tasas de recompensa para cada periodo
        // 30 días: 5% APY
        // 90 días: 10% APY
        // 180 días: 15% APY
        // 365 días: 20% APY
        rewardRates[30] = 500;
        rewardRates[90] = 1000;
        rewardRates[180] = 1500;
        rewardRates[365] = 2000;
    }
    
    /**
     * @dev Permite al propietario pausar todas las transferencias de tokens
     * Útil en caso de emergencia o para mantenimiento
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Permite al propietario reanudar todas las transferencias de tokens
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Permite al propietario pausar/reanudar staking
     */
    function setStakingPaused(bool _paused) external onlyOwner {
        stakingPaused = _paused;
        emit CircuitBreakerUpdated("staking", _paused);
    }

    /**
     * @dev Permite al propietario pausar/reanudar unstaking
     */
    function setUnstakingPaused(bool _paused) external onlyOwner {
        unstakingPaused = _paused;
        emit CircuitBreakerUpdated("unstaking", _paused);
    }

    /**
     * @dev Permite al propietario actualizar límites de seguridad
     */
    function setMaxStakeAmount(uint256 _maxAmount) external onlyOwner {
        require(_maxAmount > 0, "Max stake amount must be greater than zero");
        maxStakeAmount = _maxAmount;
        emit LimitsUpdated("maxStakeAmount", _maxAmount);
    }

    /**
     * @dev Permite al propietario actualizar límite total de staking
     */
    function setMaxTotalStaked(uint256 _maxTotal) external onlyOwner {
        require(_maxTotal > totalStaked, "Max total must be greater than current staked");
        maxTotalStaked = _maxTotal;
        emit LimitsUpdated("maxTotalStaked", _maxTotal);
    }

    /**
     * @dev Sobreescribe la función burn para emitir el evento personalizado
     */
    function burn(uint256 amount) public override {
        super.burn(amount);
        emit TokensBurned(_msgSender(), amount);
    }

    /**
     * @dev Sobreescribe la función burnFrom para emitir el evento personalizado
     */
    function burnFrom(address account, uint256 amount) public override {
        super.burnFrom(account, amount);
        emit TokensBurned(account, amount);
    }
    
    /**
     * @dev Devuelve el suministro máximo de tokens
     */
    function getMaxSupply() external pure returns (uint256) {
        return MAX_SUPPLY;
    }
    
    /**
     * @dev Permite al usuario hacer staking de tokens por un período específico
     * @param amount Cantidad de tokens para hacer staking
     * @param periodInDays Período de staking en días (debe ser uno de los períodos admitidos)
     */
    function stake(uint256 amount, uint256 periodInDays) external nonReentrant whenNotPaused {
        require(!stakingPaused, "Staking is currently paused");
        require(amount > 0, "Staking amount must be greater than zero");
        require(amount <= maxStakeAmount, "Staking amount exceeds maximum allowed");
        require(balanceOf(_msgSender()) >= amount, "Insufficient balance");
        require(isPeriodValid(periodInDays), "Invalid staking period");
        require(totalStaked + amount <= maxTotalStaked, "Total staked would exceed maximum");
        
        // Validar que el período no sea extremo
        require(periodInDays >= 30 && periodInDays <= 365, "Period must be between 30 and 365 days");
        
        // Transferir tokens al contrato
        _transfer(_msgSender(), address(this), amount);
        
        // Calcular tiempo de finalización
        uint256 endTime = block.timestamp + (periodInDays * 1 days);
        
        // Validar que endTime no sea extremo
        require(endTime > block.timestamp, "Invalid end time");
        
        // Guardar información de staking
        stakes[_msgSender()].push(StakeInfo({
            amount: amount,
            startTime: block.timestamp,
            endTime: endTime,
            claimed: false
        }));
        
        // Actualizar el total en staking
        totalStaked += amount;
        
        emit Staked(_msgSender(), amount, periodInDays);
    }
    
    /**
     * @dev Permite al usuario reclamar sus tokens y recompensas después del período de bloqueo
     * @param stakeIndex Índice del stake en el array de stakes del usuario
     */
    function unstake(uint256 stakeIndex) external nonReentrant {
        require(!unstakingPaused, "Unstaking is currently paused");
        require(stakeIndex < stakes[_msgSender()].length, "Invalid stake index");
        
        StakeInfo storage stakeInfo = stakes[_msgSender()][stakeIndex];
        require(!stakeInfo.claimed, "Stake already claimed");
        require(block.timestamp >= stakeInfo.endTime, "Staking period not finished");
        
        // Marcar como reclamado ANTES de las transferencias (reentrancy protection)
        stakeInfo.claimed = true;
        
        // Calcular recompensa con validaciones
        uint256 stakingDays = (stakeInfo.endTime - stakeInfo.startTime) / 1 days;
        require(stakingDays > 0, "Invalid staking period");
        
        uint256 rewardRate = rewardRates[getClosestPeriod(stakingDays)];
        uint256 reward = calculateReward(stakeInfo.amount, stakingDays, rewardRate);
        
        // Validar que la recompensa no sea excesiva
        require(reward <= stakeInfo.amount * 2, "Reward too high"); // Máximo 200% de recompensa
        
        // Actualizar el total en staking ANTES de las transferencias
        totalStaked -= stakeInfo.amount;
        
        // Transferir tokens + recompensa
        _transfer(address(this), _msgSender(), stakeInfo.amount);
        
        // Mint de la recompensa
        _mint(_msgSender(), reward);
        
        emit Unstaked(_msgSender(), stakeInfo.amount, reward);
    }
    
    /**
     * @dev Permite al usuario ver todos sus stakes activos
     * @return Un array con todas las StakeInfo del usuario
     */
    function getUserStakes() external view returns (StakeInfo[] memory) {
        return stakes[_msgSender()];
    }
    
    /**
     * @dev Calcula la recompensa basada en la cantidad, duración y tasa
     * @param amount Cantidad en staking
     * @param stakingDays Duración en días
     * @param rate Tasa de recompensa anual * 100
     * @return La recompensa calculada
     */
    function calculateReward(uint256 amount, uint256 stakingDays, uint256 rate) public pure returns (uint256) {
        // Validaciones de seguridad
        require(amount > 0, "Amount must be greater than zero");
        require(stakingDays > 0, "Staking days must be greater than zero");
        require(rate > 0, "Rate must be greater than zero");
        
        // Prevenir overflow: usar SafeMath implícito de Solidity 0.8+
        // Recompensa = cantidad * (tasa / 10000) * (días / 365)
        uint256 reward = (amount * rate * stakingDays) / (10000 * 365);
        
        return reward;
    }
    
    /**
     * @dev Verifica si el período de staking es válido
     * @param periodInDays Período en días
     * @return Verdadero si el período es válido
     */
    function isPeriodValid(uint256 periodInDays) public view returns (bool) {
        for (uint256 i = 0; i < stakingPeriods.length; i++) {
            if (stakingPeriods[i] == periodInDays) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * @dev Obtiene el período de staking más cercano
     * @param stakingDays Días
     * @return El período válido más cercano
     */
    function getClosestPeriod(uint256 stakingDays) public view returns (uint256) {
        uint256 closestPeriod = stakingPeriods[0];
        uint256 minDifference = abs(int256(stakingDays) - int256(closestPeriod));
        
        for (uint256 i = 1; i < stakingPeriods.length; i++) {
            uint256 difference = abs(int256(stakingDays) - int256(stakingPeriods[i]));
            if (difference < minDifference) {
                minDifference = difference;
                closestPeriod = stakingPeriods[i];
            }
        }
        
        return closestPeriod;
    }
    
    /**
     * @dev Función auxiliar para obtener el valor absoluto
     */
    function abs(int256 x) private pure returns (uint256) {
        return x >= 0 ? uint256(x) : uint256(-x);
    }
    
    /**
     * @dev Permite al propietario actualizar la tasa de recompensa para un período
     * @param periodInDays Período en días
     * @param newRate Nueva tasa de recompensa anual * 100
     */
    function updateRewardRate(uint256 periodInDays, uint256 newRate) external onlyOwner {
        require(isPeriodValid(periodInDays), "Invalid staking period");
        require(newRate <= 5000, "Rate cannot exceed 50%"); // Máximo 50% APY
        rewardRates[periodInDays] = newRate;
        emit RewardRateUpdated(newRate);
    }
    
    /**
     * @dev Permite al propietario añadir un nuevo período de staking
     * @param periodInDays Nuevo período en días
     * @param rate Tasa de recompensa para este período
     */
    function addStakingPeriod(uint256 periodInDays, uint256 rate) external onlyOwner {
        require(!isPeriodValid(periodInDays), "Period already exists");
        require(periodInDays >= 30 && periodInDays <= 365, "Period must be between 30 and 365 days");
        require(rate <= 5000, "Rate cannot exceed 50%"); // Máximo 50% APY
        stakingPeriods.push(periodInDays);
        rewardRates[periodInDays] = rate;
    }
    
    /**
     * @dev Permite al propietario retirar tokens en caso de emergencia
     * @param amount Cantidad de tokens a retirar
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(amount <= ERC20(address(this)).balanceOf(address(this)) - totalStaked, "Cannot withdraw staked tokens");
        _transfer(address(this), _msgSender(), amount);
    }
    
    /**
     * @dev Función de emergencia para pausar todo el sistema
     */
    function emergencyPause() external onlyOwner {
        _pause();
        stakingPaused = true;
        unstakingPaused = true;
        emit CircuitBreakerUpdated("emergency", true);
    }
    
    /**
     * @dev Función de emergencia para reanudar el sistema
     */
    function emergencyUnpause() external onlyOwner {
        _unpause();
        stakingPaused = false;
        unstakingPaused = false;
        emit CircuitBreakerUpdated("emergency", false);
    }
} 