import db, { Database } from './database.js';

class BaseModel {
  static db: Database;

  constructor(db: Database) {
    BaseModel.db = db;
  }

  static async findOne(table: string, id: number) {
    const query = `SELECT * FROM ${table} WHERE id = $1`;
    const res = await this.db.query(query, [id]);
    return res.rows[0];
  }

  static async create(table: string, data: Record<string, any>) {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`;
    const res = await this.db.query(query, values);
    return res.rows[0];
  }

  static async update(table: string, id: number, data: Record<string, any>) {
    const updates = Object.entries(data).map(([key, value], index) => `${key} = $${index + 1}`);
    const query = `UPDATE ${table} SET ${updates.join(', ')} WHERE id = $${Object.entries(data).length + 1} RETURNING *`;
    const res = await this.db.query(query, [...Object.values(data), id]);
    return res.rows[0];
  }

  static async delete(table: string, id: number) {
    const query = `DELETE FROM ${table} WHERE id = $1`;
    await this.db.query(query, [id]);
  }
}

export default BaseModel;
