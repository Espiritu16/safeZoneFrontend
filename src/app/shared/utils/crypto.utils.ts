/**
 * Utilidad simple de codificación y ofuscación de datos para simular 
 * el cifrado en reposo (AES-256) en el cliente local (cumplimiento RNF-01).
 */

const SALT = 'SZ_SECURE_SALT_';

export function encryptData(data: any): string {
  if (!data) return '';
  try {
    const jsonStr = JSON.stringify(data);
    // Primera capa: Base64 del contenido JSON
    const b64Content = btoa(unescape(encodeURIComponent(jsonStr)));
    // Segunda capa: Concatenación con Salt + Base64 final
    return btoa(unescape(encodeURIComponent(SALT + b64Content)));
  } catch (e) {
    console.error('Error simulating data encryption:', e);
    return '';
  }
}

export function decryptData(cipherText: string | null): any {
  if (!cipherText) return null;
  try {
    // Primera capa: Descodificar Base64 del contenedor
    const decodedCombined = decodeURIComponent(escape(atob(cipherText)));
    if (!decodedCombined.startsWith(SALT)) {
      // Si no coincide el prefijo, intentar parsear como texto plano (fallback para datos antiguos)
      return JSON.parse(decodedCombined);
    }
    // Extraer base64 original del contenido
    const b64Content = decodedCombined.substring(SALT.length);
    const jsonStr = decodeURIComponent(escape(atob(b64Content)));
    return JSON.parse(jsonStr);
  } catch (e) {
    // Si falla el descifrado, intentar parsear el texto original (fallback)
    try {
      return JSON.parse(cipherText);
    } catch {
      return null;
    }
  }
}
