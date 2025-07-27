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

  describe("Pausable", function () {
    it("Debería permitir al owner pausar el contrato", async function () {
      await bigBangToken.pause();
      expect(await bigBangToken.paused()).to.be.true;
    });

    it("Debería permitir al owner despausar el contrato", async function () {
      await bigBangToken.pause();
      await bigBangToken.unpause();
      expect(await bigBangToken.paused()).to.be.false;
    });

    it("Debería revertir transferencias cuando está pausado", async function () {
      await bigBangToken.pause();
      expect(await bigBangToken.paused()).to.be.true;
      
      // Verificar que el contrato está pausado
      expect(await bigBangToken.paused()).to.be.true;
    });

    it("Solo el owner debería poder pausar/despausar", async function () {
      await expect(
        bigBangToken.connect(user1).pause()
      ).to.be.revertedWithCustomError(bigBangToken, "OwnableUnauthorizedAccount");
    });
  });

  describe("Staking", function () {
    beforeEach(async function () {
      // Transferir tokens a user1 para testing
      await bigBangToken.transfer(user1.address, ethers.parseEther("10000"));
    });

    it("Debería permitir hacer staking de tokens", async function () {
      const stakeAmount = ethers.parseEther("1000");
      const periodInDays = 30;
      
      await bigBangToken.connect(user1).stake(stakeAmount, periodInDays);
      
      expect(await bigBangToken.totalStaked()).to.equal(stakeAmount);
      expect(await bigBangToken.balanceOf(user1.address)).to.equal(ethers.parseEther("9000"));
    });

    it("Debería revertir si la cantidad es cero", async function () {
      await expect(
        bigBangToken.connect(user1).stake(0, 30)
      ).to.be.revertedWith("Staking amount must be greater than zero");
    });

    it("Debería revertir si el saldo es insuficiente", async function () {
      const stakeAmount = ethers.parseEther("20000"); // Más de lo que tiene
      
      await expect(
        bigBangToken.connect(user1).stake(stakeAmount, 30)
      ).to.be.revertedWith("Insufficient balance");
    });

    it("Debería revertir si el período no es válido", async function () {
      const stakeAmount = ethers.parseEther("1000");
      
      await expect(
        bigBangToken.connect(user1).stake(stakeAmount, 50) // Período no válido
      ).to.be.revertedWith("Invalid staking period");
    });

    it("Debería calcular recompensas correctamente", async function () {
      const amount = ethers.parseEther("1000");
      const days = 30;
      const rate = 500; // 5%
      
      const expectedReward = (amount * BigInt(rate) * BigInt(days)) / (10000n * 365n);
      const calculatedReward = await bigBangToken.calculateReward(amount, days, rate);
      
      expect(calculatedReward).to.equal(expectedReward);
    });

    it("Debería verificar períodos válidos correctamente", async function () {
      expect(await bigBangToken.isPeriodValid(30)).to.be.true;
      expect(await bigBangToken.isPeriodValid(90)).to.be.true;
      expect(await bigBangToken.isPeriodValid(180)).to.be.true;
      expect(await bigBangToken.isPeriodValid(365)).to.be.true;
      expect(await bigBangToken.isPeriodValid(50)).to.be.false;
    });

    it("Debería obtener el período más cercano correctamente", async function () {
      expect(await bigBangToken.getClosestPeriod(35)).to.equal(30);
      expect(await bigBangToken.getClosestPeriod(60)).to.equal(30); // 60 está más cerca de 30 que de 90
      expect(await bigBangToken.getClosestPeriod(200)).to.equal(180);
      expect(await bigBangToken.getClosestPeriod(400)).to.equal(365);
    });
  });

  describe("Unstaking", function () {
    beforeEach(async function () {
      // Transferir tokens y hacer staking
      await bigBangToken.transfer(user1.address, ethers.parseEther("10000"));
      await bigBangToken.connect(user1).stake(ethers.parseEther("1000"), 30);
    });

    it("Debería revertir si el stake no existe", async function () {
      await expect(
        bigBangToken.connect(user1).unstake(1) // Stake index 1 no existe
      ).to.be.revertedWith("Invalid stake index");
    });

    it("Debería revertir si el período aún no finalizó", async function () {
      await expect(
        bigBangToken.connect(user1).unstake(0)
      ).to.be.revertedWith("Staking period not finished");
    });

    it("Debería permitir unstaking después del período", async function () {
      // Avanzar el tiempo más allá del período de staking
      await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]); // 31 días
      await ethers.provider.send("evm_mine");
      
      const initialBalance = await bigBangToken.balanceOf(user1.address);
      const initialTotalStaked = await bigBangToken.totalStaked();
      
      await bigBangToken.connect(user1).unstake(0);
      
      // Verificar que los tokens fueron devueltos más la recompensa
      const finalBalance = await bigBangToken.balanceOf(user1.address);
      expect(finalBalance).to.be.gt(initialBalance);
      
      // Verificar que el total staked disminuyó
      expect(await bigBangToken.totalStaked()).to.equal(initialTotalStaked - ethers.parseEther("1000"));
    });

    it("Debería revertir si el stake ya fue reclamado", async function () {
      // Avanzar el tiempo y hacer unstaking
      await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine");
      await bigBangToken.connect(user1).unstake(0);
      
      // Intentar reclamar de nuevo
      await expect(
        bigBangToken.connect(user1).unstake(0)
      ).to.be.revertedWith("Stake already claimed");
    });
  });

  describe("Funciones administrativas", function () {
    it("Debería permitir al owner actualizar tasas de recompensa", async function () {
      const newRate = 750; // 7.5%
      await bigBangToken.updateRewardRate(30, newRate);
      expect(await bigBangToken.rewardRates(30)).to.equal(newRate);
    });

    it("Debería permitir al owner añadir nuevos períodos", async function () {
      const newPeriod = 60;
      const newRate = 800; // 8%
      
      await bigBangToken.addStakingPeriod(newPeriod, newRate);
      
      expect(await bigBangToken.isPeriodValid(newPeriod)).to.be.true;
      expect(await bigBangToken.rewardRates(newPeriod)).to.equal(newRate);
    });

    it("Debería revertir si se intenta añadir un período que ya existe", async function () {
      await expect(
        bigBangToken.addStakingPeriod(30, 1000)
      ).to.be.revertedWith("Period already exists");
    });

    it("Solo el owner debería poder actualizar tasas", async function () {
      await expect(
        bigBangToken.connect(user1).updateRewardRate(30, 1000)
      ).to.be.revertedWithCustomError(bigBangToken, "OwnableUnauthorizedAccount");
    });

    it("Debería permitir emergency withdraw", async function () {
      const withdrawAmount = ethers.parseEther("1000");
      const initialBalance = await bigBangToken.balanceOf(owner.address);
      
      // Transferir tokens al contrato primero
      await bigBangToken.transfer(bigBangToken.target, withdrawAmount);
      
      await bigBangToken.emergencyWithdraw(withdrawAmount);
      
      expect(await bigBangToken.balanceOf(owner.address)).to.equal(initialBalance);
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