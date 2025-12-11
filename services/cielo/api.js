const { requestWithToken } = require('./cieloAuth');
const { ENDPOINTS } = require('./config');

const DEFAULT_SHIPPING = { type: 'WithoutShipping' };

function toCents(value) {
    if (value === undefined || value === null) {
        return 0;
    }

    if (typeof value === 'string') {
        const normalized = value.replace(',', '.').replace(/[^0-9.]/g, '');
        const parsed = Number(normalized);
        return Number.isFinite(parsed) ? Math.round(parsed * 100) : 0;
    }

    const numeric = Number(value);
    return Number.isFinite(numeric) ? Math.round(numeric * 100) : 0;
}

function sanitizePayload(payload) {
    return Object.entries(payload).reduce((acc, [key, val]) => {
        if (val === undefined || val === null || val === '') {
            return acc;
        }

        acc[key] = val;
        return acc;
    }, {});
}

async function criarLinkPagamento({
    name,
    description = '',
    price,
    quantity = 1,
    type = 'Digital',
    orderNumber
} = {}) {
    try {
        if (!name) {
            throw new Error('O campo "name" é obrigatório');
        }

        const priceInCents = toCents(price);
        if (priceInCents <= 0) {
            throw new Error('Informe um preço válido maior que zero');
        }

        const normalizedQuantity = Math.max(1, parseInt(quantity, 10) || 1);

        const payload = sanitizePayload({
            type,
            name,
            description,
            price: priceInCents,
            quantity: normalizedQuantity,
            orderNumber,
            shipping: DEFAULT_SHIPPING
        });

        const response = await requestWithToken({
            method: 'POST',
            url: ENDPOINTS.PRODUCTS,
            data: payload
        });

        return {
            success: true,
            data: response.data,
            status: response.status,
            statusText: response.statusText
        };
    } catch (error) {
        console.error('Erro ao criar link de pagamento:', error);

        return {
            success: false,
            error: error.response?.data || error.message,
            status: error.response?.status || 500,
            statusText: error.response?.statusText || 'Internal Server Error'
        };
    }
}

module.exports = {
    criarLinkPagamento
};
