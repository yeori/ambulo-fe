const props = 'MODE,BACKEND_HOST,KAKAOMAP_KEY'.split(',')

type EnvProp = {
  MODE?: string
  BACKEND_HOST?: string
  KAKAOMAP_KEY?: string
}
const env: EnvProp = {}

props.forEach((prop) => {
  const key = `VITE_${prop}`
  env[prop] = import.meta.env[key]
})

export class Environment {
  constructor(readonly mode, readonly backendHost, readonly kakaoApiKey) {}
}

export default new Environment(env.MODE, env.BACKEND_HOST, env.KAKAOMAP_KEY)
