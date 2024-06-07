Installation
------------

Get the NodeJS binaries and add them to your path environment variable. Clone this repository in a folder and install the dependencies in **package.json** using `npm install` for the dependencies and `npm install -d` for the dev dependencies.

One of them is **fluent-ffmpeg**, but you will need to grab the **ffmpeg** binaries separately and place them in the /binaries/ folder at the root of the project.

Go to the **Discord Developer Portal** and establish an application for your bot - grab your bot's discord **token**, and your specified channel's **webtoken** and write them down in the **.env** file.

`npm run dev` will start a development hotwatch runtime and the bot. `npm run build` will build the typescript files into javascript and `npm run start` will start the bot normally. Although only the dev script will make it run normally because the project is still being developed.

If all goes well your bot should log in and be online - It will automatically convert any posted .mov file should you post it in the channel the bot is monitoring.

`video/quicktime` is dead. Long live `video/mp4`