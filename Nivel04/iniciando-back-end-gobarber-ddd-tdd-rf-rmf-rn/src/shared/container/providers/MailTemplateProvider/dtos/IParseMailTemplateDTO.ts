interface ITemplateVariables {
    // template geral (chave do meu objeto precisa ser string) o nome da chave tanto faz
    // nome, idade , email etc..
    [key: string]: string | number;
}

export default interface IParseMailTemplateDTO {
    // informações que vou receber para montar minha template
    file: string;
    variables: ITemplateVariables; // objeto
}
