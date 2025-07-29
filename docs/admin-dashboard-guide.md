# 🛡️ Guía del Dashboard de Administración - BIG BANG Token

## 📋 **INFORMACIÓN GENERAL**

### **Propósito**
El Dashboard de Administración es una interfaz web diseñada para que los **fundadores y administradores** del protocolo BIG BANG Token puedan controlar y gestionar todas las funciones críticas del smart contract desde una interfaz gráfica intuitiva.

### **Acceso**
- **URL**: `https://big-bang-token.vercel.app/admin-dashboard.html`
- **Requisito**: Solo el **owner** del contrato puede acceder
- **Red**: Sepolia Testnet (actualmente)

---

## 🔐 **SEGURIDAD Y ACCESO**

### **Verificación de Ownership**
```javascript
// Solo el owner puede acceder
const owner = await contract.owner();
if (userAccount.toLowerCase() !== owner.toLowerCase()) {
    // Acceso denegado
}
```

### **Funciones Protegidas**
- ✅ **onlyOwner** - Todas las funciones administrativas
- ✅ **Verificación de wallet** - MetaMask requerido
- ✅ **Confirmaciones** - Doble verificación para acciones críticas

---

## 🎛️ **FUNCIONALIDADES PRINCIPALES**

### **1. Controles de Emergencia**

#### **🚨 Emergency Pause/Unpause**
```javascript
// Pausar todo el sistema
await contract.emergencyPause();

// Reanudar todo el sistema
await contract.emergencyUnpause();
```

**Uso**: Para situaciones de emergencia donde se necesita detener todas las operaciones.

#### **⏸️ Pausado Granular**
```javascript
// Pausar solo staking
await contract.setStakingPaused(true);

// Pausar solo unstaking
await contract.setUnstakingPaused(true);
```

**Uso**: Para controlar operaciones específicas sin afectar todo el sistema.

### **2. Configuración de Límites**

#### **📊 Máximo por Stake**
```javascript
// Establecer límite máximo por stake
await contract.setMaxStakeAmount(ethers.parseEther("500000"));
```

**Valor actual**: 500,000 BBNG
**Propósito**: Prevenir stakes excesivos

#### **📈 Máximo Total Staked**
```javascript
// Establecer límite total en staking
await contract.setMaxTotalStaked(ethers.parseEther("5000000"));
```

**Valor actual**: 5,000,000 BBNG
**Propósito**: Controlar exposición total del protocolo

### **3. Gestión de Tasas de Recompensa**

#### **📊 Tasas por Período**
```javascript
// Actualizar tasa para un período específico
await contract.updateRewardRate(30, 750); // 7.5% para 30 días
```

**Períodos disponibles**:
- 30 días: 7.5% APY
- 90 días: 10% APY
- 180 días: 15% APY
- 365 días: 20% APY
- 60 días: 8% APY (nuevo)

#### **➕ Añadir Nuevos Períodos**
```javascript
// Añadir nuevo período de staking
await contract.addStakingPeriod(60, 800); // 60 días, 8% APY
```

**Restricciones**:
- Período: 30-365 días
- Tasa máxima: 50% APY

### **4. Gestión de Fondos**

#### **💰 Emergency Withdraw**
```javascript
// Retirar fondos del contrato
await contract.emergencyWithdraw(ethers.parseEther("1000"));
```

**Uso**: Para retirar fondos en caso de emergencia
**Limitación**: No puede retirar tokens en staking

---

## 📊 **PANEL DE ESTADÍSTICAS**

### **Métricas en Tiempo Real**
- **Total Staked**: Cantidad total de tokens en staking
- **Usuarios Activos**: Número de usuarios con stakes activos
- **Balance del Contrato**: Fondos disponibles en el contrato
- **Estado del Sistema**: Activo/Parcial/Pausado

### **Indicadores Visuales**
- 🟢 **Verde**: Sistema activo
- 🟡 **Amarillo**: Sistema parcialmente pausado
- 🔴 **Rojo**: Sistema completamente pausado

---

## 📝 **LOG DE ACTIVIDADES**

### **Registro Automático**
Todas las acciones administrativas se registran automáticamente con:
- **Timestamp**: Hora exacta de la acción
- **Acción**: Descripción de la operación
- **Estado**: Éxito/Error
- **Detalles**: Información adicional

### **Tipos de Log**
- **✅ Success**: Acciones exitosas
- **❌ Error**: Errores y fallos
- **ℹ️ Info**: Información general

---

## 🛠️ **INSTRUCCIONES DE USO**

### **Paso 1: Acceso**
1. Conectar MetaMask a la red Sepolia
2. Asegurarse de que la wallet es el owner del contrato
3. Navegar a la URL del dashboard
4. Confirmar conexión de wallet

### **Paso 2: Verificación**
1. Verificar que aparece la dirección correcta
2. Confirmar que el estado del sistema es visible
3. Revisar que todas las funciones están disponibles

### **Paso 3: Operaciones**
1. **Emergencia**: Usar controles de emergencia solo si es necesario
2. **Configuración**: Ajustar límites según necesidades
3. **Tasas**: Modificar tasas de recompensa según estrategia
4. **Fondos**: Gestionar retiros de emergencia

---

## ⚠️ **ADVERTENCIAS Y MEJORES PRÁCTICAS**

### **🚨 Funciones Críticas**
- **Emergency Pause**: Usar solo en emergencias reales
- **Emergency Withdraw**: Verificar cantidad antes de retirar
- **Configuración de Límites**: Probar en testnet antes de mainnet

### **🔒 Seguridad**
- **Nunca compartir** acceso al dashboard
- **Verificar transacciones** antes de confirmar
- **Mantener backup** de configuraciones importantes
- **Monitorear logs** regularmente

### **📈 Monitoreo**
- **Revisar estadísticas** diariamente
- **Verificar logs** de actividades
- **Monitorear estado** del sistema
- **Backup de configuraciones** importantes

---

## 🔧 **TROUBLESHOOTING**

### **Problemas Comunes**

#### **❌ "Solo el owner puede acceder"**
**Solución**: Verificar que la wallet conectada es el owner del contrato

#### **❌ "MetaMask no está instalado"**
**Solución**: Instalar MetaMask y conectar a Sepolia

#### **❌ "Transaction failed"**
**Solución**: 
1. Verificar gas suficiente
2. Revisar parámetros de la transacción
3. Confirmar que no hay conflictos

#### **❌ "Function not found"**
**Solución**: 
1. Verificar que el contrato está desplegado
2. Confirmar que la ABI es correcta
3. Revisar que la red es correcta

---

## 📞 **SOPORTE**

### **Contacto**
- **Desarrollador**: Cyberpunk Architect
- **Email**: [contacto del proyecto]
- **Telegram**: [grupo del proyecto]

### **Recursos**
- **Documentación técnica**: `docs/security-improvements.md`
- **Código fuente**: `frontend/admin-dashboard.js`
- **Tests**: `scripts/test-dashboard-functions.js`

---

## 🎯 **ROADMAP FUTURO**

### **Mejoras Planificadas**
- [ ] **Multi-signature**: Requerir múltiples firmas para acciones críticas
- [ ] **Timelock**: Retraso en ejecución de cambios críticos
- [ ] **Analytics**: Métricas más detalladas
- [ ] **Notificaciones**: Alertas automáticas
- [ ] **Backup automático**: Configuraciones guardadas automáticamente

### **Nuevas Funcionalidades**
- [ ] **Gestión de usuarios**: Control de usuarios específicos
- [ ] **Whitelist**: Lista de direcciones permitidas
- [ ] **Blacklist**: Lista de direcciones bloqueadas
- [ ] **Rate limiting**: Límites de velocidad para operaciones

---

**Estado**: ✅ **DASHBOARD OPERATIVO**
**Versión**: 2.0.0
**Última actualización**: 27 de Julio 2025 