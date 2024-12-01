import { getStreamData } from "./data/getStreamData/getStreamData";
import { sendLiveNotification } from "./notifications/sendLiveNotification.js";
import { updateLiveNotification } from "./notifications/updateLiveNotification";
import { hasStreamChanged } from "./notifications/hasStreamChanged";

interface LiveStream {
    messageId: string;
    streamData: any;
}

const liveStreams = new Map<string, LiveStream>();

export async function checkTwitchStreams() {
    const twitchUsernames = ['sL3in3x', 'Groganovic'];
    console.log('Checking Twitch streams at:', new Date().toISOString());

    for (const username of twitchUsernames) {
        const stream = await getStreamData(username);

        if (!stream) {
            // logger.error(`Failed to fetch stream data for ${username}`);
            continue;
        }

        if (stream) {
            if (!liveStreams.has(username)) {
                const messageId = await sendLiveNotification(username, stream);
                if (messageId) {
                    liveStreams.set(username, { messageId, streamData: stream });
                }
            } else {
                const { messageId, streamData } = liveStreams.get(username)!;
                if (hasStreamChanged(streamData, stream)) {
                    await updateLiveNotification(username, messageId, stream);
                    liveStreams.set(username, { messageId, streamData: stream });
                }
            }
        }
    }
}