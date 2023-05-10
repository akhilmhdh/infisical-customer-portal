export const subscriptionFeatureMap = {
    [process.env.STRIPE_SUB_STARTER_2022_09_06!]: {
        projectLimit: 3,
        memberLimit: 5,
        secretVersioning: false,
        pitRecovery: false,
        rbac: true,
        customRateLimits: false,
        customAlerts: false,
        auditLogs: false
    },
    [process.env.STRIPE_SUB_STARTER_2022_08_12!]: {
        projectLimit: 3,
        memberLimit: 5,
        secretVersioning: false,
        pitRecovery: false,
        rbac: true,
        customRateLimits: false,
        customAlerts: false,
        auditLogs: false
    },
    [process.env.STRIPE_SUB_TEAM_2023_01_25!]: {
        projectLimit: 10,
        memberLimit: null,
        secretVersioning: true,
        pitRecovery: true,
        rbac: true,
        customRateLimits: false,
        customAlerts: false,
        auditLogs: false
    },
    [process.env.STRIPE_SUB_TEAM_ANNUAL_2023_02_02!]: {
        projectLimit: 10,
        memberLimit: null,
        secretVersioning: true,
        pitRecovery: true,
        rbac: true,
        customRateLimits: false,
        customAlerts: false,
        auditLogs: false
    },
    [process.env.STRIPE_SUB_PRO_2022_10_12!]: {
        projectLimit: null,
        memberLimit: null,
        secretVersioning: true,
        pitRecovery: true,
        rbac: true,
        customRateLimits: true,
        customAlerts: true,
        auditLogs: false
    },
    [process.env.STRIPE_SUB_PRO_ANNUAL_2023_02_02!]: {
        projectLimit: null,
        memberLimit: null,
        secretVersioning: true,
        pitRecovery: true,
        rbac: true,
        customRateLimits: true,
        customAlerts: true,
        auditLogs: false
    },
    enterprise: {
        projectLimit: null,
        memberLimit: null,
        secretVersioning: true,
        pitRecovery: true,
        rbac: true,
        customRateLimits: true,
        customAlerts: true,
        auditLogs: true
    }
}

