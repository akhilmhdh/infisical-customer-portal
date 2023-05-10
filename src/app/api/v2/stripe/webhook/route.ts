import Stripe from 'stripe';
import nodemailer from 'nodemailer';
// import handlebars from 'handlebars';
import SMTPConnection from 'nodemailer/lib/smtp-connection';
import { 
    jsonResponse, 
    dbConnect,
    encryptSymmetric
} from "@/app/api/utils";
import {
    License,
    LicenseFeatureSet,
} from '@/app/api/models';
import { 
    STRIPE_SECRET_KEY, 
    STRIPE_WEBHOOK_SECRET,
    SMTP_HOST,
    SMTP_USERNAME,
    SMTP_PASSWORD,
    SMTP_PORT,
    SMTP_FROM_ADDRESS,
    SMTP_FROM_NAME,
    DB_LICENSE,
    ENCRYPTION_KEY,
    subscriptionFeatureMap
} from '@/app/api/config';
import fs from 'fs';
import path from 'path';

interface Subscription {
    id: string;
    plan: {
        id: string;
    },
    customer: string;
    quantity: number;
}

interface Customer {
    email: string;
}

/**
 * Generate a random set of capitalized characters A-Z, 0-9 that is
 * [length] long with a hyphen - between every [groupSize] characters.
 * Used primarily for license key generation.
 * @param length 
 * @param groupSize 
 * @returns 
 */
const getRandomChars = (length: number, groupSize: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomBytes = new Uint8Array(length);
    crypto.getRandomValues(randomBytes);
    
    let result = '';
    for (let i = 0; i < length; i++) {
        if (i > 0 && i % groupSize === 0) {
            result += '-';
        }
        result += characters.charAt(randomBytes[i] % characters.length);
    }
    return result;
};

export async function POST(request: Request) {
    try {
        let event;

        const stripe = new Stripe(STRIPE_SECRET_KEY!, {
			apiVersion: '2022-11-15'
		});

        if (STRIPE_WEBHOOK_SECRET) {
            const signature = request.headers.get('stripe-signature');
            event = stripe.webhooks.constructEvent(
                await request.text(),
                signature!,
                STRIPE_WEBHOOK_SECRET
            );

            await dbConnect(DB_LICENSE);
            switch (event.type) {
                case 'customer.subscription.created':
                    console.log('customer.subscription.created');
                    console.log('customer.subscription.created', event.data.object);
                    const subscription = event.data.object as Subscription;
                    const price = subscription.plan.id;

                    if (!(price in subscriptionFeatureMap)) {
                        // case: created custom enterprise subscription
                        const subscriptionId = subscription.id;
                        const customerId = subscription.customer;
                        const quantity = subscription.quantity;
                        const customer = (await stripe.customers.retrieve(customerId)) as Customer;

                        const prefix = getRandomChars(10, 5);
                        const body = getRandomChars(20, 5);
                        const licenseKey = `${prefix}-${body}`;
                        
                        const {
                            ciphertext,
                            iv
                        } = await encryptSymmetric(licenseKey, ENCRYPTION_KEY);

                        const license = await new License({
                            customerId,
                            subscriptionId,
                            price,
                            prefix,
                            encryptedLicenseKey: ciphertext,
                            iv,
                            isActivated: false
                        }).save();

                        const {
                            projectLimit,
                            secretVersioning,
                            pitRecovery,
                            rbac,
                            customRateLimits,
                            customAlerts,
                            auditLogs,
                        } = subscriptionFeatureMap['enterprise'];

                        await new LicenseFeatureSet({
                            license: license._id,
                            projectLimit,
                            memberLimit: quantity,
                            secretVersioning,
                            pitRecovery,
                            rbac,
                            customRateLimits,
                            customAlerts,
                            auditLogs
                        }).save();

                        // const templatePath = path.join(process.cwd(), 'src/app/api/templates', 'licenseKey.handlebars');
                        // const source = fs.readFileSync(templatePath, 'utf8');
    
                        // const temp = handlebars.compile(source);
                        // const htmlToSend = temp({
                        //     licenseKey
                        // });
    
                        // const message = {
                        //     from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_ADDRESS}>`,
                        //     to: 'dangtony98@gmail.com',
                        //     subject: 'Infisical — Your enterprise license key',
                        //     html: htmlToSend
                        // };
    
                        // const mailOpts: SMTPConnection.Options = {
                        //     host: SMTP_HOST,
                        //     port: 587,
                        //     requireTLS: true,
                        //     auth: {
                        //         user: SMTP_USERNAME,
                        //         pass: SMTP_PASSWORD
                        //     }
                        // }
                        
                        // let transporter = nodemailer.createTransport(mailOpts);
                        // await transporter.sendMail(message);

                        // const message = {
                        //     from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_ADDRESS}>`,
                        //     to: customer.email,
                        //     subject: 'Your license key test',
                        //     html: `<p>${licenseKey}</p>`,
                        // };

                        // const mailOpts: SMTPConnection.Options = {
                        //     host: SMTP_HOST,
                        //     port: 587,
                        //     requireTLS: true,
                        //     auth: {
                        //         user: SMTP_USERNAME,
                        //         pass: SMTP_PASSWORD
                        //     }
                        // }
                        
                        // let transporter = nodemailer.createTransport(mailOpts);
                        // await transporter.sendMail(message);
                    }
                    break;
                case 'customer.subscription.deleted':
                    const deletedSub = event.data.object as Subscription; 
                    const deletedSubPrice = deletedSub.plan.id;
                    
                    if (!(deletedSubPrice in subscriptionFeatureMap)) {
                        // case: deleted custom enterprise subscription
                        const license = await License.findOneAndDelete({
                            customerId: deletedSub.customer,
                            subscriptionId: deletedSub.id
                        });
                        
                        await LicenseFeatureSet.findOneAndDelete({
                            license: license._id
                        });
                    }
                    break;
                case 'payment_intent.succeeded':
                    console.log('payment_intent.succeeded');


                    break;
                default:
                    console.log(`Unhandled event type ${event.type}`);
            }

            return jsonResponse(400, {
                error: {
                    message: 'Webhook signature verification failed'
                }
            });
        }
    } catch (err) {
        console.error('errr', err);
        return jsonResponse(500, { error: { message: 'Failed to handle Stripe webhook event' } }); 
    }
}