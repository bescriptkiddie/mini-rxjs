// 最初始的 Subscription 类
export class Subscription {
  private subs: Subscription[] = [] //一个订阅者集合
  private isStopped: boolean = false

  constructor(private unSubscribeCallback?: () => void) {
  }

  // 集合肯定需要一个添加的方法
  add(subscription: Subscription) {
    if (this.isStopped) {
      return
    }
    this.subs.push(subscription)
  }

  // 有添加,肯定有取消监听
  unsubscribe() {
    this.isStopped = true
    if (this.unSubscribeCallback) {
      this.unSubscribeCallback()
    }
    this.subs.forEach(i => i.unsubscribe())
  }
}


