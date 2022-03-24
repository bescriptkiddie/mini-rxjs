// Rxjs 核心分解

/**
 * 一个监听者类 observable
 * 1.可以添加订阅
 * 2.可以通过next来传输数据
 * 3.在回调中,处理unsubscribe
 */
class Observable {
  constructor(_subscribe) {
    this._subscribe = _subscribe
  }

  subscribe(observer) {
    const subscriber = new Subscriber(observer)
    subscriber.add(this._subscribe(subscriber))
    return subscriber
  }
}

/**
 * 一个订阅者类 subscription
 */
class Subscription {
  constructor() {
    this._teardowns = []
  }

  add(teardown) {
    if (teardown) {
      this._teardowns.push(teardown)
    }
  }

  unsubscribe() {
    this._teardowns.forEach((teardown) => {
      typeof teardown === 'function' ? teardown() : teardown.unsubscribe()
    })
  }
}

class Subscriber extends Subscription {
  constructor(observer) {
    super()
    this.observer = observer
    this.isStopped = false
  }

  next(value) {
    if (this.observer.next && !this.isStopped) {
      this.observer.next(value)
    }
  }

  error(value) {
    this.isStopped = true
    if (this.observer.error) {
      this.observer.error(value)
    }
  }

  complete() {
    this.isStopped = true
    if (this.observer.complete) {
      this.observer.complete()
    }
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }
}

const source = new Observable(observer => {
  let i = 0
  const timer = setInterval(() => {
    observer.next(++i)
  }, 1000)
  return function unsubscribe() {
    clearInterval(timer)
  }
})

const subscription = source.subscribe({
  next: (v) => console.log(v),
  error: (e) => console.error(e),
  complete: () => console.log('complete'),
})

setTimeout(() => {
  subscription.unsubscribe()
}, 4500)
