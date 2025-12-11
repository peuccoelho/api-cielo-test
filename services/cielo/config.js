const API_BASE = (process.env.CIELO_API_BASE || 'https://cieloecommerce.cielo.com.br/api/public/v1').replace(/\/+$/, '');

const ENDPOINTS = {
    PRODUCTS: `${API_BASE}/products`
};

module.exports = {
    ENDPOINTS
};
