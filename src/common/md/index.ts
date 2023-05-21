import { marked } from 'marked'
const parse = (mdText) => {
  return marked(mdText, { async: false })
}

export default {
  parse
}
