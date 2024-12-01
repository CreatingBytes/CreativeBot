import {EmbedBuilder, TextChannel} from "discord.js";
import { client } from "../../../../index";

export async function updateLiveNotification(username: string, messageId: string, stream: any) {
    const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID!) as TextChannel;
    if(!channel) {
        console.error('Channel not found for ID: ', process.env.DISCORD_CHANNEL_ID);
        return null;
    }
    const botUser = client.user;
    const botAvatarURL = botUser?.displayAvatarURL();

    const livePreviewURL = stream.thumbnail_url.replace('{width}', '1280').replace('{height}', '720') + `?timestamp=${Date.now()}`;

    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`🔴 ${username} ist live auf Twitch!`)
        .setURL(`https://www.twitch.tv/${username}`)
        .setAuthor({ name: stream.user_name, iconURL: stream.user_profile_image_url, url: `https://www.twitch.tv/${username}` })
        .setThumbnail(stream.user_profile_image_url)
        .addFields(
            { name: 'Title:', value: stream.title },
            { name: '\u200B', value: '\u200B' },
            { name: 'Kategorie:', value: stream.game_name || 'Unbekannt', inline: true },
            { name: 'Zuschauer:', value: stream.viewer_count.toString(), inline: true }
        )
        .setImage(livePreviewURL)
        .setTimestamp()
        .setFooter({ text: 'Gesendet von CreativeBot', iconURL: botAvatarURL });

    try {
        const message = await channel.messages.fetch(messageId);
        if(message){
            console.log('Updating message:', messageId)
            await message.edit({ embeds: [embed] });
        } else {
            console.error(`Message with ID ${messageId} not found.`);
        }
    } catch (error) {
        console.error('Failed to update live notification for:' + username, error);
    }
}