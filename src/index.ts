import * as fs from 'fs';
import * as path from 'path'; 
import { convertMOVtoMP4 } from './Commands/MOVtoMP4.ts';


const commandsFolder = path.join(__dirname,'Commands')
fs.readdir(commandsFolder, (err,files) => {
    if(err){
        console.error(`Reading has failed wtf:${err}`);
    }

    console.log(`Loaded ${files.length} commands:`);
    files.forEach((file) => {
        console.log(`- ${file}`);
    })
})

import 'dotenv/config';
import { Attachment, Client, GatewayIntentBits, Message } from 'discord.js';
import { configDotenv } from 'dotenv';

const client = new Client({
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    const attachments = message.attachments;

    const content = message.content;
    const regex = /https:\/\/.*\.mov/g;
    const matches = content.match(regex);

    if(matches)
        for (const [key, match] of matches) {
            const url = new URL(match, 'https://cdn.discordapp.com');
            const fileName = url.pathname.split('/').pop() as string;
            const filePath = path.join(__dirname, '..', 'attachments', 'mov', fileName);
            const fileUrl = new URL(url.toString(),'https://cdn.discordapp.com');
            try {
                const response = await fetch(fileUrl.toString());
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const buffer = await response.arrayBuffer();
                const dataView = new DataView(buffer);
                fs.writeFileSync(filePath, Buffer.from(dataView.buffer));
                console.log(`File written: ${filePath}`);

                message.channel.send(`Converting...`);
                const outputPath = await convertMOVtoMP4(fileName);
                await message.channel.send({
                    content: `Here is your converted file:`,
                    files: [outputPath]
                });
            } catch (err) {
                console.error(`Failed to process file: ${err}`);
                message.channel.send(`Failed to convert. Oopsie Daisies`);
                //CURRENTLY THE BOT WILL ALWAYS RETURN 403 FORBIDDEN DUE TO SAFETY RESTIRCTIONS
                //TODO: WORKAROUND
            }
        }
    if (!attachments.size) return;

    for (const [key, value] of attachments) {
        console.log(value.name);
        if (value.name.endsWith('.mov')) {
            const fileName = value.name;
            const filePath = path.join(__dirname, '..', 'attachments', 'mov', fileName);
            const fileUrl = new URL(value.url, 'https://cdn.discordapp.com');

            try {
                const response = await fetch(fileUrl.toString());
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const buffer = await response.arrayBuffer();
                const dataView = new DataView(buffer);
                fs.writeFileSync(filePath, Buffer.from(dataView.buffer));
                console.log(`File written: ${filePath}`);

                message.channel.send(`Converting...`);
                const outputPath = await convertMOVtoMP4(fileName);
                await message.channel.send({
                    content: `Here is your converted file:`,
                    files: [outputPath]
                });
            } catch (err) {
                console.error(`Failed to process file: ${err}`);
                message.channel.send(`Failed to convert. Oopsie Daisies`);
            }
        }
    }
});

client.on('ready', (c) => {
    console.log(`${c.user.displayName}: AMBATUKAM OOUUHHOOHOOOO`)
})

client.login(process.env.token);