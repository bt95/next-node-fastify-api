import knex from 'knex';
import knexConfig from '../../knexfile.js';

const db = knex(knexConfig.development);

class DB {
  static async getEmails(searchTerm = '') {
    let query = db('emails').select('*').orderBy('created_at', 'desc');
    
    if (searchTerm) {
      query = query.where(function() {
        this.where('to', 'like', `%${searchTerm}%`)
            .orWhere('cc', 'like', `%${searchTerm}%`)
            .orWhere('bcc', 'like', `%${searchTerm}%`)
            .orWhere('subject', 'like', `%${searchTerm}%`)
            .orWhere('body', 'like', `%${searchTerm}%`);
      });
    }
    
    return query;
  }

  static async getEmailById(id) {
    return db('emails').where('id', id).first();
  }

  static async createEmail(data) {
    return db('emails').insert(data).returning('*');
  }

  static async deleteEmail(id) {
    return db('emails').where('id', id).del();
  }
}

export default DB;
