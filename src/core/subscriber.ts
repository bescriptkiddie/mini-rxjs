import {PartialObserver} from "./observable"

// 一个订阅者类
export class Subscriber<T> {
  closed: boolean = false
  /** 抛出同步错误的标识 */
  syncErrorThrowable: boolean = true
  private destinationOrNext: Partial<PartialObserver<T>>

  constructor(destinationOrNext: PartialObserver<any> | ((value: T) => void)) {
    // 如果function
    if (typeof destinationOrNext === 'function') {
      this.destinationOrNext = {
        next: destinationOrNext
      }
    }
  }
  next(value: T): void {
    if(this.closed){
      return
    }
    if (this.destinationOrNext.next){
      this.syncErrorThrowable = false
      this.destinationOrNext.next(value)
      this.syncErrorThrowable = true
    }
  }

  error(err: any) {
    if(this.closed){
      return
    }
    this.closed = true
    if (this.destinationOrNext.error){
      this.syncErrorThrowable = false
      this.destinationOrNext.error(err)
      this.syncErrorThrowable = true
      return
    }
  }

  complete() {
    if (this.closed) {
      return
    }
    this.closed = true
    if (this.destinationOrNext.complete) {
      this.syncErrorThrowable = false
      this.destinationOrNext.complete()
      this.syncErrorThrowable = true
    }
  }
}
