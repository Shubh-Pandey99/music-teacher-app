
import { describe, it, expect } from 'vitest'
import { rateLimit } from '../src/lib/rate-limit'

describe('Rate Limiter', () => {
    it('should allow requests within limit', () => {
        const key = 'test-allow'
        expect(rateLimit(key, 2, 1000)).toBe(true)
        expect(rateLimit(key, 2, 1000)).toBe(true)
    })

    it('should block requests exceeding limit', () => {
        const key = 'test-block'
        rateLimit(key, 1, 1000)
        expect(rateLimit(key, 1, 1000)).toBe(false)
    })
})
