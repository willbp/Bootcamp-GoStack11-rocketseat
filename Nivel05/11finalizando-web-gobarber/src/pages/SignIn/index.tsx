// useContext= hook=gancho para pegar informações do nosso contexto
import React, { useRef, useCallback } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom'; // fazer navegação
import logoImg from '../../assets/logo.svg';
import { Container, Content, Background, AnimationContainer } from './styles';
import Button from '../../components/Button';
import Input from '../../components/Input';
import getValidationErrors from '../../utils/getValidationErrors';
// import { AuthContext } from '../../context/AuthContext';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  // useRef para ter acesso direto ao formulário
  // tipo da referência FormHandles libera funções pra pegar valor do inpute/tratar input
  const formRef = useRef<FormHandles>(null);

  // usa o hook para pegar informações vindas de AuthContext
  // const { user, signIn } = useContext(AuthContext); // pega ret func signIn em <AuthContext.Provider
  const { signIn } = useAuth(); // mesma coisa da linha de cima só q menos verboso(novo metodo criado)
  // console.log(user);

  const history = useHistory();

  const { addToast } = useToast(); // add nova imagem de Toast

  // recebe dados (data) do form, mesma ideia de função transformada em arrow function
  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        // se der sucesso não aparece erros
        formRef.current?.setErrors({});

        // valida objeto inteiro no shape'formato'
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().required('Senha obrigatória'),
        });
        // dados q recebi do input (nome, email e senha) e retorna todos erros de 1x só (abortEarly)
        await schema.validate(data, { abortEarly: false });

        await signIn({
          email: data.email,
          password: data.password,
        });
        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err); // recebe erros do input
          formRef.current?.setErrors(errors);
          return;
        } // se não foi erro da validação do Yup dispara um Toast
        // console.log(err);
        addToast({
          // envia os parâmetros do toast
          type: 'error',
          title: 'Erro na autenticação',
          description: 'Ocorreu um erro ao fazer login, cheque as credenciais.',
        });
      }
    },
    [signIn, addToast, history],
  ); // toda var externa utilizada com useCallback/effect tem q por nas dependencias aqui acima
  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu logon</h1>
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />
            <Button type="submit">Entrar</Button>
            <Link to="forgot-password">Esqueci minha senha</Link>
          </Form>

          <Link to="/signup">
            <FiLogIn />
            Criar conta
          </Link>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  );
};
// oq tem aqui faz a tag printar no App.tsx

export default SignIn;
