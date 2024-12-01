import 'dotenv/config';
import { Client, Collection, ActivityType, Interaction, GuildMember, PermissionsBitField } from "discord.js";
import { ExtendedClient, Command } from './utils/types/types';
import {initializeInviteHandler} from "./service/inviteLink/inviteHandler";


const client: ExtendedClient = new Client({
    intents: [
        "Guilds",
        "GuildMessages",
        "GuildMembers",
        "MessageContent"
    ]
}) as ExtendedClient;


client.on("ready", () => {
    client.user?.setPresence({
        activities: [{
            name: "",
            type: ActivityType.Watching
        }],
        status: "online"
    });

    initializeInviteHandler(client).catch(console.error);
})


client.login(process.env.TOKEN!).then(() => {
    console.log(`Logged in as ${client.user?.username}.`);
})
    .catch((err) => {
        console.error(`Login Fehlgeschlagen: ${err}.`);
    });


export { client };