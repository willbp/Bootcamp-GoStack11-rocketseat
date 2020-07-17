// useContext= hook=gancho para pegar informações do nosso contexto
import React, { useRef, useCallback } from 'react';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { useHistory, useLocation } from 'react-router-dom';
import { Container, Content, Background, AnimationContainer } from './styles';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  // useRef para ter acesso direto ao formulário
  // tipo da referência FormHandles libera funções pra pegar valor do inpute/tratar input
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast(); // add nova imagem de Toast

  const history = useHistory();

  const location = useLocation();

  // recebe dados (data) do form, mesma ideia de função transformada em arrow function
  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        // se der sucesso não aparece erros
        formRef.current?.setErrors({});

        // valida objeto inteiro no shape'formato'
        const schema = Yup.object().shape({
          password: Yup.string().required('Senha obrigatória'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'A confirmação deve ser igual à nova senha escolhida',
          ),
        });
        // dados q recebi do input (nome, email e senha) e retorna todos erros de 1x só (abortEarly)

        await schema.validate(data, {
          abortEarly: false,
        });

        const { password, password_confirmation } = data;
        const token = location.search.replace('?token=', '');

        if (!token) {
          throw new Error();
        }

        await api.post('/password/reset', {
          password,
          password_confirmation,
          token,
        });

        addToast({
          type: 'success',
          title: 'Senha Resetada com Sucesso!',
          description:
            'A sua senha foi resetada. Por favor, faça o login com a nova senha!',
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        } // se não foi erro da validação do Yup dispara um Toast
        // console.log(err);
        addToast({
          type: 'error',
          title: 'Erro ao Resetar Senha',
          description: 'Ocorreu um erro ao resetar sua senha, tente novamente.',
        });
      }
    },
    [addToast, history, location.search],
  ); // toda var externa utilizada com useCallback/effect tem q por nas dependencias aqui acima
  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar Senha</h1>
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Nova Senha"
            />

            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirmação da Senha"
            />

            <Button type="submit">Alterar Senha</Button>
          </Form>

          {/* <Link to="/">
            <FiLogIn />
            Voltar para login
          </Link> */}
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  );
};
// oq tem aqui faz a tag printar no App.tsx

export default ResetPassword;
