from src.database.db import engine
from sqlalchemy import text

conn = engine.connect()
conn.execute(text("ALTER TABLE leads ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'manual'"))
conn.execute(text("ALTER TABLE leads ADD COLUMN IF NOT EXISTS property_id VARCHAR(255) NULL"))
conn.execute(text("ALTER TABLE leads ADD COLUMN IF NOT EXISTS property_title VARCHAR(255) NULL"))
conn.execute(text("ALTER TABLE leads ADD COLUMN IF NOT EXISTS property_url TEXT NULL"))
conn.execute(text("""
CREATE TABLE IF NOT EXISTS api_keys (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    key VARCHAR(255) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
)
"""))
conn.execute(text("INSERT INTO api_keys (name, key) VALUES ('widget_public', 'widget_key_2024') ON CONFLICT (key) DO NOTHING"))
conn.commit()
conn.close()
print('Migration OK')
