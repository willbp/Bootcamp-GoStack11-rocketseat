//comunicação de serviços
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3333'
});
//comando para exportar a api e vai ser recebida por importação no App.js
export default api;