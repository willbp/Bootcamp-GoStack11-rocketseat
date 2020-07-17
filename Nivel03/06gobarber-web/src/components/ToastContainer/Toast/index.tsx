import React, { useEffect } from 'react';

import {
  FiAlertCircle,
  FiXCircle,
  FiCheckCircle,
  FiInfo,
} from 'react-icons/fi';
import { Container } from './styles';

import { ToastMessage, useToast } from '../../../hooks/toast';

interface ToastProps {
  message: ToastMessage; // pega o tipo de ToastMessage
  style: object; // recebe style
}

const icons = {
  // objeto icons e para cada tipo tem um icon diferente
  info: <FiInfo size={24} />,
  error: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />,
};

// recebe como parâmetro uma propriedade message e tipa ela
const Toast: React.FC<ToastProps> = ({ message, style }) => {
  const { removeToast } = useToast();

  // dispara ação assim q cada toast for exibido em tela
  useEffect(() => {
    // cria var timer e execute dps de x tempo
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 3000);
    // toast criado a tela encima
    // abaixo se o componente acima for removido de outra origem/forma ele cancela o timer
    // se eu retornar de dentro do useEffect uma função, ela vai ser autoexec se o componente deixar
    // de existir (timer) no caso. Então dou clearTimeout pra retirar os 3 segundos
    // ele tira o timer qdo clico no x do toast
    return () => {
      clearTimeout(timer);
    };
  }, [removeToast, message.id]); // dep de message.id e removeToast.

  // {message.description && <p>{message.description}</p>} mostra só se tem algo dentro de message.description
  // onClick={() => removeToast(message.id)} porque se não a função executa direto ao rodar
  // <Container type={message.type} hasDescription={!!MessageChannel.description}> porque é o container q tem as variações de estilização
  // mostra icone + propriedade se n existir é info ---{icons[message.type || 'info']}
  return (
    <Container
      type={message.type}
      hasDescription={!!message.description}
      style={style}
    >
      {icons[message.type || 'info']}
      <div>
        <strong>{message.title}</strong>
        {message.description && <p>{message.description}</p>}
      </div>
      <button onClick={() => removeToast(message.id)} type="button">
        <FiXCircle size={18} />
      </button>
    </Container>
  );
};

export default Toast;
