export class Debounce {
  private timer: NodeJS.Timeout | null = null

  constructor(
    readonly elem: HTMLElement,
    readonly eventName: string,
    private callback: (e: Event) => void,
    private delay: number
  ) {
    if (elem) {
      this.attachEvent(elem, eventName)
    }
  }

  public debounce = (event: Event) => {
    clearTimeout(this.timer!)
    this.timer = setTimeout(this.callback, this.delay, event)
  }

  public attachEvent = (elem: HTMLElement, eventName: string) => {
    elem.addEventListener(eventName, this.debounce)
  }

  public detachEvent = (elem: HTMLElement, eventName: string) => {
    elem.removeEventListener(eventName, this.debounce)
    clearTimeout(this.timer!)
  }
}
