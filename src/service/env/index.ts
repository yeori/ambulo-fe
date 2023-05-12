const props = 'MODE,BACKEND_HOST,KEY_KAKAO_MAP'.split(',')

type EnvProp = {
  MODE?: string
  BACKEND_HOST?: string
  KEY_KAKAO_MAP?: string
}
const env: EnvProp = {}

props.forEach((prop) => {
  const key = `VITE_${prop}`
  env[prop] = import.meta.env[key]
})

export class Environment {
  constructor(readonly mode, readonly backendHost, readonly kakaoApiKey) {}
}

export default new Environment(env.MODE, env.BACKEND_HOST, env.KEY_KAKAO_MAP)
