// useContext= hook=gancho para pegar informações do nosso contexto
import React, { useRef, useCallback, useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link } from 'react-router-dom'; // fazer navegação
import logoImg from '../../assets/logo.svg';
import { Container, Content, Background, AnimationContainer } from './styles';
import Button from '../../components/Button';
import Input from '../../components/Input';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
  password: string;
}

const ForgotPassword: React.FC = () => {
  // criando estado para dar loading na tela
  const [loading, setLoading] = useState(false);
  // useRef para ter acesso direto ao formulário
  // tipo da referência FormHandles libera funções pra pegar valor do inpute/tratar input
  const formRef = useRef<FormHandles>(null);

  // const history = useHistory();

  const { addToast } = useToast(); // add nova imagem de Toast

  // recebe dados (data) do form, mesma ideia de função transformada em arrow function
  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        // carrega o loading
        setLoading(true);
        // se der sucesso não aparece erros
        formRef.current?.setErrors({});

        // valida objeto inteiro no shape'formato'
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
        });
        // dados q recebi do input (nome, email e senha) e retorna todos erros de 1x só (abortEarly)
        await schema.validate(data, { abortEarly: false });

        // recuperação de senha POR FAZER
        await api.post('/password/forgot', { email: data.email });

        // Toast de recuperação de senha
        addToast({
          type: 'success',
          title: 'E-mail de recuperação enviado',
          description: `Enviamos um e-mail para confirmar a recuperação de senha, cheque sua caixa de entrada.`,
        });

        // history.push('/dashboard');
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
          title: 'Erro na recuperação de senha',
          description:
            'Ocorreu um erro ao tentar realizar a recuperação de senha, tente novamente.',
        });
      } finally {
        // depois de executar o try e/ou ctach ele troca load para false
        setLoading(false);
      }
    },
    [addToast],
  ); // toda var externa utilizada com useCallback/effect tem q por nas dependencias aqui acima
  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>
            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Button loading={loading} type="submit">
              Recuperar
            </Button>
          </Form>

          <Link to="/">
            <FiLogIn />
            Voltar ao login
          </Link>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  );
};
// oq tem aqui faz a tag printar no App.tsx

export default ForgotPassword;
