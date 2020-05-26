// importa modelo do hash
import IHashProvider from '../models/IHashProvider';

// implementa nossa interface, garantindo tendo os métodos compareHash e generateHash
class FakeHashProvider implements IHashProvider {
    // recebe payload (string qualqer q vai ser a pass) retorna Promise<string> que é o hash
    public async generateHash(payload: string): Promise<string> {
        // retorna senha sem hash pq nos testes n precisa gravar senha cripto
        return payload;
    }

    // recebe payload (string qualqer q vai ser a pass) e a senha criptografada 'hashed'
    // e retorna boolean
    public async compareHash(
        payload: string,
        hashed: string,
    ): Promise<boolean> {
        // comparo se a senha é a msma coisa que está armazenado no hashed
        return payload === hashed;
    }
}
export default FakeHashProvider;
