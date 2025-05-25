


export async function encriptSigns(signs) {
    const encondedText = new TextEncoder().encode(signs);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encondedText);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");   

    return hashHex;
}


export function validateCard(numeroTarjeta) {

    if (!numeroTarjeta) return false;

    const num = numeroTarjeta.replace(/\D/g, '');
    let suma = 0;
    let alternar = false;

    for (let i = num.length - 1; i >= 0; i--) {
        let n = parseInt(num[i], 10);
        if (alternar) {
        n *= 2;
        if (n > 9) n -= 9;
        }
        suma += n;
        alternar = !alternar;
    }

    return suma % 10 === 0;
}


export const getCardType = (number) => {
    const cleaned = number.replace(/\D/g, '');
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    return null;
};

export const formatoCOP = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
});