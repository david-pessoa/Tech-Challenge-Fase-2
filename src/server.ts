import { app } from "./app";
import { AppDataSource } from "./config/data-source";
import { env } from "./config/env";

async function start(): Promise<void> {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();

    app.listen(env.port, () => {
        console.log(`Servidor executando na porta ${env.port}`);
    });
}

start().catch(error => {
    console.error("Não foi possível iniciar a aplição", error);
    process.exit(1);
});