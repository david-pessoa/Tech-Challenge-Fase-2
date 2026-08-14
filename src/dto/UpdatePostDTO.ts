export interface UpdatePostDTO {
    titulo?: string;
    descricao?: string;
    conteudo?: string;
    image?: Buffer;
    subjectId?: string;
    subjectName?: string;
}
