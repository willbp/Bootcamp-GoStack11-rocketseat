import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import Input from '../../components/Input';

// crio mock do useField retornando formato para que input funcione bem
jest.mock('@unform/core', () => {
  return {
    useField() {
      return {
        fieldName: 'email',
        defaultValue: '',
        error: '',
        registerField: jest.fn(),
      };
    },
  };
});

describe('Input component', () => {
  // qdo chamar o compónente input, deve ter input em tela
  it('should be able to render an input', () => {
    const { getByPlaceholderText } = render(
      <Input name="email" placeholder="E-mail" />,
    );
    // espero que ele exista
    expect(getByPlaceholderText('E-mail')).toBeTruthy();
  });
});

// qdo user da foco no input da o resultado visual q eu espero
it('should render highlight on input focus', async () => {
  const { getByPlaceholderText, getByTestId } = render(
    <Input name="email" placeholder="E-mail" />,
  );

  const inputElement = getByPlaceholderText('E-mail');
  // seleciona este input
  const containerElement = getByTestId('input-container');
  // da foco no elemento
  fireEvent.focus(inputElement);

  // teste para focus
  await wait(() => {
    // espero que meu container tenha um estilo
    expect(containerElement).toHaveStyle('border-color: #FF9000;');
    expect(containerElement).toHaveStyle('color: #FF9000;');
  });

  // teste para blur
  fireEvent.blur(inputElement);

  await wait(() => {
    expect(containerElement).not.toHaveStyle('border-color: #FF9000;');
    expect(containerElement).not.toHaveStyle('color: #FF9000;');
  });
});

// container deve container com borda alaranjada qdo fica preenchido
it('should keep input border when input had value', async () => {
  const { getByPlaceholderText, getByTestId } = render(
    <Input name="email" placeholder="E-mail" />,
  );

  const inputElement = getByPlaceholderText('E-mail');
  const containerElement = getByTestId('input-container');

  fireEvent.change(inputElement, { target: { value: 'johndoe@gmail.com' } });

  fireEvent.blur(inputElement);

  await wait(() => {
    expect(containerElement).toHaveStyle('color: #FF9000;');
  });
});
