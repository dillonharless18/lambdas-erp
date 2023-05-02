import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('users').insert([
    {
      name: 'Navaid',
    },
    {
      name: 'Talha',
    },
  ]);
}
