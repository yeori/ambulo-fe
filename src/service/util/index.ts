const rand = {
  pick: (arr: any[]): any => {
    let idx = Math.floor(Math.random() * arr.length)
    return arr[idx]
  }
}

export default {
  rand
}
