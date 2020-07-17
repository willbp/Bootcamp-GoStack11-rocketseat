import styled, { css } from 'styled-components';
import Tooltip from '../Tooltip';

interface ContainerProps {
  isFocused: boolean; // para utilizar isFocused no input
  isFilled: boolean; // para dar foco no icon qdo input estiver preenchido
  isErrored: boolean; // para dar foco no icon qdo input estiver preenchido
}

export const Container = styled.div<ContainerProps>`
  background: #232129;
  border-radius: 10px;
  border: 2px solid #232129;
  padding: 16px;
  width: 100%;
  color: #666360;

  display: flex;
  align-items: center;

  & + div {
    margin-top: 8px;
  }

/**Acesso propriedades(props) do meu componente
e quando isErrored for true (estiver sem preencher) utiliza este css do (styled components)
 */
${(props) =>
  props.isErrored &&
  css`
    border-color: #c53030;
  `}

  /**Acesso propriedades(props) do meu componente
e quando isFocused for true utiliza este css do (styled components)
 */
  ${(props) =>
    props.isFocused &&
    css`
      color: #ff9000;
      border-color: #ff9000;
    `}

      /**Acesso propriedades(props) do meu componente
e quando isFilled for true (estiver sem preencher) utiliza este css do (styled components)
 */
  ${(props) =>
    props.isFilled &&
    css`
      color: #ff9000;
    `}



  input {
    flex: 1;
    background: transparent;
    border: 0;
    color: #f4ede8;

    &::placeholder {
      color: #666360;
    }
  }
  svg {
    margin-right: 16px;
  }
`;
export const Error = styled(Tooltip)`
  /*herança de tooltip*/
  height: 20px;
  margin-left: 16px; /*delimita um espaço pro icon, (letras n ultrapassam ele) */
  svg {
    margin: 0;
  }
  span {
    background: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
