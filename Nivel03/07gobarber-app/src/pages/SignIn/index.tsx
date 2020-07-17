import React, { useCallback, useRef } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native'; // ativando navegação entre páginas
import { Form } from '@unform/mobile'; // unform para lidar com formulários (lib)
import { FormHandles } from '@unform/core'; // métodos disponiveis para manipular Form de maneira direta
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native'; // para teclado KeyboardAvoidView+Platform
import * as Yup from 'yup';
import { useAuth } from '../../hooks/auth';
import getValidationErrors from '../../utils/getValidationErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import logoImg from '../../assets/logo.png';
import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText,
} from './styles';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  // behavior = comportamento dela Se o So for ios = padding, no android undefined
  // Title ficou com a View ao redor porque é o jeito para funcionar junto com a função do keyboard
  // se não ele não mexe para cima e para baixo junto com os inputs qdo clicado
  // ScrollView configurado para se tiver mais campos ou a tela for pequena o user poder dar scroll

  // navegação entre páginas
  const navigation = useNavigation();
  // useRef utilizado para manipular um elemento de maneira direta e não por evento (realizar submit qdo clicar no button)=alguma Ref
  // // métodos disponiveis para manipular Form de maneira direta FormHandles
  const formRef = useRef<FormHandles>(null);

  const passwordInputRef = useRef<TextInput>(null); // useRef do tipo TextInput = para liberar métodos no passwordInputRef.current.algo

  const { signIn, user } = useAuth();
  console.log(user);

  // recebe dados (data) do form, mesma ideia de função transformada em arrow function
  const handleSignIn = useCallback(async (data: SignInFormData) => {
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
      // history.push('/dashboard');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err); // recebe erros do input
        formRef.current?.setErrors(errors);
        return;
      } // se não foi erro da validação do Yup dispara um Toast
      // console.log(err);

      Alert.alert(
        'Erro na autenticação',
        'Ocorreu um erro ao fazer login, cheque as credenciais.',
      );
    }
  }, []); // toda var externa utilizada com useCallback/effect tem q por nas dependencias aqui acima

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
              <Title>Faça seu logon</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignIn}>
              <Input
                name="email"
                icon="mail"
                placeholder="E-mail"
                autoCorrect={false} // desabilita auto correção
                autoCapitalize="none" // retira caixa alta
                keyboardType="email-address" // tipo e-mail no teclado
                returnKeyType="next" // botão teclado setado como next (campo)
                onSubmitEditing={() => {
                  // disparar um focus para o input de baixo (qdo next)
                  passwordInputRef.current?.focus();
                }}
              />
              <Input
                name="password"
                icon="lock"
                placeholder="Senha"
                ref={passwordInputRef} // focus no input a partir do campo de cima
                secureTextEntry // campo tipo password
                returnKeyType="send" // teclado com botão de envio
                onSubmitEditing={() => {
                  // disparada qdo user clica no botão do canto (envia os dados neste caso)
                  formRef.current?.submitForm();
                }}
              />

              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Entrar
              </Button>
            </Form>

            <ForgotPassword
              onPress={() => {
                console.log('Deu 2');
              }}
            >
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
      </CreateAccountButton>
    </>
  );
};

export default SignIn;
