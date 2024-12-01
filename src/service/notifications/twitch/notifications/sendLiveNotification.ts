import { EmbedBuilder, TextChannel } from "discord.js";
import { client } from "../../../../index";

import { getUserData } from "../data/getUserData/getUserData";

export async function sendLiveNotification(username: string, stream: any): Promise<string | null> {
    if (!stream.title || !stream.thumbnail_url || !stream.game_name || typeof stream.viewer_count !== 'number') {
        console.error("Ungültige Streamdaten erhalten:", stream);
        return null;
    }

    const user = await getUserData(username);

    if (!user) {
        console.error(`Konnte Benutzerdaten oder Profilbild für ${username} nicht abrufen.`);
        return null;
    }

    const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID!) as TextChannel;
    const botUser = client.user;
    const botAvatarURL = botUser?.displayAvatarURL();

    const uniqueId = Date.now() + '-' + Math.random();
    const livePreviewURL = `${stream.thumbnail_url.replace('{width}', '1280').replace('{height}', '720')}?v=${uniqueId}`;

    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`🔴 ${username} ist live auf Twitch!`)
        .setURL(`https://www.twitch.tv/${username}`)
        .setAuthor({ name: stream.user_name, iconURL: user.profile_image_url, url: `https://www.twitch.tv/${username}` })
        .addFields(
            { name: 'Title:', value: stream.title }
        )
        .setThumbnail(user.profile_image_url)
        .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Kategorie:', value: stream.game_name || 'Unbekannt', inline: true },
            { name: 'Zuschauer:', value: stream.viewer_count.toString(), inline: true }
        )
        .setImage(livePreviewURL)
        .setTimestamp()
        .setFooter({ text: 'Gesendet von CreativeBot', iconURL: botAvatarURL });

    try {
        const message = await channel.send({ embeds: [embed] });

        console.log(`Sending new live notification for ${username} at`, new Date().toISOString());
        console.log(`Updating live notification for ${username} at`, new Date().toISOString());

        return message.id;
    } catch (error) {
        console.error('Failed to send live notification for:' + username, error);
        return null
    }
}