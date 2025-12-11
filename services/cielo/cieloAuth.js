const axios = require('axios');

const TOKEN_URL = (process.env.CIELO_TOKEN_URL || 'https://cieloecommerce.cielo.com.br/api/public/v2/token').replace(/\/+$/, '');
const CLIENT_ID = process.env.CIELO_CLIENT_ID;
const CLIENT_SECRET = process.env.CIELO_CLIENT_SECRET;

let accessToken = null;
let tokenExpiration = 0;

/**
 * @returns {Promise<string>} - Token de acesso
 */
async function getAccessToken() {

    if (accessToken && Date.now() < tokenExpiration) {
        return accessToken;
    }

    try {
        if (!CLIENT_ID || !CLIENT_SECRET) {
            throw new Error('Credenciais da API Cielo não configuradas. Verifique as variáveis de ambiente.');
        }

        const basicCredentials = Buffer
            .from(`${CLIENT_ID}:${CLIENT_SECRET}`, 'utf8')
            .toString('base64');

        const response = await axios({
            method: 'POST',
            url: TOKEN_URL,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${basicCredentials}`
            },
            data: 'grant_type=client_credentials'
        });

        accessToken = response.data.access_token;
        const expiresInSeconds = Math.max(0, (response.data.expires_in ?? 1200) - 60);
        tokenExpiration = Date.now() + expiresInSeconds * 1000;

        return accessToken;
    } catch (error) {
        console.error('Erro ao obter token de acesso da Cielo:', error.response?.data || error.message);
        throw new Error('Falha na autenticação com a API da Cielo');
    }
}

/**
 * @param {Object} options - Opções da requisição
 * @returns {Promise<Object>} - Resposta da requisição
 */
async function requestWithToken(options) {
    try {
        const token = await getAccessToken();

        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        // requisição
        const response = await axios({
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        });

        return response;
    } catch (error) {
        // tenta renovar o token e repete a requisição
        if (error.response && error.response.status === 401) {
            accessToken = null;
            tokenExpiration = 0;

            // Tenta novamente com um novo token
            return requestWithToken(options);
        }

        throw error;
    }
}

module.exports = {
    getAccessToken,
    requestWithToken
};
