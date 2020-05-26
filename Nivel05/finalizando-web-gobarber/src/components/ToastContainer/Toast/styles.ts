import styled, { css } from 'styled-components';
import { animated } from 'react-spring';

interface ContainerToastProps {
  type?: 'success' | 'error' | 'info';
  hasDescription: number;
}

const toastTypeVariations = {
  info: css`
    background: #ebf8ff;
    color: #3172b7;
  `,

  success: css`
    background: #e6fffa;
    color: #2e656a;
  `,

  error: css`
    background: #fddede;
    color: #c53030;
  `,
};

// passa ToastProps pra pegar o type
export const Container = styled(animated.div)<ContainerToastProps>`
  width: 360px;

  position: relative;
  padding: 16px 30px 16px 16px;
  border-radius: 10px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);

  display: flex;

  /**um toast q vem seguido de outro toast */
  & + div {
    margin-top: 8px;
  }

  /*vou pegar as propriedades e mostrar dentro o toastTypeVariations
  pegando o props.type se n existe será o info*/
  ${(props) => toastTypeVariations[props.type || 'info']}

  /**svg q está dentro do toast */
  > svg {
    margin: 4px 12px 0 0;
  }

  div {
    flex: 1;

    p {
      margin-top: 4px;
      font-size: 14px;
      opacity: 0.8;
      line-height: 20px;
    }
  }
  button {
    position: absolute;
    right: 16px;
    top: 19px;
    opacity: 0.6;
    border: 0;
    background: transparent;
    color: inherit;
  }
  /**verifica se tem descrição, se n tiver aplica css a mais */
  ${(props) =>
    !props.hasDescription &&
    css`
      align-items: center;

      svg {
        margin-top: 0;
      }
    `}
`;
