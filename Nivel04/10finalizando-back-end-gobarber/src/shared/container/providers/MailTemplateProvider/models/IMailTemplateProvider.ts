import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default interface IMailTemplateProvider {
    // recebe data no formato IParseMailTemplateDTO e retorna uma string
    parse(data: IParseMailTemplateDTO): Promise<string>;
}
