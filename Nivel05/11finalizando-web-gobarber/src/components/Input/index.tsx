import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';
import { Container, Error } from './styles';

// extends propriedades q já existem num input tradicional nativo(InputHTMLAttributes)
// e recebe parametro de tipagem global HTMLInputElement..
// sobrescreve que o nome nesse caso é obrigatório, pois o natural não é.
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  // recebe um componente como uma propriedade
  containerStyle?: object;
  icon: React.ComponentType<IconBaseProps>;
  // recebe propriedades q o icone vai ter
}

// passando por parametro InputProps para FC, habilita todas propriedades q um input pode
// receber disponiveis para acessar aqui dentro
// recebo icon, e resto das props
// ficam armazenadas em 'rest'
// altera nome de icon para Icon
const Input: React.FC<InputProps> = ({
  name,
  containerStyle = {},
  icon: Icon,
  ...rest
}) => {
  // hook que recebe nome do campo e retorna varias propriedades const {fieldName, defaultValue..}
  const { fieldName, defaultValue, error, registerField } = useField(name);

  // ter acesso do input diretamente na DOM para manipulação (focus, setar valor, etc como fosse JS)
  const inputRef = useRef<HTMLInputElement>(null); // diz q useRef armazena a referencia de um input no HTML

  const [isFocused, setIsFocused] = useState(false); // verifica focus input
  const [isFilled, setIsFilled] = useState(false); // verifica se está preenchido o input
  /**
   *
   */
  // função para tirar foco do input quando estiver sendo digitado mas deixar o icon marcado
  // useCallback forma de criar funções para não ficar recriando/recarregando na memoria sempre q atualiza
  // REGRA: Sempre q for criar uma função dentro de um componente, usar callback
  const handleInputBlur = useCallback(() => {
    // sim, era uma função e se transformou em arrowFunction
    setIsFocused(false);

    // se inputRef tem algum '?.' valor
    if (inputRef.current?.value) {
      setIsFilled(true);
    } else {
      setIsFilled(false);
    }
  }, []); // só dispara dnv se estas variáveis alterarem
  /**
   *
   */
  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []); // só dispara dnv essa função qdo se estas variáveis alterarem
  /**
   *
   *
   */

  // assim q o componente (input) for exibido em tela
  useEffect(() => {
    // eu chamo registerField nativo (faz registro do input)..
    registerField({
      name: fieldName, // e recebe nome do campo fieldName
      ref: inputRef.current, // ref=forma de acessar elemento direto (sem) armazenar em estado, só acessa input por causa do current.
      path: 'value', // de onde o unform nessa 'ref' vai buscar o valor do input (caminho), path contem o valor digitado no input
    });
  }, [fieldName, registerField]); // só dispara dnv o useEffect se estas variáveis alterarem
  /**
   *
   */
  return (
    // se o Icon existir ai mostro ele
    // Container q consegue estilizar ele então isFocused é aplicado aqui para funcionar o setIsFocused
    // transforma variável !!error em boolean
    <Container
      style={containerStyle}
      isErrored={!!error}
      isFilled={isFilled}
      isFocused={isFocused}
    >
      {Icon && <Icon size={20} />}
      <input
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        ref={inputRef}
        defaultValue={defaultValue}
        {...rest}
      />

      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};
export default Input;

/*
// passando por parametro InputProps para FC, habilita todas propriedades q um input pode
// receber disponiveis para acessar aqui dentro
// recebo todas (props) do input e => repassa para input debaixo
const Input: React.FC<InputProps> = (props) => (
  <Container>
    <input {...props} />
  </Container>
);
*/
