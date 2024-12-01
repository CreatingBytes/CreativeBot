import {Client, Collection, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, ChatInputCommandInteraction} from "discord.js";

export interface Command {
    name: string;
    description: string;
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute(interaction: ChatInputCommandInteraction): void;
}

export interface ExtendedClient extends Client {
    commands: Collection<string, Command>
}