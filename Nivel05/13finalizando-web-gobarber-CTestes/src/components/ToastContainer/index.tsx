import React from 'react';

import { useTransition } from 'react-spring'; // controla animação qdo entra e sai da tela

import { Container } from './styles';

import { ToastMessage } from '../../hooks/toast';

import Toast from './Toast';

interface ToastContainerProps {
  messages: ToastMessage[]; // reaproveito tipagem
}

// passa q ToastContainer vai receber dados do tipo ToastContainerProps (messages)
const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  // mensagens com as transições....1parm= message, 2-função q obtem key da minha msg
  // 3-objeto contendo minhas animações val ini/final
  // posição antes de entrar, qdo entro em tela, e quando sai da tela
  const messagesWithTransitions = useTransition(
    messages,
    (message) => message.id,
    {
      from: { right: '-120%', opacity: 0, transform: 'rotateZ(0deg)' },
      enter: { right: '0%', opacity: 1, transform: 'rotateZ(360deg)' },
      leave: { right: '-120%', opacity: 0, transform: 'rotateZ(0deg)' },
    },
  );
  return (
    // dentro do container vai ser exibido vários Toasts
    // Toast sem type=default type info
    // map das messages para identificar elas inclusive com id de cada uma
    // message={message} envia o message completo para ter acesso ao message dentro de index.tsx(Toast)

    <Container>
      {messagesWithTransitions.map(({ item, key, props }) => (
        <Toast key={key} style={props} message={item} />
      ))}
    </Container>
  );
};
export default ToastContainer;

// hasDescription={!!message.description}, !!=boolean se existe
