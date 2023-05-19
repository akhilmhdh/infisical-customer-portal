// import { Types } from 'mongoose';
// import { dbConnect } from '@/app/api/utils';
// import {
//     MembershipOrg,
//     Workspace
// } from '@/app/api/models';
// import {
//     productFeatureMap,
//     DB_MAIN
// } from '@/app/api/config';

// export const getCurrentProductFeatureTable = async ({
//     productId,
//     organizationId
// }: {
//     productId: string;
//     organizationId: string;
// }) => {
//     const head = [
//         {
//             name: 'Allowed'
//         },
//         {
//             name: 'Used'
//         }
//     ];

//     const rows = [
//         {
//             name: 'Organization member limit',
//             field: 'memberLimit'
//         },
//         {
//             name: 'Project limit',
//             field: 'projectLimit'
//         },
//         {
//             name: 'Secret versioning',
//             field: 'secretVersioning'
//         },
//         {
//             name: 'Point in time recovery',
//             field: 'pitRecovery'
//         },
//         {
//             name: 'RBAC',
//             field: 'rbac'
//         },
//         {
//             name: 'Custom rate limits',
//             field: 'customRateLimits'
//         }, 
//         {
//             name: 'Custom alerts',
//             field: 'customAlerts'
//         }, 
//         {
//             name: 'Audit logs',
//             field: 'auditLogs'
//         }
//     ];

//     const mappedRows = await Promise.all(
//         rows.map(async ({ name, field }) => {
            
//             const allowed = productFeatureMap[productId][field];
//             let used = '-';
            
//             await dbConnect(DB_MAIN);
//             if (field === 'memberLimit') {
//                 used = String(await MembershipOrg.countDocuments({
//                     organization: new Types.ObjectId(organizationId)
//                 }));
//             } 
            
//             else if (field === 'projectLimit') {
//                 used = String(await Workspace.countDocuments({
//                     organization: new Types.ObjectId(organizationId)
//                 }));
//             }

//             return ({
//                 name,
//                 allowed,
//                 used
//             });
//         })
//     );

//     return ({
//         head,
//         rows: mappedRows
//     });
// }