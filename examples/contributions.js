#!/usr/bin/env node

const chalk = require('chalk');

const { Contributions } = require('../lib/index.js');

if (!process.argv[2]) {
    console.error(`usage: contributions <username>`);
    process.exit(1);
}

const username = process.argv[2];

function getColor(intensity) {
    switch (intensity) {
        case 0:
            return chalk.white;
        case 1:
            return chalk.blue;
        case 2:
            return chalk.blueBright;
        case 3:
            return chalk.cyan;
        case 4:
            return chalk.cyanBright;
    }

    throw new Error(`unexpected intensity: ${intensity}`);
}

(async () => {
   try {
        const contributions = await Contributions.forUser(username);

        for (let day of contributions.getDays()) {
            const color = getColor(day.getIntensity());
            console.log(color(`${day.getDate()}: ${day.getCount()} contributions`));
        }
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
