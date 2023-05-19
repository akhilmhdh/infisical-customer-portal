import {
    dbConnect,
    jsonResponse
} from '@/app/api/utils';
import {
    User
} from '@/app/api/models';
import { DB_MAIN } from '@/app/api/config';

export async function GET(request: Request) {
    try {
        const userId = request.headers.get('userId');
        
        if (!userId) return jsonResponse(500, { error: { message: 'Authentication failed.' } });

        await dbConnect(DB_MAIN);
        
        const user = await User.findById(userId);

        return jsonResponse(200, {
            user
        });
    } catch (err) {
        console.error('err: ', err);
        return jsonResponse(500, { error: { message: 'Failed to get the current user' } }); 
    }
}