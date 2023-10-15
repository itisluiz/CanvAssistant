import chalk from 'chalk';
import CryptoJS from 'crypto-js';

const logLevel = parseInt(process.env.LOG_LEVEL);
const chalkColors = [chalk.red, chalk.green, chalk.yellow, chalk.blue, chalk.magenta, chalk.cyan, chalk.redBright, chalk.greenBright, chalk.yellowBright, chalk.blueBright, chalk.magentaBright, chalk.cyanBright];

function originColor(origin)
{
	// Slice attempts to improve the 'evenness' of the resulting colors
	const hash = parseInt(CryptoJS.MD5(origin).toString().slice(-2), 16);
	return chalkColors[hash % chalkColors.length];
}

function formattedTime()
{
	const now = new Date();
	return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
}

function logInternal(origin, color, ...what)
{
	const orColor = originColor(origin);
	console.log(`${color(`[${formattedTime()}][`)}${orColor(origin)}${color(']:')}`, color(...what));
}

export function logInfo(origin, ...what)
{
	if (logLevel >= 1)
		logInternal(origin, chalk.white, ...what);
}

export function logError(origin, ...what)
{
	if (logLevel >= 1)
		logInternal(origin, chalk.red, ...what);
}

export function logWarn(origin, ...what)
{
	if (logLevel >= 2)
		logInternal(origin, chalk.yellow, ...what);
}

export function logDebug(origin, ...what)
{
	if (logLevel >= 3)
		logInternal(origin, chalk.dim, ...what);
}
