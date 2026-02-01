import { loginService } from './login'; 

export const PostService = async (rota, dataPost, metodo) => {
    switch (rota) {
        case '/Login':
            // Passamos a rota como o parâmetro 'Section' que o loginService espera
            return await loginService(dataPost, metodo, rota);
        
        default:
            return { status: 404, msg: "Rota POST não encontrada no Dispatcher" };
    }
};
