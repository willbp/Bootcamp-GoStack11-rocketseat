import React, {
  useState, // vai anotar quando input recebeu foco ou não
  useCallback,
  useEffect,
  useRef,
  useImperativeHandle, // useImperativeHandle este hook serve para passar funcionalidade de um componente filho para um componente pai
  forwardRef, // pare receber um RefForwardingComponent é necessário o forwardRef por volta do export default
} from 'react';
// todas propriedades q um input pode receber no react native
import { TextInputProps } from 'react-native';
import { useField } from '@unform/core'; // registrar campo de dentro do form

import { Container, TextInput, Icon } from './styles';

interface InputProps extends TextInputProps {
  // recebe todas propriedades e mais 2
  name: string; // para utilizar unform (obrigatório)
  icon: string; // colocar icones
  containerStyle?: {};
}

interface InputValueReference {
  value: string; // dentro dessa interface vai ter uma propriedade value q vai receber um string
}

interface InputRef {
  focus(): void;
}

// repasso todas propriedades q vou receber aqui dentro
// não pega name e nome. E todo o resto repassa dentro do TextInput
// RefForwardingComponent como se fosse o FC porém é único que aceita receber uma ref. e ele recebe 2 parametros
// tipo da ref q é InputRef + InputProps
const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  { name, icon, containerStyle = {}, ...rest },
  ref,
) => {
  const inputElementRef = useRef<any>(null); // para setar valor dinamicamente

  const { registerField, defaultValue = '', fieldName, error } = useField(name); // informações necessárias para cadastrar input no unform
  const inputValueRef = useRef<InputValueReference>({ value: defaultValue }); // recebe formato da variavel e inicia vazio

  // criar 2 estados
  const [isFocused, setIsFocused] = useState(false); // se ele está clicado
  const [isFilled, setIsFilled] = useState(false); // se ele está preenchido

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    // se o input tem algum valor
    if (inputValueRef.current.value) {
      setIsFilled(true);
    } else {
      setIsFilled(false);
    } // poderia ser escrito direto setIsFilled(!!inputValueRef.current.value);
  }, []);

  // recebe ref e, 2 elemento é uma função q retorna quais informações queremos utilizar dentro dessa ref neste caso é (focus)
  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus(); // realiza focus dentro deste input
    },
  }));

  // assim q este elemento for exibido em tela eu registro ele dentro do unform
  // onChangeText=oq vai acontecer com este input qdo tiver um novo valor digitado dentro dele
  // value=pega novo valor
  // e coloca dentro de inputValueRef.current.value = value ou seja ele pega o texto digitado pelo user e preenche value de dentro de inputValueRef
  useEffect(() => {
    registerField({
      name: fieldName, // obrigatória
      ref: inputValueRef.current,
      path: 'value', // onde busca valor do input
      setValue(ref: any, value: string) {
        // o que vai acontecer com o input qdo receber um novo valor do unform (forma manual)
        inputValueRef.current.value = value;
        inputElementRef.current.setNativeProps({ text: value }); // setar prop nativa do meu elemento nativo dentro do android
        // linha acima muda visualmente o texto que ta dentro do input
      },
      // oq vai acontecer com esse input quando unform precisar limpar ele
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current.clear(); // limpa conteudo
      },
    });
  }, [fieldName, registerField]); // dependencias do useEffect

  // iErrored !!se o erro tem alguma informação dentro, se n esta vazio manda true
  return (
    <Container style={containerStyle} isFocused={isFocused} isErrored={!!error}>
      <Icon
        name={icon}
        size={20}
        color={isFocused || isFilled ? '#ff9000' : '#666360'}
      />
      <TextInput
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        ref={inputElementRef}
        keyboardAppearance="dark"
        placeholderTextColor="#666360"
        defaultValue={defaultValue}
        onChangeText={(value) => {
          inputValueRef.current.value = value;
        }}
        {...rest}
      />
    </Container>
  );
};
export default forwardRef(Input);
