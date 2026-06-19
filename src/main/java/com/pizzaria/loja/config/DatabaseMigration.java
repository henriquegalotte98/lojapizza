package com.pizzaria.loja.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseMigration implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseMigration(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        Integer colunaAntigaExiste = jdbcTemplate.queryForObject("""
                SELECT COUNT(*)
                FROM information_schema.columns
                WHERE table_schema = DATABASE()
                  AND table_name = 'pedidos'
                  AND column_name = 'data_hora'
                """, Integer.class);

        if (colunaAntigaExiste != null && colunaAntigaExiste > 0) {
            jdbcTemplate.execute("""
                    UPDATE pedidos
                    SET data_hora_pedido = COALESCE(data_hora_pedido, data_hora)
                    """);
            jdbcTemplate.execute("ALTER TABLE pedidos DROP COLUMN data_hora");
        }

        jdbcTemplate.execute("""
                ALTER TABLE pedidos
                MODIFY COLUMN data_hora_pedido DATETIME NOT NULL
                """);
    }
}
