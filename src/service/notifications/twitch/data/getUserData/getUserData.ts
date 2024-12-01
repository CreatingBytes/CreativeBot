import 'dotenv/config';
import { getAccessToken, accessToken } from "../getAccessToken/getAccessToken";
let fetch: typeof import("node-fetch").default;

const clientId: string = process.env.TWITCH_CLIENT_ID!;

interface UserData {
    id: string;
    display_name: string;
    profile_image_url: string;
}

async function getUserData(username: string): Promise<UserData | null> {
    if(!accessToken){
        await getAccessToken();
    }

    if (!fetch) {
        fetch = (await import('node-fetch')).default;
    }

    try {
        const response = await fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
            method: 'GET',
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': "application/json"
            }
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('Twitch API User Error:', JSON.stringify(data, null, 2));
            return null;
        }

        if (data.data.length > 0) {
            return data.data[0];
        } else {
            console.error(`No user data available for user: ${username}`);
        }
        return null;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

export { getUserData };