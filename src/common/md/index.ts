import { marked } from 'marked'

marked.use({
  mangle: false
})
const parse = (mdText) => {
  return marked(mdText, { async: false })
}

export default {
  parse
}
