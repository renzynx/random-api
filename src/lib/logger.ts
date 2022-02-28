import { blueBright, yellowBright, redBright, greenBright } from 'colorette';

enum Icon {
	SUCCESS = '✔',
	FATAL = 'X',
	WARN = '⚠',
	INFO = 'ℹ️'
}

const info = (...args: unknown[]) => process.stdout.write(`${Icon.INFO} ${blueBright(args.join(' '))}\n`);
const warn = (...args: unknown[]) => process.stdout.write(`${Icon.WARN} ${yellowBright(args.join(' '))}\n`);
const error = (...args: unknown[]) => process.stdout.write(`${Icon.FATAL} ${redBright(args.join(' '))}\n`);
const success = (...args: unknown[]) => process.stdout.write(`${Icon.SUCCESS} ${greenBright(args.join(' '))}\n`);

const log = () => ({
	info,
	warn,
	error,
	success
});

export default log();
