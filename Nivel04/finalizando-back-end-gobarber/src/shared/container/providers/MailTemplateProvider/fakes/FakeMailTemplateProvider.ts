import IMailTemplateProvider from '../models/IMailTemplateProvider';

// implements define como ela deve se comportar
class FakeMailTemplateProvider implements IMailTemplateProvider {
    // IParseMaisTemplateDTO consigo pegar variables e template e retorna string
    // neste caso vamos pegar só template
    public async parse(): Promise<string> {
        return 'Mail content';
    }
}
export default FakeMailTemplateProvider;
