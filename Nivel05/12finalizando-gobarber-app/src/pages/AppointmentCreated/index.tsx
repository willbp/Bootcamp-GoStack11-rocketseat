import React, { useCallback, useMemo } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Container,
  Title,
  Description,
  OkButton,
  OkButtonText,
} from './styles';

interface RouteParams {
  date: number;
}

// cria componente AppointmentCreated do tipo React.FC e mostra View vazia
const AppointmentCreated: React.FC = () => {
  // navega para uma tela mas reseta (para não funcionar o voltar)
  const { reset } = useNavigation();

  // pegar parametro date
  const { params } = useRoute();

  // atribuir tipagem (date) dentro deste atributo
  const routeParams = params as RouteParams;

  const handleOkPressed = useCallback(() => {
    // reseta para uma rota em especifico ou mais ai teria que por +{},{}
    reset({
      routes: [{ name: 'Dashboard' }],
      // volta para a nomeada de 0 'dashboard se tivesse outra embaixo seria 1
      index: 0,
    });
  }, [reset]);

  // formatar data para description da tela, formata antes do render
  const formattedDate = useMemo(() => {
    return format(
      routeParams.date,
      "EEEE' dia' dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'",
      { locale: ptBR },
    );
  }, [routeParams.date]);

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />

      <Title>Agendamento concluído</Title>
      <Description>{formattedDate}</Description>

      <OkButton onPress={handleOkPressed}>
        <OkButtonText>Ok</OkButtonText>
      </OkButton>
    </Container>
  );
};
export default AppointmentCreated;
