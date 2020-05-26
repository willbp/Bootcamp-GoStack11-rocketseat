import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { isToday, format, parseISO, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FiPower, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import DayPicker, { DayModifiers } from 'react-day-picker';
import logoImg from '../../assets/logo.svg';
import 'react-day-picker/lib/style.css';
import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calendar,
} from './styles';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  hourFormatted: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();

  // seleciona dia seelecionado
  const [selectedDate, setSelectedDate] = useState(new Date());

  // estado que armazena o mês selecionado
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  // verifica disponibilidade do mês, se ele existe/já passou
  // dispara função qdo currentMonth for alterado e user.id
  useEffect(() => {
    api // pega id do provider do backend
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          // query params ano e mês
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      }) // qdo eu tiver 1 resposta, eu pego ela e salvo em setMonthAvailability
      .then((response) => {
        setMonthAvailability(response.data);
      });
  }, [currentMonth, user.id]);

  // carregar agendamentos sempre q o user seleciona um dia diferente
  useEffect(() => {
    api
      // retorna um array de Appointments
      .get<Appointment[]>('/appointments/me', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      }) // quando eu tiver um resultado para isso eu salvo em
      .then((response) => {
        const appointmentsFormatted = response.data.map((appointment) => {
          // retorna todo agendamento em sí+hourFormatted
          return {
            ...appointment, // pega data string e transforma date do JS
            hourFormatted: format(parseISO(appointment.date), 'HH:mm'),
          };
        });
        setAppointments(appointmentsFormatted);
      });
  }, [selectedDate]);

  // MEMO armazena valor específico, e diz qdo é pra ser recarregado 'usecallback logica'
  const disabledDays = useMemo(() => {
    // user disabledDays no daypicker para desabilitar dias
    const dates = monthAvailability
      // filtro os dias indisponíveis (monthDay)
      .filter((monthDay) => monthDay.available === false)
      // map percorre array e retorna outro array em outro formato
      .map((monthDay) => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        return new Date(year, month, monthDay.day); // retorno do novo array
      });

    return dates;
  }, [monthAvailability, currentMonth]);

  // variável para formatar novo valor clicado no calendário pelo usuário
  const selectedDateAsText = useMemo(() => {
    // retorna o dia clicado reformatado
    return format(selectedDate, "'Dia' dd 'de' MMMM", {
      locale: ptBR,
    });
  }, [selectedDate]); // recalcula sempre q o user clicar em outro dia

  // pega o dia da semana selecionado 'segunda, terça'
  const selectedWeekDay = useMemo(() => {
    const diaSemana = format(selectedDate, 'cccc', {
      locale: ptBR,
    });
    if (diaSemana !== 'sábado' && diaSemana !== 'domingo') {
      return `${diaSemana}-feira`;
    }
    return diaSemana;
  }, [selectedDate]);

  // agendamentos da manha
  const morningAppointments = useMemo(() => {
    // pego todos appointments e filtro
    return appointments.filter((appointment) => {
      // converto data string para date
      return parseISO(appointment.date).getHours() < 12;
    });
  }, [appointments]);

  // agendamentos da tarde
  const afternoonAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      return parseISO(appointment.date).getHours() >= 12;
    });
  }, [appointments]);

  // pega primeiro agendamento a partir do horário atual
  const nextAppointment = useMemo(() => {
    // retorna todos agendamentos encontrar/verificar o
    // primeiro q o horário é dps de agora'
    return appointments.find((appointment) => {
      return isAfter(parseISO(appointment.date), new Date());
    });
  }, [appointments]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Bem vindo,</span>

              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {/* mostra o spam por completo somente se for hoje */}
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>
          {/* verifica se é hj e se tem um nextAppointment */}
          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Agendamento a seguir</strong>
              <div>
                <img
                  src={nextAppointment.user.avatar_url}
                  alt={nextAppointment.user.name}
                />
                <strong>William</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hourFormatted}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>
            {morningAppointments.length === 0 && (
              <p>Nenhum agendamento encontrado neste período</p>
            )}

            {morningAppointments.map((appointment) => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>
                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
          <Section>
            <strong>Tarde</strong>
            <strong>Manhã</strong>
            {afternoonAppointments.length === 0 && (
              <p>Nenhum agendamento encontrado neste período</p>
            )}

            {afternoonAppointments.map((appointment) => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>
                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            // transcreve dia da semana
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            // não permite selecionar meses anteriores ao mês atual
            fromMonth={new Date()}
            // desabilitar dias da semana
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            // adiciona classe em 1 dia da semana em especifico
            // classe available nos dias 1,2,3,4,5
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            // passa o mês
            onMonthChange={handleMonthChange}
            // dia selecionado quando eu clico
            selectedDays={selectedDate}
            // habilita clique nos dias
            onDayClick={handleDateChange}
            // Transcreve meses do ano
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};
export default Dashboard;
