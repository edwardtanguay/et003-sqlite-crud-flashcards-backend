import Database from 'better-sqlite3';
import { IFlashcard } from './interfaces.js';
import * as tools from './tools.js';

const dbAbsolutePathAndFileName = tools.absolutifyPathAndFileName('src/data/db.sqlite');
const db = new Database(dbAbsolutePathAndFileName);
db.pragma(`journal_mode = WAL`);

import fs from 'fs';

const welcomeMessagePathAndFileName = './src/data/welcomeMessage.txt';

export const getWelcomeMessage = () => {
	const welcomeMessage = fs.readFileSync(welcomeMessagePathAndFileName);
	return welcomeMessage;
}

export const saveWelcomeMessage = (welcomeMessage: string) => {
	fs.writeFileSync(welcomeMessagePathAndFileName, welcomeMessage);
}

export const getFlashcards = (): IFlashcard[] => {
	const stmt = db.prepare(`
SELECT f.id, f.category, c.name as categoryName, f.front, f.back FROM flashcards AS f
JOIN categories AS c ON f.category = c.idCode
`);
	const flashcards: IFlashcard[] = [];
	for (let row of stmt.iterate()) {
		flashcards.push(row);
	}
	return flashcards;
}

export const getApiInstructions = () => {
	return `
<style>
	body {
		background-color: #444;
		padding: 1rem;
		color: #ccc;
		font-family: sans-serif;
	}
	code {
		background-color: #333;
	}
	a {
		color: orange;
	}
</style>
<h1>SQLite Site API</h1>
<ul>
	<li><a href="/test">/test</a> - shows date/time as test</li>
</ul>
	`;
}