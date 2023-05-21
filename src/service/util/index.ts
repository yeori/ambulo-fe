const rand = {
  pick: (arr: any[]): any => {
    let idx = Math.floor(Math.random() * arr.length)
    return arr[idx]
  },
  nextInt: (limit: number): number => {
    return Math.floor(Math.random() * limit)
  }
}

const PRIMITIVE_TYPE = 'number,string,boolean'
const type = {
  isPrimitive: (val: any) => {
    const type = typeof val
    return PRIMITIVE_TYPE.includes(type)
  }
}
export default {
  rand,
  type
}
