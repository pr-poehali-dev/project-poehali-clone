-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    energy INTEGER NOT NULL DEFAULT 100,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert admin user
INSERT INTO users (email, username, password_hash, energy, is_admin)
VALUES ('den.nazarenko.02@internet.ru', 'Yehali', '$2b$10$dummyhash', 100000, TRUE)
ON CONFLICT (email) DO NOTHING;

-- Create energy_transactions table for tracking energy usage
CREATE TABLE IF NOT EXISTS energy_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    amount INTEGER NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_energy_transactions_user_id ON energy_transactions(user_id);