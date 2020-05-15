
//define formato de objeto "array mista"
interface TechObject{
    title:string;
    experience: number;
}

//interrogação torna-se opcional
interface CreateUserData{
    name?: string;
    email: string;
    password: string;
    techs: Array<string|TechObject>; //quando for de tipo variável
    //techs: string[]; //quando for tipo unico
}

//:CreateUserData = tipo desse objeto inteiro
export default function createUser ({name, email, password}:CreateUserData){
    //createUser (name='', email: string, passworld: string){
    //desestruturação
    //
    
    const user={
        name,
        email,
        password,
    }
    return user;
}