import { marked } from 'marked'

// Markdown -> HTML. Under an "FAQ" / "Frequently Asked Questions" H2, each H3/H4 becomes a
// native <details> accordion (question = summary, following content = answer).
export function renderMd(md = '') {
  return marked.parse(md).split(/(?=<h2)/).map((chunk) => {
    const h = chunk.match(/^<h2[^>]*>([\s\S]*?)<\/h2>/)
    if (!h || !/faq|frequently asked/i.test(h[1])) return chunk
    const [pre, ...rest] = chunk.slice(h[0].length).split(/<h([34])[^>]*>([\s\S]*?)<\/h\1>/)
    let out = h[0] + pre
    for (let i = 0; i < rest.length; i += 3)
      out += `<details class="faq"><summary>${rest[i + 1]}</summary><div>${rest[i + 2]}</div></details>`
    return out
  }).join('')
}
