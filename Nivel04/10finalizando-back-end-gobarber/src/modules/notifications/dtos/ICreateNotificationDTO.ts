export default interface ICreateNotificationDTO {
    // pra enviar uma notificação vamos precisar
    content: string; // conteúdo
    recipient_id: string; // id do cara q vai receber notification
}
