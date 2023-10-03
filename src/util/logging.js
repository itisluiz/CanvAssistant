import chalk from "chalk";

const logLevel = parseInt(process.env.LOG_LEVEL);
const chalkColors = [chalk.red, chalk.green, chalk.yellow, chalk.blue, chalk.magenta, chalk.cyan, chalk.redBright, chalk.greenBright, chalk.yellowBright, chalk.blueBright, chalk.magentaBright, chalk.cyanBright];

function originColor(origin)
{
	let hashDjb2 = 0;
	origin = origin.toLowerCase();

	for (let i = 0; i < origin.length; i++)
		hashDjb2 = (hashDjb2 << 5) - hashDjb2 + origin.charCodeAt(i);

	return chalkColors[Math.abs(hashDjb2) % chalkColors.length];
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
