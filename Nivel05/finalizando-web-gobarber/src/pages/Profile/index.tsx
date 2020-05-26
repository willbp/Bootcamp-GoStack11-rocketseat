import React, { useCallback, useRef } from 'react';
import { FiMail, FiUser, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi';
// FormHandles interface q libera funções do input (setError,getFieldValue,etc)
import { FormHandles } from '@unform/core';
// unform da rocket pra web, adicionado na tag form como Form
import { Form } from '@unform/web';
// biblioteca de validação de senha,email,etc
import * as Yup from 'yup';
// importação a tratativa de erros dos inputs
import { useHistory, Link } from 'react-router-dom';
import getValidationErrors from '../../utils/getValidationErrors';

// é necessário dizer para o unform os campos necessários para
// ele monitorar o valor trazendo o valor quando eu der submit
// para isso vai ser criado a lógica de registro dentro de index.tsx(Input)
// Nosso input;tsx é utilizado pra todos inputs da app.

import { Container, Content, AvatarInput } from './styles';
import Button from '../../components/Button';
import Input from '../../components/Input';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
}

const Profile: React.FC = () => {
  // useRef para ter acesso direto ao formulário
  // tipo da referência FormHandles libera funções pra pegar valor do inpute/tratar input
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();

  // pegar os dados do user logado
  const { user } = useAuth();

  // recebe dados (data) do form, mesma ideia de função transformada em arrow function
  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        // se der sucesso não aparece erros
        formRef.current?.setErrors({});

        // valida objeto inteiro no shape'formato'
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, 'No mínimo 6 digitos'),
        });
        // dados q recebi do input (nome, email e senha) e retorna todos erros de 1x só (abortEarly)
        await schema.validate(data, { abortEarly: false });

        await api.post('/users', data);

        history.push('/');

        addToast({
          type: 'success',
          title: 'Cadastro realizado com sucsso',
          description: 'Você já pode fazer seu logon no GoBarber',
        });
      } catch (err) {
        // console.log(err);
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err); // recebe erros do input
          formRef.current?.setErrors(errors);
          return;
        } // se não foi erro da validação do Yup dispara um Toast
        // console.log(err);
        addToast({
          // envia os parâmetros do toast
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Ocorreu um erro ao fazer o cadastro, tente novamente.',
        });
      }
    },
    [addToast, history],
  );
  console.log(user);

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <button type="button">
              <FiCamera />
            </button>
          </AvatarInput>

          <h1>Meu perfil</h1>

          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />

          <Input
            containerStyle={{ marginTop: 24 }}
            name="old_password"
            icon={FiLock}
            type="password"
            placeholder="Senha atual"
          />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Nova senha"
          />
          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirmar senha"
          />

          <Button type="submit">Confirmar alterações</Button>
        </Form>
      </Content>
    </Container>
  );
};
// oq tem aqui faz a tag printar no App.tsx

export default Profile;
