import React, { useRef, useCallback } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native'; // ativando navegação entre páginas
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native'; // para teclado KeyboardAvoidView+Platform
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import logoImg from '../../assets/logo.png';
import { Container, Title, BackToSignIn, BackToSignInText } from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
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
  const passwordInputRef = useRef<TextInput>(null); // useRef do tipo TextInput = para liberar métodos no passwordInputRef.current.algo

  // recebe dados (data) do form, mesma ideia de função transformada em arrow function
  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
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

        console.log(data);
        await api.post('/users', data);
        Alert.alert(
          'Cadastro realizado com sucesso!',
          'Você já pode fazer o login na aplicação.',
        );
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
          'Erro no cadastro',
          'Ocorreu um erro ao fazer o cadastro, tente novamente.',
        );
      }
    },
    [navigation],
  );

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />

            <View>
              <Title>Crie sua conta</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignUp}>
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
                  passwordInputRef.current?.focus();
                }}
              />
              <Input
                ref={passwordInputRef} // focus no input a partir do campo de cima
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry // type password
                textContentType="newPassword" // como ta criando novo user, o user cria senha, e n usa sugestão do sistema
                returnKeyType="send" // configura botão de envio do teclado
                onSubmitEditing={() => formRef.current?.submitForm()} // disparada qdo user clica no botão do canto (envia os dados neste caso)
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Entrar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignIn onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#fff" />
        <BackToSignInText>Voltar para logon</BackToSignInText>
      </BackToSignIn>
    </>
  );
};

export default SignUp;
