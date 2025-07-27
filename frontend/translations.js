// Sistema de traducciones multiidioma
const TRANSLATIONS = {
    en: {
        // Header
        "connect_wallet": "Connect Wallet",
        "disconnect": "Disconnect",
        
        // Navigation
        "dashboard": "Dashboard",
        "staking": "Staking",
        "transfer": "Transfer",
        "info": "Information",
        
        // Dashboard
        "token_balance": "Token Balance",
        "estimated_value": "Estimated value",
        "active_staking": "Active Staking",
        "total_staked": "Total Staked",
        "pending_rewards": "Pending Rewards",
        "network_info": "Network Information",
        "network": "Network",
        "contract": "Contract",
        "total_supply": "Total Supply",
        "recent_activity": "Recent Activity",
        "no_recent_activity": "No recent activity",
        
        // Staking
        "staking_tokens": "Staking Tokens",
        "stake_tokens_description": "Stake your BBNG tokens and earn rewards",
        "new_stake": "New Stake",
        "stake_amount": "Token Amount",
        "stake_period": "Staking Period",
        "estimated_reward": "Estimated reward",
        "end_date": "End date",
        "make_staking": "Make Staking",
        "active_stakes": "Active Stakes",
        "no_active_stakes": "You have no active stakes",
        "stake_details": "Stake Details",
        "stake_status": "Status",
        "stake_status_active": "Active",
        "stake_status_completed": "Completed",
        "stake_period_days": "Period (days)",
        "stake_reward_rate": "Reward Rate",
        "stake_start_date": "Start Date",
        "stake_end_date": "End Date",
        "claim_reward": "Claim Reward",
        "unstake": "Unstake",
        
        // Transfer
        "transfer_tokens": "Transfer Tokens",
        "transfer_description": "Send BBNG tokens to other addresses",
        "new_transfer": "New Transfer",
        "recipient_address": "Recipient Address",
        "amount": "Amount",
        "transfer": "Transfer",
        
        // Information
        "token_information": "Token Information",
        "token_info_description": "Technical details and statistics of the BIG BANG contract",
        "general_info": "General Information",
        "name": "Name",
        "symbol": "Symbol",
        "decimals": "Decimals",
        "max_supply": "Max Supply",
        "staking_statistics": "Staking Statistics",
        "total_staked_global": "Total Staked",
        "participants": "Participants",
        "average_apy": "Average APY",
        "reward_rates": "Reward Rates",
        "days_30": "30 days",
        "days_90": "90 days",
        "days_180": "180 days",
        "days_365": "365 days",
        
        // Modals
        "success": "Success!",
        "error": "Error",
        "processing_transaction": "Processing transaction...",
        "transaction_completed": "Transaction completed successfully",
        "an_error_occurred": "An error occurred",
        "accept": "Accept",
        
        // Common
        "loading": "Loading...",
        "no_data": "No data available",
        "max": "MAX",
        "cancel": "Cancel",
        "confirm": "Confirm",
        
        // Language selector
        "language": "Language",
        "select_language": "Select Language"
    },
    
    es: {
        // Header
        "connect_wallet": "Conectar Wallet",
        "disconnect": "Desconectar",
        
        // Navigation
        "dashboard": "Dashboard",
        "staking": "Staking",
        "transfer": "Transferir",
        "info": "Información",
        
        // Dashboard
        "token_balance": "Balance de Tokens",
        "estimated_value": "Valor estimado",
        "active_staking": "Staking Activo",
        "total_staked": "Total en Staking",
        "pending_rewards": "Recompensas Pendientes",
        "network_info": "Información de Red",
        "network": "Red",
        "contract": "Contrato",
        "total_supply": "Supply Total",
        "recent_activity": "Actividad Reciente",
        "no_recent_activity": "No hay actividad reciente",
        
        // Staking
        "staking_tokens": "Staking de Tokens",
        "stake_tokens_description": "Haz staking de tus tokens BBNG y gana recompensas",
        "new_stake": "Nuevo Stake",
        "stake_amount": "Cantidad de Tokens",
        "stake_period": "Período de Staking",
        "estimated_reward": "Recompensa estimada",
        "end_date": "Fecha de finalización",
        "make_staking": "Hacer Staking",
        "active_stakes": "Stakes Activos",
        "no_active_stakes": "No tienes stakes activos",
        "stake_details": "Detalles del Stake",
        "stake_status": "Estado",
        "stake_status_active": "Activo",
        "stake_status_completed": "Completado",
        "stake_period_days": "Período (días)",
        "stake_reward_rate": "Tasa de Recompensa",
        "stake_start_date": "Fecha de Inicio",
        "stake_end_date": "Fecha de Fin",
        "claim_reward": "Reclamar Recompensa",
        "unstake": "Retirar Stake",
        
        // Transfer
        "transfer_tokens": "Transferir Tokens",
        "transfer_description": "Envía tokens BBNG a otras direcciones",
        "new_transfer": "Nueva Transferencia",
        "recipient_address": "Dirección Destinatario",
        "amount": "Cantidad",
        "transfer": "Transferir",
        
        // Information
        "token_information": "Información del Token",
        "token_info_description": "Detalles técnicos y estadísticas del contrato BIG BANG",
        "general_info": "Información General",
        "name": "Nombre",
        "symbol": "Símbolo",
        "decimals": "Decimales",
        "max_supply": "Supply Máximo",
        "staking_statistics": "Estadísticas de Staking",
        "total_staked_global": "Total en Staking",
        "participants": "Participantes",
        "average_apy": "APY Promedio",
        "reward_rates": "Tasas de Recompensa",
        "days_30": "30 días",
        "days_90": "90 días",
        "days_180": "180 días",
        "days_365": "365 días",
        
        // Modals
        "success": "¡Éxito!",
        "error": "Error",
        "processing_transaction": "Procesando transacción...",
        "transaction_completed": "Transacción completada exitosamente",
        "an_error_occurred": "Ha ocurrido un error",
        "accept": "Aceptar",
        
        // Common
        "loading": "Cargando...",
        "no_data": "No hay datos disponibles",
        "max": "MAX",
        "cancel": "Cancelar",
        "confirm": "Confirmar",
        
        // Language selector
        "language": "Idioma",
        "select_language": "Seleccionar Idioma"
    },
    
    pt: {
        // Header - 🇵🇹 Português
        // Header
        "connect_wallet": "Conectar Carteira",
        "disconnect": "Desconectar",
        
        // Navigation
        "dashboard": "Painel",
        "staking": "Staking",
        "transfer": "Transferir",
        "info": "Informação",
        
        // Dashboard
        "token_balance": "Saldo de Tokens",
        "estimated_value": "Valor estimado",
        "active_staking": "Staking Ativo",
        "total_staked": "Total em Staking",
        "pending_rewards": "Recompensas Pendentes",
        "network_info": "Informação da Rede",
        "network": "Rede",
        "contract": "Contrato",
        "total_supply": "Supply Total",
        "recent_activity": "Atividade Recente",
        "no_recent_activity": "Não há atividade recente",
        
        // Staking
        "staking_tokens": "Staking de Tokens",
        "stake_tokens_description": "Faça staking dos seus tokens BBNG e ganhe recompensas",
        "new_stake": "Novo Stake",
        "stake_amount": "Quantidade de Tokens",
        "stake_period": "Período de Staking",
        "estimated_reward": "Recompensa estimada",
        "end_date": "Data de finalização",
        "make_staking": "Fazer Staking",
        "active_stakes": "Stakes Ativos",
        "no_active_stakes": "Você não tem stakes ativos",
        "stake_details": "Detalhes do Stake",
        "stake_status": "Status",
        "stake_status_active": "Ativo",
        "stake_status_completed": "Concluído",
        "stake_period_days": "Período (dias)",
        "stake_reward_rate": "Taxa de Recompensa",
        "stake_start_date": "Data de Início",
        "stake_end_date": "Data de Fim",
        "claim_reward": "Reclamar Recompensa",
        "unstake": "Retirar Stake",
        
        // Transfer
        "transfer_tokens": "Transferir Tokens",
        "transfer_description": "Envie tokens BBNG para outros endereços",
        "new_transfer": "Nova Transferência",
        "recipient_address": "Endereço Destinatário",
        "amount": "Quantidade",
        "transfer": "Transferir",
        
        // Information
        "token_information": "Informação do Token",
        "token_info_description": "Detalhes técnicos e estatísticas do contrato BIG BANG",
        "general_info": "Informação Geral",
        "name": "Nome",
        "symbol": "Símbolo",
        "decimals": "Decimais",
        "max_supply": "Supply Máximo",
        "staking_statistics": "Estatísticas de Staking",
        "total_staked_global": "Total em Staking",
        "participants": "Participantes",
        "average_apy": "APY Médio",
        "reward_rates": "Taxas de Recompensa",
        "days_30": "30 dias",
        "days_90": "90 dias",
        "days_180": "180 dias",
        "days_365": "365 dias",
        
        // Modals
        "success": "Sucesso!",
        "error": "Erro",
        "processing_transaction": "Processando transação...",
        "transaction_completed": "Transação concluída com sucesso",
        "an_error_occurred": "Ocorreu um erro",
        "accept": "Aceitar",
        
        // Common
        "loading": "Carregando...",
        "no_data": "Não há dados disponíveis",
        "max": "MÁX",
        "cancel": "Cancelar",
        "confirm": "Confirmar",
        
        // Language selector
        "language": "Idioma",
        "select_language": "Selecionar Idioma"
    }
};

// Función para obtener traducción
function t(key, language = 'es') {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en'][key] || key;
}

// Función para cambiar idioma
function changeLanguage(language) {
    localStorage.setItem('language', language);
    updatePageLanguage(language);
}

// Función para actualizar el idioma de la página
function updatePageLanguage(language) {
    // Actualizar elementos con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t(key, language);
    });
    
    // Actualizar placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key, language);
    });
    
    // Actualizar títulos
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        element.title = t(key, language);
    });
    
    // Actualizar contenido de modales
    updateModalContent(language);
}

// Función para actualizar contenido de modales
function updateModalContent(language) {
    const loadingMessage = document.getElementById('loadingMessage');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    if (loadingMessage) {
        loadingMessage.textContent = t('processing_transaction', language);
    }
    
    if (successMessage) {
        successMessage.textContent = t('transaction_completed', language);
    }
    
    if (errorMessage) {
        errorMessage.textContent = t('an_error_occurred', language);
    }
}

// Exportar funciones
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TRANSLATIONS, t, changeLanguage, updatePageLanguage };
} else {
    window.TRANSLATIONS = TRANSLATIONS;
    window.t = t;
    window.changeLanguage = changeLanguage;
    window.updatePageLanguage = updatePageLanguage;
} 