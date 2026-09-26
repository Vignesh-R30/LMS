const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://library_management_system_qoqd_user:LYTjiGmG0owZpPkRez4P7TS5ZvvD1HCj@dpg-darnrdjncjis73eded2g-a.oregon-postgres.render.com/library_management_system_qoqd',
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        console.log('Testing Issue Book...');
        
        const b = await pool.query('SELECT id FROM books LIMIT 1');
        const u = await pool.query("SELECT id FROM users WHERE role = 'member' LIMIT 1");
        
        const book_id = b.rows[0].id;
        const member_id = u.rows[0].id;
        const due_date = '2026-10-10';

        await pool.query('BEGIN');
        
        const loanResult = await pool.query(
            "INSERT INTO loans (book_id, member_id, due_date, status) VALUES ($1, $2, $3, 'issued') RETURNING *",
            [book_id, member_id, due_date]
        );
        
        await pool.query('ROLLBACK');
        console.log('Loans OK', loanResult.rows[0]);
    } catch(err) {
        console.error('ERROR:', err.message);
    }
    process.exit();
}
run();
