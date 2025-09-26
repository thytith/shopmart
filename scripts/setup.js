const db = require('../config/database');
const fs = require('fs').promises;
const path = require('path');

async function setupDatabase() {
    try {
        console.log('🚀 Setting up ShopSmart database...');
        
        // Read and execute SQL initialization file
        const sqlPath = path.join(__dirname, '../sql/init.sql');
        const sql = await fs.readFile(sqlPath, 'utf8');
        
        // Split SQL statements and execute them
        const statements = sql.split(';').filter(stmt => stmt.trim());
        
        for (const statement of statements) {
            if (statement.trim()) {
                await db.query(statement);
            }
        }
        
        console.log('✅ Database setup completed successfully!');
        
        // Load sample data
        const sampleDataPath = path.join(__dirname, '../sql/sample-data.sql');
        const sampleData = await fs.readFile(sampleDataPath, 'utf8');
        const sampleStatements = sampleData.split(';').filter(stmt => stmt.trim());
        
        for (const statement of sampleStatements) {
            if (statement.trim()) {
                await db.query(statement);
            }
        }
        
        console.log('✅ Sample data loaded successfully!');
        console.log('\n📊 Default admin login:');
        console.log('   Email: admin@shopsmart.com');
        console.log('   Password: admin123');
        
    } catch (error) {
        console.error('❌ Database setup failed:', error);
        process.exit(1);
    }
}

// Run setup if this script is executed directly
if (require.main === module) {
    setupDatabase();
}

module.exports = setupDatabase;
