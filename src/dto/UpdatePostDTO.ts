// Todos os campos são opcionais no update — só atualiza o que for enviado
export interface UpdatePostDTO {
    titulo?: string;
    descricao?: string;
    conteudo?: string;
}