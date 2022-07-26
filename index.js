import chalk from "chalk";
import chokidar from 'chokidar';
import { spawn } from 'child_process'
import treeKill from 'tree-kill';

let childProcess;
let isReady = false;

const watcher = chokidar.watch('backend/src', { ignored: /^\./, persistent: true });

const createChildProcess = () => {
	childProcess = spawn('yarn dev', { stdio: 'inherit', shell: true });
}

const start = () => {
	console.log(chalk.bgBlue(chalk.black(` START WATCHING `)));
	createChildProcess();
	isReady = true;
}

const restart = () => {
	isReady = false;
	console.log(chalk.bgCyan(chalk.black(` RESTART `)));
	treeKill(childProcess.pid);
	createChildProcess();
	isReady = true;
}

watcher
	.on('add', function (path) {
		if (!isReady) return;
		console.log(chalk.bgMagenta(chalk.black(' File', path, 'has been added ')));
		restart();
	})
	.on('change', function (path) {
		console.log(chalk.bgYellow(chalk.black(' File', path, 'has been changed ')));
		restart();
	})
	.on('unlink', function (path) {
		console.log(chalk.bgGrey(' File', path, 'has been removed '));
		restart();
	})
	.on('error', function (error) {
		console.error(chalk.bgRed(chalk.black(' Error happened ', error)));
	})
	.on('ready', function () {
		start();
	})
