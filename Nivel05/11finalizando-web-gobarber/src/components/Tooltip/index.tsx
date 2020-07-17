import React from 'react';
import { Container } from './styles';

// quais propriedades q o tooltip quer receber
interface ToolTipProps {
  title: string;
  // recebe classe do react; e className n é obrigatório
  className?: string;
}

// recebe title aqui por ToolTipProps
const Tooltip: React.FC<ToolTipProps> = ({
  title,
  className = '',
  children,
}) => {
  return (
    // title exibe os erros dos inputs
    <Container className={className}>
      {children}
      <span>{title}</span>
    </Container>
  );
};

export default Tooltip;
