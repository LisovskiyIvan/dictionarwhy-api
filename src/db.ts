import { Database } from 'bun:sqlite'

export interface User {
    id?: number
    name: string,
    password: string
}

export class UsersDatabase {
    private db: Database;

    constructor() {
        this.db = new Database('users.db');
        this.init()
            .then(() => console.log('users database initialized'))
            .catch(console.error);
    };

    async getUsers() {
        return this.db.query('SELECT * FROM users').all()
    }
    async getUserById(id: number) {
        return this.db.query(`SELECT * FROM users WHERE id = ${id}`).get() as User
    }

    async getUserByData(name: string, password: string) {
        return this.db.query(`SELECT * FROM users WHERE name = "${name}" AND password = "${password}"`).get() as User
    }

    async addUser(user: User) {
        return this.db.query('INSERT INTO users (name, password) VALUES (?, ?) RETURNING id, name, password').get(user.name, user.password) as User;
    }

    async updateUser(id: number, user: User) {
        return this.db.run(`UPDATE user SET name = '${user.name}', password = '${user.password}' WHERE id = ${id}`)
    }

    async deleteUser(id: number) {
        return this.db.run(`DELETE FROM users WHERE id = ${id}`)
    }

    async init() {
        return this.db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, password TEXT)');
    }
}

export interface Word {
    word: string,
    translation: string,
    language: string,
    user_id: number
}

export class WordsDatabase {
    private db: Database;

    constructor() {
        this.db = new Database('words.db');
        this.init()
            .then(() => console.log('words database initialized'))
            .catch(console.error);
    };
    
    async getAllWords() {
        return this.db.query("SELECT * FROM words").get()
    }

    async getAllWordsByUserId(user_id: number) {
        return this.db.query(`SELECT * FROM words WHERE user_id = "${user_id}"`).all()
    }

    async getAllWordsByLanguage(user_id: number, language: string) {
        return this.db.query(`SELECT * FROM words WHERE user_id = "${user_id}" AND language = "${language}"`).all()
    }

    async addWord(word: string, translation: string, language: string, user_id: number) {
        return this.db.query('INSERT INTO words (word, translation, language, user_id) VALUES (?, ?, ?, ?) RETURNING word, translation, language, user_id').get(word, translation, language, user_id) as Word
    }

    async deleteWord(id: number) {
        return this.db.run(`DELETE FROM words WHERE id = ${id}`)
    }

    async init() {
        return this.db.run('CREATE TABLE IF NOT EXISTS words (id INTEGER PRIMARY KEY AUTOINCREMENT, word TEXT, translation TEXT, language TEXT,user_id INTEGER, FOREIGN KEY (user_id) REFERENCES users (id))')
    }
}

