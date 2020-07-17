import React, { createContext, useContext, useCallback, useState } from 'react';
// melhor lugar para armazenar qualquer tipo de info = useState
import { uuid } from 'uuidv4';
import ToastContainer from '../components/ToastContainer';

export interface ToastMessage {
  // export para index.tsx-ToastContainer
  // interface para o useState message,setMessage
  id: string; // precisaremos de um id pois pode ter mais de 1 id no msm tempo
  // para quando utilizar map ter uma 'key' verificando qual toast é qual
  type?: 'success' | 'error' | 'info'; // não obrigatório
  title: string;
  description?: string; // não obrigatório
}

interface ToastContextData {
  addToast(message: Omit<ToastMessage, 'id'>): void; // recebe message e o tipo dele: Omit<ToastMessage,'id>'
  removeToast(id: string): void; // recebe um id q é uma string
}

// este contexto segue o padrão de ToastContextData
const ToastContext = createContext<ToastContextData>({} as ToastContextData); // 1xvazio com hack

const ToastProvider: React.FC = ({ children }) => {
  // 'o estado armazena um array de ToastMessage'
  const [messages, setMessages] = useState<ToastMessage[]>([]); // inicializa vazio pq pode ter + d1 toast no msm tempo(salva em array)

  // no meu value preciso dos 2 métodos (add e remove toast) 'ToastProvider'
  const addToast = useCallback(
    ({ type, title, description }: Omit<ToastMessage, 'id'>) => {
      // recebo 'informações' de ToastMessage -id para armazenar nosso Toast
      const id = uuid(); // id unico para o toast
      const toast = {
        id,
        type,
        title,
        description,
      };
      // adicionar no array de mensagens(imutabilidade)
      // cópia de todas messages + novo no final
      // setMessages([...messages, toast]); e outra forma abaixo
      // se eu passar uma 'função qualquer', ela recebe como parametro o valor antigo
      // e retorna todas oldMessages+nova'toas'
      setMessages((oldMessages) => [...oldMessages, toast]);
    },
    [],
  );
  // solicito que a função me envie o id do Toast q é pra ser removido
  const removeToast = useCallback((id: string) => {
    // pego as mensagens antigas e aplico um filtro aplicado
    // pego cada 1 das mensagens e quero todas msg menos a do id que eu recebi e retorno pra função
    setMessages((oldMessages) =>
      oldMessages.filter((message) => message.id !== id),
    );
  }, []);

  // cria contexto do hook base como foi feito no AuthContext

  // <ToastContainer messages={messages}/*recebe message porque é aqui q mostra todo toast*//>
  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  );
};

// retorna os dados contidos no contexto de Toast
function useToast(): ToastContextData {
  // retorna os dados contidos no contexto de Toast
  const context = useContext(ToastContext);

  // se utilizou useToast fora do componente com ToastProvidoer
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  // se estiver sendo utilizado retorna o context;
  return context;
}

export { ToastProvider, useToast };
