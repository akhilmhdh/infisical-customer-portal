import {
    STRIPE_PRODUCT_STARTER,
    STRIPE_PRODUCT_TEAM,
    STRIPE_PRODUCT_TEAM_ANNUAL,
    STRIPE_PRODUCT_PRO,
    STRIPE_PRODUCT_PRO_ANNUAL
} from './constants';

export interface IProductFeatures {
    [key: string]: null | number | boolean | string;
}

export interface ProductFeatureMap {
    [key: string]: IProductFeatures;
};

// probably should be separated into different tab
export const productFeatureMap: ProductFeatureMap = {
    [STRIPE_PRODUCT_STARTER]: {
        _id: STRIPE_PRODUCT_STARTER,
        slug: 'starter',
        tier: 0,
        projectLimit: 3,
        memberLimit: 5,
        secretVersioning: false,
        pitRecovery: false,
        rbac: false,
        customRateLimits: false,
        customAlerts: false,
        auditLogs: false
    },
    [STRIPE_PRODUCT_TEAM]: {
        _id: STRIPE_PRODUCT_TEAM,
        slug: 'team',
        tier: 1,
        projectLimit: 10,
        memberLimit: null,
        secretVersioning: true,
        pitRecovery: true,
        rbac: true,
        customRateLimits: false,
        customAlerts: false,
        auditLogs: false
    },
    [STRIPE_PRODUCT_TEAM_ANNUAL]: {
        _id: STRIPE_PRODUCT_TEAM_ANNUAL,
        slug: 'team-annual',
        tier: 1,
        projectLimit: 10,
        memberLimit: null,
        secretVersioning: true,
        pitRecovery: true,
        rbac: true,
        customRateLimits: false,
        customAlerts: false,
        auditLogs: false
    },
    [STRIPE_PRODUCT_PRO]: {
        _id: STRIPE_PRODUCT_PRO,
        slug: 'pro',
        tier: 2,
        projectLimit: null,
        memberLimit: null,
        secretVersioning: true,
        pitRecovery: true,
        rbac: true,
        customRateLimits: true,
        customAlerts: true,
        auditLogs: false
    },
    [STRIPE_PRODUCT_PRO_ANNUAL]: {
        _id: STRIPE_PRODUCT_PRO_ANNUAL,
        slug: 'pro-annual',
        tier: 2,
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
        slug: 'enterprise',
        tier: 3,
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