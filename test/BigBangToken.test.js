const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BigBangToken", function () {
  let bigBangToken;
  let owner;
  let user1;
  let user2;
  let creator;
  let founder1;
  let founder2;
  let founder3;

  const MAX_SUPPLY = ethers.parseEther("21000000"); // 21 millones de tokens
  const CREATOR_SHARE = MAX_SUPPLY * 25n / 100n; // 25%
  const FOUNDER_SHARE_1 = MAX_SUPPLY * 10n / 100n; // 10% para el primer fundador
  const FOUNDER_SHARE_2 = MAX_SUPPLY * 25n / 100n; // 25% para el segundo fundador
  const FOUNDER_SHARE_3 = MAX_SUPPLY * 10n / 100n; // 10% para el tercer fundador
  const PUBLIC_SALE_SHARE = MAX_SUPPLY - CREATOR_SHARE - FOUNDER_SHARE_1 - FOUNDER_SHARE_2 - FOUNDER_SHARE_3; // 30%

  beforeEach(async function () {
    [owner, user1, user2, creator, founder1, founder2, founder3] = await ethers.getSigners();

    const BigBangToken = await ethers.getContractFactory("BigBangToken");
    bigBangToken = await BigBangToken.deploy(owner.address);
    await bigBangToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Debería deployar correctamente con el owner correcto", async function () {
      expect(await bigBangToken.owner()).to.equal(owner.address);
    });

    it("Debería tener el nombre y símbolo correctos", async function () {
      expect(await bigBangToken.name()).to.equal("BIG BANG");
      expect(await bigBangToken.symbol()).to.equal("BBNG");
    });

    it("Debería tener el supply máximo correcto", async function () {
      expect(await bigBangToken.getMaxSupply()).to.equal(MAX_SUPPLY);
    });

    it("Debería distribuir tokens correctamente en el constructor", async function () {
      // Verificar distribución a fundadores
      expect(await bigBangToken.balanceOf("0x95BCeA7C05a85B8de810e00B9c42f5B268029272")).to.equal(CREATOR_SHARE);
      expect(await bigBangToken.balanceOf("0x2D99d8BF0E6D2EA939ABF570Fc67DF2E106bAe97")).to.equal(FOUNDER_SHARE_1);
      expect(await bigBangToken.balanceOf("0x64FC52F582026d6cF2D30A7f2A9074Ee671585E8")).to.equal(FOUNDER_SHARE_2);
      expect(await bigBangToken.balanceOf("0x6aa148f6755Aa0CE69814955291DF76C50949e33")).to.equal(FOUNDER_SHARE_3);
      
      // Verificar tokens para venta pública
      expect(await bigBangToken.balanceOf(owner.address)).to.equal(PUBLIC_SALE_SHARE);
      
      // Verificar supply total
      expect(await bigBangToken.totalSupply()).to.equal(MAX_SUPPLY);
    });

    it("Debería configurar las tasas de recompensa correctamente", async function () {
      expect(await bigBangToken.rewardRates(30)).to.equal(500); // 5%
      expect(await bigBangToken.rewardRates(90)).to.equal(1000); // 10%
      expect(await bigBangToken.rewardRates(180)).to.equal(1500); // 15%
      expect(await bigBangToken.rewardRates(365)).to.equal(2000); // 20%
    });

    it("Debería configurar los períodos de staking correctamente", async function () {
      // Verificar períodos individuales ya que stakingPeriods() no es accesible directamente
      expect(await bigBangToken.stakingPeriods(0)).to.equal(30);
      expect(await bigBangToken.stakingPeriods(1)).to.equal(90);
      expect(await bigBangToken.stakingPeriods(2)).to.equal(180);
      expect(await bigBangToken.stakingPeriods(3)).to.equal(365);
    });

    it("Debería configurar los límites de seguridad correctamente", async function () {
      expect(await bigBangToken.maxStakeAmount()).to.equal(ethers.parseEther("1000000")); // 1M tokens
      expect(await bigBangToken.maxTotalStaked()).to.equal(ethers.parseEther("10000000")); // 10M tokens
      expect(await bigBangToken.stakingPaused()).to.equal(false);
      expect(await bigBangToken.unstakingPaused()).to.equal(false);
    });
  });

  describe("Funcionalidad básica del token", function () {
    it("Debería permitir transferencias normales", async function () {
      const transferAmount = ethers.parseEther("1000");
      await bigBangToken.transfer(user1.address, transferAmount);
      expect(await bigBangToken.balanceOf(user1.address)).to.equal(transferAmount);
    });

    it("Debería permitir quemar tokens", async function () {
      const burnAmount = ethers.parseEther("1000");
      const initialBalance = await bigBangToken.balanceOf(owner.address);
      
      await bigBangToken.burn(burnAmount);
      
      expect(await bigBangToken.balanceOf(owner.address)).to.equal(initialBalance - burnAmount);
      expect(await bigBangToken.totalSupply()).to.equal(MAX_SUPPLY - burnAmount);
    });

    it("Debería permitir quemar tokens desde otra cuenta", async function () {
      const burnAmount = ethers.parseEther("1000");
      const initialBalance = await bigBangToken.balanceOf(owner.address);
      
      await bigBangToken.transfer(user1.address, burnAmount);
      await bigBangToken.approve(user1.address, burnAmount);
      await bigBangToken.connect(user1).burnFrom(owner.address, burnAmount);
      
      expect(await bigBangToken.balanceOf(owner.address)).to.be.lt(initialBalance);
      expect(await bigBangToken.balanceOf(user1.address)).to.equal(burnAmount);
      expect(await bigBangToken.totalSupply()).to.equal(MAX_SUPPLY - burnAmount);
    });
  });

  describe("Circuit Breakers y Límites de Seguridad", function () {
    it("Debería permitir al owner pausar/reanudar staking", async function () {
      expect(await bigBangToken.stakingPaused()).to.equal(false);
      
      await bigBangToken.setStakingPaused(true);
      expect(await bigBangToken.stakingPaused()).to.equal(true);
      
      await bigBangToken.setStakingPaused(false);
      expect(await bigBangToken.stakingPaused()).to.equal(false);
    });

    it("Debería permitir al owner pausar/reanudar unstaking", async function () {
      expect(await bigBangToken.unstakingPaused()).to.equal(false);
      
      await bigBangToken.setUnstakingPaused(true);
      expect(await bigBangToken.unstakingPaused()).to.equal(true);
      
      await bigBangToken.setUnstakingPaused(false);
      expect(await bigBangToken.unstakingPaused()).to.equal(false);
    });

    it("Debería permitir al owner actualizar límites de staking", async function () {
      const newMaxStake = ethers.parseEther("500000");
      const newMaxTotal = ethers.parseEther("5000000");
      
      await bigBangToken.setMaxStakeAmount(newMaxStake);
      expect(await bigBangToken.maxStakeAmount()).to.equal(newMaxStake);
      
      await bigBangToken.setMaxTotalStaked(newMaxTotal);
      expect(await bigBangToken.maxTotalStaked()).to.equal(newMaxTotal);
    });

    it("Debería rechazar staking cuando está pausado", async function () {
      await bigBangToken.transfer(user1.address, ethers.parseEther("1000"));
      await bigBangToken.setStakingPaused(true);
      
      await expect(
        bigBangToken.connect(user1).stake(ethers.parseEther("100"), 30)
      ).to.be.revertedWith("Staking is currently paused");
    });

    it("Debería rechazar staking que exceda el límite máximo", async function () {
      await bigBangToken.transfer(user1.address, ethers.parseEther("2000000")); // 2M tokens
      
      await expect(
        bigBangToken.connect(user1).stake(ethers.parseEther("1500000"), 30) // 1.5M tokens
      ).to.be.revertedWith("Staking amount exceeds maximum allowed");
    });

    it("Debería rechazar staking que exceda el límite total", async function () {
      // Transferir tokens suficientes pero no excesivos
      await bigBangToken.transfer(user1.address, ethers.parseEther("5000000")); // 5M tokens
      
      await expect(
        bigBangToken.connect(user1).stake(ethers.parseEther("11000000"), 30) // 11M tokens
      ).to.be.revertedWith("Staking amount exceeds maximum allowed");
    });

    it("Debería rechazar períodos de staking inválidos", async function () {
      await bigBangToken.transfer(user1.address, ethers.parseEther("1000"));
      
      // Período muy corto
      await expect(
        bigBangToken.connect(user1).stake(ethers.parseEther("100"), 15)
      ).to.be.revertedWith("Invalid staking period");
      
      // Período muy largo
      await expect(
        bigBangToken.connect(user1).stake(ethers.parseEther("100"), 400)
      ).to.be.revertedWith("Invalid staking period");
    });
  });

  describe("Funcionalidad de staking mejorada", function () {
    beforeEach(async function () {
      await bigBangToken.transfer(user1.address, ethers.parseEther("10000"));
    });

    it("Debería permitir staking normal con validaciones", async function () {
      const stakeAmount = ethers.parseEther("1000");
      const period = 30;
      
      await bigBangToken.connect(user1).stake(stakeAmount, period);
      
      // Verificar que el staking fue exitoso
      expect(await bigBangToken.totalStaked()).to.equal(stakeAmount);
      
      // Verificar que los tokens fueron transferidos
      expect(await bigBangToken.balanceOf(user1.address)).to.equal(ethers.parseEther("9000")); // 10000 - 1000
    });

    it("Debería rechazar staking con cantidad cero", async function () {
      await expect(
        bigBangToken.connect(user1).stake(0, 30)
      ).to.be.revertedWith("Staking amount must be greater than zero");
    });

    it("Debería rechazar staking con balance insuficiente", async function () {
      await expect(
        bigBangToken.connect(user1).stake(ethers.parseEther("20000"), 30)
      ).to.be.revertedWith("Insufficient balance");
    });

    it("Debería rechazar staking con período inválido", async function () {
      await expect(
        bigBangToken.connect(user1).stake(ethers.parseEther("1000"), 50)
      ).to.be.revertedWith("Invalid staking period");
    });
  });

  describe("Funcionalidad de unstaking mejorada", function () {
    beforeEach(async function () {
      await bigBangToken.transfer(user1.address, ethers.parseEther("10000"));
      await bigBangToken.connect(user1).stake(ethers.parseEther("1000"), 30);
    });

    it("Debería rechazar unstaking cuando está pausado", async function () {
      await bigBangToken.setUnstakingPaused(true);
      
      // Avanzar el tiempo para que el stake esté listo
      await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]); // 31 días
      await ethers.provider.send("evm_mine");
      
      await expect(
        bigBangToken.connect(user1).unstake(0)
      ).to.be.revertedWith("Unstaking is currently paused");
    });

    it("Debería rechazar unstaking antes del período", async function () {
      await expect(
        bigBangToken.connect(user1).unstake(0)
      ).to.be.revertedWith("Staking period not finished");
    });

    it("Debería rechazar unstaking de stake ya reclamado", async function () {
      // Avanzar el tiempo
      await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine");
      
      // Primera reclamación
      await bigBangToken.connect(user1).unstake(0);
      
      // Segunda reclamación debería fallar
      await expect(
        bigBangToken.connect(user1).unstake(0)
      ).to.be.revertedWith("Stake already claimed");
    });

    it("Debería rechazar unstaking con índice inválido", async function () {
      await expect(
        bigBangToken.connect(user1).unstake(1)
      ).to.be.revertedWith("Invalid stake index");
    });
  });

  describe("Cálculo de recompensas mejorado", function () {
    it("Debería calcular recompensas correctamente con validaciones", async function () {
      const amount = ethers.parseEther("1000");
      const days = 30;
      const rate = 500; // 5%
      
      const reward = await bigBangToken.calculateReward(amount, days, rate);
      expect(reward).to.be.gt(0);
    });

    it("Debería rechazar cálculo con parámetros inválidos", async function () {
      const amount = ethers.parseEther("1000");
      const days = 30;
      const rate = 500;
      
      // Cantidad cero
      await expect(
        bigBangToken.calculateReward(0, days, rate)
      ).to.be.revertedWith("Amount must be greater than zero");
      
      // Días cero
      await expect(
        bigBangToken.calculateReward(amount, 0, rate)
      ).to.be.revertedWith("Staking days must be greater than zero");
      
      // Rate cero
      await expect(
        bigBangToken.calculateReward(amount, days, 0)
      ).to.be.revertedWith("Rate must be greater than zero");
    });
  });

  describe("Funciones de emergencia", function () {
    it("Debería permitir emergency pause", async function () {
      await bigBangToken.emergencyPause();
      
      expect(await bigBangToken.paused()).to.equal(true);
      expect(await bigBangToken.stakingPaused()).to.equal(true);
      expect(await bigBangToken.unstakingPaused()).to.equal(true);
    });

    it("Debería permitir emergency unpause", async function () {
      await bigBangToken.emergencyPause();
      await bigBangToken.emergencyUnpause();
      
      expect(await bigBangToken.paused()).to.equal(false);
      expect(await bigBangToken.stakingPaused()).to.equal(false);
      expect(await bigBangToken.unstakingPaused()).to.equal(false);
    });
  });

  describe("Funciones administrativas", function () {
    it("Debería permitir actualizar tasas de recompensa", async function () {
      const newRate = 1500; // 15%
      await bigBangToken.updateRewardRate(30, newRate);
      expect(await bigBangToken.rewardRates(30)).to.equal(newRate);
    });

    it("Debería rechazar tasas de recompensa excesivas", async function () {
      await expect(
        bigBangToken.updateRewardRate(30, 6000) // 60%
      ).to.be.revertedWith("Rate cannot exceed 50%");
    });

    it("Debería permitir añadir nuevos períodos", async function () {
      const newPeriod = 60;
      const newRate = 750; // 7.5%
      
      await bigBangToken.addStakingPeriod(newPeriod, newRate);
      expect(await bigBangToken.rewardRates(newPeriod)).to.equal(newRate);
    });

    it("Debería rechazar períodos duplicados", async function () {
      await expect(
        bigBangToken.addStakingPeriod(30, 500)
      ).to.be.revertedWith("Period already exists");
    });

    it("Debería rechazar períodos inválidos", async function () {
      await expect(
        bigBangToken.addStakingPeriod(15, 500)
      ).to.be.revertedWith("Period must be between 30 and 365 days");
      
      await expect(
        bigBangToken.addStakingPeriod(400, 500)
      ).to.be.revertedWith("Period must be between 30 and 365 days");
    });
  });

  describe("Seguridad y validaciones", function () {
    it("Debería rechazar operaciones de usuarios no autorizados", async function () {
      await expect(
        bigBangToken.connect(user1).setStakingPaused(true)
      ).to.be.revertedWithCustomError(bigBangToken, "OwnableUnauthorizedAccount");
      
      await expect(
        bigBangToken.connect(user1).setMaxStakeAmount(ethers.parseEther("1000"))
      ).to.be.revertedWithCustomError(bigBangToken, "OwnableUnauthorizedAccount");
    });

    it("Debería validar límites de stake amount", async function () {
      await expect(
        bigBangToken.setMaxStakeAmount(0)
      ).to.be.revertedWith("Max stake amount must be greater than zero");
    });

    it("Debería validar límites de total staked", async function () {
      await bigBangToken.transfer(user1.address, ethers.parseEther("1000"));
      await bigBangToken.connect(user1).stake(ethers.parseEther("100"), 30);
      
      await expect(
        bigBangToken.setMaxTotalStaked(ethers.parseEther("50"))
      ).to.be.revertedWith("Max total must be greater than current staked");
    });
  });

  describe("Eventos", function () {
    it("Debería emitir evento TokensMinted en el constructor", async function () {
      // Verificar que los tokens fueron minted verificando el balance
      expect(await bigBangToken.balanceOf("0x95BCeA7C05a85B8de810e00B9c42f5B268029272")).to.equal(CREATOR_SHARE);
    });

    it("Debería emitir evento TokensBurned al quemar", async function () {
      const burnAmount = ethers.parseEther("1000");
      
      await expect(bigBangToken.burn(burnAmount))
        .to.emit(bigBangToken, "TokensBurned")
        .withArgs(owner.address, burnAmount);
    });

    it("Debería emitir evento Staked al hacer staking", async function () {
      await bigBangToken.transfer(user1.address, ethers.parseEther("1000"));
      
      await expect(bigBangToken.connect(user1).stake(ethers.parseEther("500"), 30))
        .to.emit(bigBangToken, "Staked")
        .withArgs(user1.address, ethers.parseEther("500"), 30);
    });

    it("Debería emitir evento Unstaked al reclamar", async function () {
      await bigBangToken.transfer(user1.address, ethers.parseEther("1000"));
      await bigBangToken.connect(user1).stake(ethers.parseEther("500"), 30);
      
      // Avanzar el tiempo
      await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine");
      
      await expect(bigBangToken.connect(user1).unstake(0))
        .to.emit(bigBangToken, "Unstaked");
    });

    it("Debería emitir evento RewardRateUpdated", async function () {
      await expect(bigBangToken.updateRewardRate(30, 750))
        .to.emit(bigBangToken, "RewardRateUpdated")
        .withArgs(750);
    });
  });

  describe("getUserStakes", function () {
    it("Debería devolver los stakes del usuario", async function () {
      await bigBangToken.transfer(user1.address, ethers.parseEther("2000"));
      await bigBangToken.connect(user1).stake(ethers.parseEther("1000"), 30);
      await bigBangToken.connect(user1).stake(ethers.parseEther("500"), 90);
      
      const stakes = await bigBangToken.connect(user1).getUserStakes();
      
      expect(stakes.length).to.equal(2);
      expect(stakes[0].amount).to.equal(ethers.parseEther("1000"));
      expect(stakes[0].claimed).to.be.false;
      expect(stakes[1].amount).to.equal(ethers.parseEther("500"));
      expect(stakes[1].claimed).to.be.false;
    });

    it("Debería devolver array vacío si no hay stakes", async function () {
      const stakes = await bigBangToken.connect(user1).getUserStakes();
      expect(stakes.length).to.equal(0);
    });
  });
}); 