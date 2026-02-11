export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

export const formatPrice = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
};

// Simple alternate version used in some components
export const formatBRL = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};
