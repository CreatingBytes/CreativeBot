import 'dotenv/config';

import { getAccessToken, accessToken} from "../getAccessToken/getAccessToken";

let fetch: typeof import("node-fetch").default;
const clientId: string = process.env.TWITCH_CLIENT_ID!;

interface StreamData {
    user_name: string;
    game_name: string;
    title: string;
    viewer_count: number;
    thumbnail_url: string;
}

async function getStreamData(username: string): Promise<StreamData | null>{
    if(!accessToken){
        await getAccessToken();
    }

    if (!fetch) {
        fetch = (await import('node-fetch')).default;
    }

    try {
        const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${username}`, {
            method: 'GET',
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': "application/json"
            }
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('Twitch API Error:', JSON.stringify(data, null, 2));
            return null;
        }

        const streamData = data.data as StreamData[];
        if (streamData && streamData.length > 0) {
            const stream = streamData[0];
            return {
                user_name: stream.user_name,
                title: stream.title,
                game_name: stream.game_name,
                viewer_count: stream.viewer_count,
                thumbnail_url: stream.thumbnail_url.replace('{width}', '320').replace('{height}', '180')
            };
        } else {
            console.log(`No stream data available for user: ${username}`)
        }
        return null;
    } catch (error) {
        console.error('Error fetching stream data:', error);
        return null;
    }
}

export { getStreamData };