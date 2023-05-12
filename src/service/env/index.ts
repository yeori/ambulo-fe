const props = 'MODE,BACKEND_HOST,KEY_KAKAO_MAP,KEY_GOOGLE_MAP'.split(',')

type EnvProp = {
  MODE?: string
  BACKEND_HOST?: string
  KEY_KAKAO_MAP?: string
  KEY_GOOGLE_MAP?: string
}
const env: EnvProp = {}

props.forEach((prop) => {
  const key = `VITE_${prop}`
  env[prop] = import.meta.env[key]
})
console.log('[env]', env)
export class Environment {
  constructor(
    readonly mode,
    readonly backendHost,
    readonly kakaoApiKey,
    readonly gmapApiKey
  ) {}
}

export default new Environment(
  env.MODE,
  env.BACKEND_HOST,
  env.KEY_KAKAO_MAP,
  env.KEY_GOOGLE_MAP
)
