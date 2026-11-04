import { JSDOM } from 'jsdom'
import DOMPurify from 'dompurify'

/**
 * Sanitizes an HTML string on the server side using DOMPurify + jsdom.
 *
 * Strips:
 *  - <script> and <style> tags
 *  - javascript: URI schemes
 *  - Inline event handler attributes (onerror, onload, on* family)
 *
 * Requirements: 20.3
 */
export function sanitizeHtml(dirty: string): string {
  const window = new JSDOM('').window
  const purify = DOMPurify(window as any)

  return purify.sanitize(dirty, {
    FORBID_TAGS: ['script', 'style'],
    FORBID_ATTR: [
      'onerror',
      'onload',
      'onclick',
      'onmouseover',
      'onfocus',
      'onblur',
      'onkeydown',
      'onkeyup',
      'onkeypress',
      'onchange',
      'onsubmit',
    ],
    FORCE_BODY: false,
  })
}