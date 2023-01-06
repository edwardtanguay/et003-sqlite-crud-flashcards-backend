import Database from 'better-sqlite3';
import { IFlashcard, INewFlashcard } from './interfaces.js';
import * as tools from './tools.js';
import * as model from './model.js';

const dbAbsolutePathAndFileName = tools.absolutifyPathAndFileName('src/data/db.sqlite');
const db = new Database(dbAbsolutePathAndFileName);
db.pragma(`journal_mode = WAL`);

import fs from 'fs';

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

export const getFlashcard = (id: number): IFlashcard => {
	const row = db.prepare('SELECT * FROM flashcards WHERE id = ?').get(id);
	if (row === undefined) {
		return row;
	} else {
		const flashcard: IFlashcard = {
			...row
		};
		return flashcard;
	}
}

export const deleteFlashcard = (id: number) => {
	try {
		const formerFlashcard = model.getFlashcard(id);
		const stmt = db.prepare(`DELETE FROM flashcards WHERE id = ?`);
		const result = stmt.run(id);
		if (result.changes === 1) {
			return {
				status: "success",
				deletedFlashcard: formerFlashcard
			}
		} else {
			return {
				status: "error",
				message: `database changes = ${result.changes}`
			}
		}
	} 
	catch (e) {
		return {
			status: "error",
			message: e.message
		}
	}
}

export const editFlashcard = (id: number, newFlashcard: INewFlashcard) => {
	try {
		const stmt = db.prepare(`UPDATE flashcards SET category = ?, front = ?, back = ? WHERE id = ?`);
		const result = stmt.run(newFlashcard.category, newFlashcard.front, newFlashcard.back, id);
		if (result.changes === 1) {
			return {
				status: "success",
				editedFlashcard: model.getFlashcard(id)
			}
		} else {
			return {
				status: "error",
				message: `database changes = ${result.changes}`
			}
		}
	}
	catch (e) {
		return {
			status: "error",
			message: e.message
		}
	}
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
<li>todo...</li>
</ul>
	`;
}