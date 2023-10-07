import { REST, SlashCommandBuilder, Routes } from "discord.js";
import { importDirectory } from "../util/importing.js";

export async function loadCommands(client)
{
	const commandModules = await importDirectory('./src/discord/commands');
	const applicationCommands = await client.application.commands.set(commandModules.map(commandModule => commandModule.command));
	
	return applicationCommands.reduce((acc, applicationCommand) => {
		const commandModule = commandModules.find(cmdModule => cmdModule.command.name == applicationCommand.name);
		acc[applicationCommand.name] = {command: applicationCommand, execute: commandModule.execute}
		return acc;
	}, {});
}
