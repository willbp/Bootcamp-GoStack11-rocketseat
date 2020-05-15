interface IMailConfig {
    driver: 'ethereal' | 'ses';
    // declara q existe uma opção default utilizada abaixo e poderá ser exportada
    defaults: {
        from: {
            email: string;
            name: string;
        };
    };
}

export default {
    driver: process.env.MAIL_DRIVER || 'ethereal',

    defaults: {
        from: {
            email: 'william@pereira.com',
            name: 'William Pereira',
        },
    },
} as IMailConfig;
// garante que o driver tenha apenas essas 2 opções
