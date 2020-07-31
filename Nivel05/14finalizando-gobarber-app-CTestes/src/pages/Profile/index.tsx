import React, { useRef, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native'; // ativando navegação entre páginas
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker';
import { View, ScrollView, TextInput, Alert } from 'react-native'; // para teclado KeyboardAvoidView+Platform
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {
  Container,
  Title,
  BackButton,
  UserAvatarButton,
  UserAvatar,
} from './styles';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();

  // behavior = comportamento dela Se o So for ios = padding, no android undefined
  // Title ficou com a View ao redor porque é o jeito para funcionar junto com a função do keyboard
  // se não ele não mexe para cima e para baixo junto com os inputs qdo clicado
  // ScrollView configurado para se tiver mais campos ou a tela for pequena o user poder dar scroll

  // navegação entre páginas
  const navigation = useNavigation();

  // useRef utilizado para manipular um elemento de maneira direta e não por evento (realizar submit qdo clicar no button)=alguma Ref
  // // métodos disponiveis para manipular Form de maneira direta FormHandles
  const formRef = useRef<FormHandles>(null);

  const emailInputRef = useRef<TextInput>(null); // useRef do tipo TextInput = para liberar métodos no passwordInputRef.current.algo
  const oldPasswordInputRef = useRef<TextInput>(null); // useRef do tipo TextInput = para liberar métodos no passwordInputRef.current.algo
  const passwordInputRef = useRef<TextInput>(null); // useRef do tipo TextInput = para liberar métodos no passwordInputRef.current.algo
  const confirmPasswordInputRef = useRef<TextInput>(null); // useRef do tipo TextInput = para liberar métodos no passwordInputRef.current.algo

  // recebe dados (data) do form, mesma ideia de função transformada em arrow function
  const handleSignUp = useCallback(
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
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        console.log(data);

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        Alert.alert('Perfil atualizado com sucesso!');
        // navigation.navigate('SignIn'); // ou navigation.goBack();
        navigation.goBack();
      } catch (err) {
        // console.log(err);
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err); // recebe erros do input
          formRef.current?.setErrors(errors);
          return;
        } // se não foi erro da validação do Yup dispara um Toast
        Alert.alert(
          'Erro na atualização do perfil',
          'Ocorreu um erro ao atualizar seu perfil, tente novamente.',
        );
      }
    },
    [navigation, updateUser],
  );

  const handleUpdateAvatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Selecione um avatar',
        cancelButtonTitle: 'Cancelar',
        takePhotoButtonTitle: 'Usar câmera',
        chooseFromLibraryButtonTitle: 'Escolher da galeria',
      },
      (response) => {
        if (response.didCancel) {
          return;
        }
        if (response.error) {
          console.log(response.error);
          Alert.alert('Erro ao atualizar seu avatar.');
          return;
        }
        const source = { uri: response.uri };

        const data = new FormData();

        data.append('avatar', {
          type: 'image/jpeg',
          name: `${user.id}.jpg`,
          uri: response.uri,
        });
        api
          .patch('users/avatar', data)
          .then((apiResponse) => {
            updateUser(apiResponse.data);
          })
          .catch((error) => console.log(error));
      },
    );
  }, [updateUser, user.id]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flex: 1 }}
      >
        <Container>
          <BackButton onPress={handleGoBack}>
            <Icon name="chevron-left" size={22} color="#999591" />
          </BackButton>

          <UserAvatarButton onPress={handleUpdateAvatar}>
            <UserAvatar source={{ uri: user.avatar_url }} />
          </UserAvatarButton>

          <View>
            <Title>Meu perfil</Title>
          </View>

          <Form initialData={user} ref={formRef} onSubmit={handleSignUp}>
            <Input
              name="name"
              icon="user"
              placeholder="Nome"
              autoCapitalize="words" // deixa caixa alta na primeira letra de cada palavra
              returnKeyType="next" // botão teclado setado como next (campo)
              onSubmitEditing={() => {
                // disparar um focus para o input de baixo (qdo next)
                emailInputRef.current?.focus();
              }}
            />
            <Input
              ref={emailInputRef} // referencia de ir pro proximo input
              name="email"
              icon="mail"
              placeholder="E-mail"
              keyboardType="email-address" // keyboard com @
              autoCorrect={false} // tira auto correção do e-mail
              autoCapitalize="none" // nenhuma palavra em caixa alta
              returnKeyType="next" // botão teclado setado como next (campo)
              onSubmitEditing={() => {
                // disparar um focus para o input de baixo (qdo next)
                oldPasswordInputRef.current?.focus();
              }}
            />
            <Input
              ref={oldPasswordInputRef} // focus no input a partir do campo de cima
              name="old_password"
              icon="lock"
              placeholder="Senha atual"
              containerStyle={{ marginTop: 16 }}
              secureTextEntry // type password
              textContentType="newPassword" // como ta criando novo user, o user cria senha, e n usa sugestão do sistema
              returnKeyType="next" // configura botão de envio do teclado
              onSubmitEditing={() => passwordInputRef.current?.focus()} // disparada qdo user clica no botão do canto (envia os dados neste caso)
            />

            <Input
              ref={passwordInputRef} // focus no input a partir do campo de cima
              name="password"
              icon="lock"
              placeholder="Nova senha"
              secureTextEntry // type password
              textContentType="newPassword" // como ta criando novo user, o user cria senha, e n usa sugestão do sistema
              returnKeyType="next" // configura botão de envio do teclado
              onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
            />

            <Input
              ref={confirmPasswordInputRef} // focus no input a partir do campo de cima
              name="password_confirmation"
              icon="lock"
              placeholder="Confirmar Senha"
              secureTextEntry // type password
              textContentType="newPassword" // como ta criando novo user, o user cria senha, e n usa sugestão do sistema
              returnKeyType="send" // configura botão de envio do teclado
              onSubmitEditing={() => formRef.current?.submitForm()}
            />

            <Button onPress={() => formRef.current?.submitForm()}>
              Confirmar mudanças
            </Button>
          </Form>
        </Container>
      </ScrollView>
    </>
  );
};

export default Profile;
