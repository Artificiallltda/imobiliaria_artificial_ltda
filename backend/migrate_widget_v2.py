from src.database.db import engine
from sqlalchemy import text

conn = engine.connect()

conn.execute(text("ALTER TABLE leads ADD COLUMN IF NOT EXISTS ip VARCHAR(100)"))
conn.execute(text("ALTER TABLE leads ADD COLUMN IF NOT EXISTS city VARCHAR(100)"))
conn.execute(text("ALTER TABLE leads ADD COLUMN IF NOT EXISTS state VARCHAR(100)"))
conn.execute(text("ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_source VARCHAR(100)"))
conn.execute(text("ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_medium VARCHAR(100)"))
conn.execute(text("ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_campaign VARCHAR(100)"))
conn.execute(text("ALTER TABLE messages ADD COLUMN IF NOT EXISTS file_url TEXT"))
conn.execute(text("ALTER TABLE messages ADD COLUMN IF NOT EXISTS message_type VARCHAR(20) NOT NULL DEFAULT 'text'"))
conn.execute(text("""
CREATE TABLE IF NOT EXISTS bot_settings (
    id SERIAL PRIMARY KEY,
    welcome_message TEXT NOT NULL DEFAULT 'Olá! Como posso te ajudar com esse imóvel?',
    away_message TEXT NOT NULL DEFAULT 'No momento estamos fora do horário. Responderei em breve!',
    enabled BOOLEAN DEFAULT TRUE,
    away_enabled BOOLEAN DEFAULT TRUE,
    business_start INTEGER DEFAULT 8,
    business_end INTEGER DEFAULT 18
)
"""))
conn.execute(text("INSERT INTO bot_settings (id) VALUES (1) ON CONFLICT DO NOTHING"))
conn.execute(text("""
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES \"Users\"(id) ON DELETE CASCADE,
    subscription JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
)
"""))
conn.commit()
conn.close()
print('Migration OK')
