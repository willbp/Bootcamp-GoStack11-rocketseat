import React, { useCallback, useRef, ChangeEvent } from 'react';
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
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  // useRef para ter acesso direto ao formulário
  // tipo da referência FormHandles libera funções pra pegar valor do inpute/tratar input
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();

  // pegar os dados do user logado
  const { user, updateUser } = useAuth();

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
            .required('Email obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: (val) => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: (val) => !!val.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), null], 'Confirmação incorreta'),
        });

        // dados q recebi do input (nome, email e senha) e retorna todos erros de 1x só (abortEarly)
        await schema.validate(data, { abortEarly: false });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          // unir 2 obj
          // esses campos sempre tem que estar preenchidos
          name,
          email,
          ...(old_password // se existir tem q ter completado os 3 campos
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        history.push('/dashboard');

        addToast({
          type: 'success',
          title: 'Perfil atualizado!',
          description:
            'Suas informações do perfil foram atualizadas com sucesso!',
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
          title: 'Erro na atualização',
          description: 'Ocorreu um erro ao atualizar perfil, tente novamente.',
        });
      }
    },
    [addToast, history, updateUser],
  );

  // evento do react
  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      // se existir o arquivo do target selecionado
      if (e.target.files) {
        // simula o MultiPartFormData pra pegar arquivo e enviar
        const data = new FormData();
        // adicionar arquivo
        data.append('avatar', e.target.files[0]);

        api.patch('/users/avatar', data).then((response) => {
          updateUser(response.data);
          // assim q ele atualizar o user
          addToast({
            type: 'success',
            title: 'Avatar atualizado',
          });
        });

        console.log(e.target.files[0]);
      }
    },
    [addToast, updateUser],
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
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
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
