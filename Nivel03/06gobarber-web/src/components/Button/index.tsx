import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

// se não sobrescreve nada nem cria nova propriedade
// converte interface em um 'type'
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

// passando por parametro ButtonProps para FC, habilita todas propriedades q um button pode
// receber disponiveis para acessar aqui dentro
// recebo texto do elemento em index.tsx(SignIn)=Entrar em (children) e resto das props
// ficam armazenadas em 'rest'
const Button: React.FC<ButtonProps> = ({ children, ...rest }) => (
  <Container type="button" {...rest}>
    {children}
  </Container>
);

export default Button;
