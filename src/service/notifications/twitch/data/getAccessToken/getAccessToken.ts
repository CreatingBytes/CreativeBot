import 'dotenv/config';
let fetch: typeof import('node-fetch').default;


const clientId: string = process.env.TWITCH_CLIENT_ID!;
const clientSecret: string = process.env.TWITCH_CLIENT_SECRET!;
let accessToken = '';

interface AccessTokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}

async function getAccessToken(){
    if(!fetch){
        fetch = (await import('node-fetch')).default;
    }
    try {
        const response = await fetch(
            `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }}
        );

        const data = await response.json() as AccessTokenResponse;
        if(response.ok){
            const tokenData = data as AccessTokenResponse;
            accessToken = data.access_token;
        } else {
            console.log('Failed to fetch Access Token:', JSON.stringify(data, null, 2))
            accessToken = '';
        }
    } catch (error){
        console.log(`Error fechting Access Token: ${error}`);
        accessToken = '';
    }
}

export { getAccessToken, accessToken };