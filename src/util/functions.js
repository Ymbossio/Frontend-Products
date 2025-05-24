


export async function encriptSigns(signs) {
    const encondedText = new TextEncoder().encode(signs);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encondedText);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");   

    return hashHex;
}