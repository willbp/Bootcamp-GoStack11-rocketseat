import React from 'react';
// RectButtonProperties são as propriedades que o button pode receber
import { RectButtonProperties } from 'react-native-gesture-handler';
import { Container, ButtonText } from './styles';

interface ButtonProps extends RectButtonProperties {
  // propriedades a mais 'color' para cores de botão..
  // mas nesse caso vai reespecificar a propriedade chindren
  // forçando a ser um texto (todo botão precisa ter um texto dentro)
  children: string;
}

// todo texto pra ser exibido direto precisa de uma tag Text = ButtonText ao redor pra ser exibido o conteudo de children
// ...rest pega todas outras propriedades que um botão poderia acessar
// pega ela e repassa dentro do container
// pois nosso container é o RectButton
const Button: React.FC<ButtonProps> = ({ children, ...rest }) => (
  <Container {...rest}>
    <ButtonText>{children}</ButtonText>
  </Container>
);

export default Button;
