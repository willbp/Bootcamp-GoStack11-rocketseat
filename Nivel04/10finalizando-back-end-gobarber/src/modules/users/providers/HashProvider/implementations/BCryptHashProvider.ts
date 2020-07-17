// importa os 2 métodos
import { hash, compare } from 'bcryptjs';

// importa modelo do hash
import IHashProvider from '../models/IHashProvider';

// implementa nossa interface, garantindo tendo os métodos compareHash e generateHash
class BCryptHashProvider implements IHashProvider {
    // recebe payload (string qualqer q vai ser a pass) retorna Promise<string> que é o hash
    public async generateHash(payload: string): Promise<string> {
        return hash(payload, 8);
    }

    // recebe payload (string qualqer q vai ser a pass) e a senha criptografada 'hashed'
    // e retorna boolean
    public async compareHash(
        payload: string,
        hashed: string,
    ): Promise<boolean> {
        return compare(payload, hashed);
    }
}
export default BCryptHashProvider;
