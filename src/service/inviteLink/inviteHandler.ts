import { Client, GuildMember } from 'discord.js';

const inviteRoleMap = new Map<string, string>([
    ["TKDZFp2yhf", "675092817365958717"],  // Default-User
    ["6mFhyGhT9j", "1075009606029414400"], // Groganovic
    ["Fz3usxAt9j", "1075032301269958677"], // sL3in3x
]);

const invitesCache = new Map<string, string>();

export async function initializeInviteHandler(client: Client): Promise<void> {
    client.on('ready', async () => {
        console.log(`InviteHandler gestartet.`);
        const guilds = client.guilds.cache;

        for (const [, guild] of guilds) {
            const invites = await guild.invites.fetch();
            invites.forEach((invite) => {
                invitesCache.set(invite.code, invite.uses?.toString() || "0");
            });
        }
    });

    client.on('guildMemberAdd', async (member: GuildMember) => {
        try {
            const guild = member.guild;

            const currentInvites = await guild.invites.fetch();

            const usedInvite = currentInvites.find((invite) => {
                const previousUses = invitesCache.get(invite.code);
                return parseInt(previousUses || "0") < (invite.uses || 0);
            });

            if (!usedInvite) {
                console.log(`Kein Einladelink gefunden für ${member.user.tag}`);
                return;
            }

            invitesCache.set(usedInvite.code, usedInvite.uses?.toString() || "0");

            const roleId = inviteRoleMap.get(usedInvite.code);
            if (roleId) {
                const role = guild.roles.cache.get(roleId);
                if (role) {
                    await member.roles.add(role);
                    console.log(`Rolle "${role.name}" wurde an ${member.user.tag} zugewiesen.`);
                } else {
                    console.error(`Rolle mit ID ${roleId} nicht gefunden.`);
                }
            } else {
                console.log(`Keine Rolle für den Invite-Code ${usedInvite.code} konfiguriert.`);
            }
        } catch (error) {
            console.error(`Fehler beim Hinzufügen der Rolle:`, error);
        }
    });
}