-- 1. Criação da Tabela de Veículos / Frotas
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    plate VARCHAR(10) UNIQUE NOT NULL,
    model VARCHAR(50) NOT NULL,
    capacity_kg NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'OPERACIONAL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Criação da Tabela de Pacotes / Encomendas
CREATE TABLE IF NOT EXISTS packages (
    id SERIAL PRIMARY KEY,
    tracking_code VARCHAR(30) UNIQUE NOT NULL,
    recipient_name VARCHAR(100) NOT NULL,
    destination_city VARCHAR(50) NOT NULL,
    status VARCHAR(30) DEFAULT 'TRIAGEM',
    vehicle_id INT REFERENCES vehicles(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Criação da Tabela de Histórico de Rastreamento (Checkpoints)
CREATE TABLE IF NOT EXISTS tracking_checkpoints (
    id SERIAL PRIMARY KEY,
    package_id INT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    location_name VARCHAR(100) NOT NULL,
    status_update VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Inserção de Dados Iniciais de Teste
INSERT INTO vehicles (plate, model, capacity_kg, status) VALUES
('ABC-1313', 'Mercedes-Benz 1313', 8500.00, 'OPERACIONAL'),
('XYZ-1130', 'Scania 113', 25000.00, 'OPERACIONAL');

INSERT INTO packages (tracking_code, recipient_name, destination_city, status, vehicle_id) VALUES
('BR123456789BR', 'Empresa Comercial Alfa', 'Ribeirao Preto', 'EM_TRANSITO', 2),
('BR987654321BR', 'Logistica Express Beta', 'Sao Paulo', 'TRIAGEM', 1);

INSERT INTO tracking_checkpoints (package_id, location_name, status_update) VALUES
(1, 'Centro de Distribuicao Matriz', 'Objeto postado e recebido para triagem'),
(1, 'Hub Regional Ribeirao Preto', 'Objeto em transferencia rodoviaria'),
(2, 'Centro de Distribuicao Matriz', 'Objeto em processo de separacao');