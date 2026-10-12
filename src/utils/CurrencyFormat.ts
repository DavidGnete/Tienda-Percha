export const CurrencyFormat =(value: number) => {

    // Pesos colombianos sin decimales: 30000 -> "$ 30.000"
    return new Intl.NumberFormat('es-CO',{
        style:'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0

    }).format(value);

};