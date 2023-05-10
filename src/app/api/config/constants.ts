// TODO: separate envar and constant strings

export const SITE_URL = process.env.SITE_URL;
export const USER_TOKEN = 'user-token';

export const MONGO_MAIN_DB_URI = process.env.MONGO_MAIN_DB_URI!;
export const MONGO_LICENSE_DB_URI = process.env.MONGO_LICENSE_DB_URI!;
export const MONGO_URL = process.env.MONGO_URL!; // deprecated

export const JWT_SECRET = process.env.JWT_SECRET;
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export const SMTP_HOST = process.env.SMTP_HOST!;
export const SMTP_USERNAME = process.env.SMTP_USERNAME!;
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD!;
export const SMTP_PORT = process.env.SMTP_PORT!;
export const SMTP_FROM_ADDRESS = process.env.SMTP_FROM_ADDRESS!;
export const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME!;

// databases
export const DB_MAIN = 'main';
export const DB_LICENSE = 'license';

// membership roles
export const OWNER = "owner";
export const ADMIN = "admin";
export const MEMBER = "member";

// membership statuses
export const INVITED = "invited";

// -- organization
export const ACCEPTED = "accepted";