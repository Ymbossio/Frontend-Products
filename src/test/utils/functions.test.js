import { describe, it, expect } from 'vitest'
import { encriptSigns, validateCard, getCardType, formatoCOP } from '../../util/functions'

describe('encriptSigns', () => {
  it('debe generar un hash SHA-256 válido en hexadecimal', async () => {
    const result = await encriptSigns('test123')
    expect(result).toMatch(/^[a-f0-9]{64}$/)
  })
})

describe('validateCard', () => {
  it('debe validar un número de tarjeta válido (Visa)', () => {
    const valid = validateCard('4111 1111 1111 1111')
    expect(valid).toBe(true)
  })

  it('debe rechazar un número de tarjeta inválido', () => {
    const invalid = validateCard('1234 5678 9012 3456')
    expect(invalid).toBe(false)
  })

  it('debe manejar entradas vacías o nulas', () => {
    expect(validateCard(null)).toBe(false)
    expect(validateCard('')).toBe(false)
  })
})

describe('getCardType', () => {
  it('debe identificar tarjetas Visa', () => {
    expect(getCardType('4111 1111 1111 1111')).toBe('visa')
  })

  it('debe identificar tarjetas Mastercard', () => {
    expect(getCardType('5105 1051 0510 5100')).toBe('mastercard')
  })

  it('debe devolver null si no es Visa ni Mastercard', () => {
    expect(getCardType('6011 0009 9013 9424')).toBe(null) // Discover, por ejemplo
  })
})

describe('formatoCOP', () => {
  it('debe formatear correctamente un número como COP', () => {
    const formatted = formatoCOP.format(50000)
    expect(formatted).toBe('$ 50.000') // Esto es lo que devuelve en 'es-CO' con Node
  })
})

