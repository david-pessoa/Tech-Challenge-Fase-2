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
    console.error("Nao foi possivel iniciar a aplicacao", error);
    process.exit(1);
    //add comentário. aaaa
});