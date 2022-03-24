import {Subscription} from "./subscription"
import {Subscriber} from "./subscriber"

export interface Operator<T, U> {
  // (scource: Observable<T>): Observable<U>;
}

export interface NextObserver<T> {
  next: (value: T) => void;
  error?: (err: any) => void;
  complete?: () => void;
}

export interface ErrorObserver<T> {
  next?: (value: T) => void;
  error: (err: any) => void;
  complete?: () => void;
}

export interface CompletionObserver<T> {
  next?: (value: T) => void;
  error?: (err: any) => void;
  complete: () => void;
}

// 每个 Observer 都有 next,error,complete方法
export type PartialObserver<T> = NextObserver<T> | ErrorObserver<T> | CompletionObserver<T>;

export class Observable<T> {
  constructor(
      private source: (subscriber: Subscriber<T>) => Subscription
          | (() => void)
          | void = observer => observer.complete()
  ) {
  }

  subscribe(observer?: PartialObserver<T>): Subscription;
  subscribe(observer?: ((value: T) => void)): Subscription;
  subscribe(observer: any = function () {
  }): Subscription {
    const subscriber = this.toSubscriber(observer)
    return this.trySubscribe(observer)
  }

  toPromise(): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.subscribe({
        next(value) {
          resolve(value)
        },
        error(err) {
          reject(err)
        }
      })
    })
  }

  protected toSubscriber(observer: PartialObserver<T> | ((value: T) => void)): Subscriber<T> {
    if (typeof observer === 'function'){
      return new Subscriber<T>({
        next: observer
      })
    }
    return new Subscriber<T>(observer)
  }

  protected trySubscribe(subscriber: Subscriber<T>){
    let sub: Subscription | (()=> void) | void
    try {
      sub = this.source(subscriber)
    }catch (e){
      if(subscriber.syncErrorThrowable){
        subscriber.error(e)
      }else {
        throw e
      }
    }
    // 如果 sub 是一个普通方法
    if (typeof sub === 'function'){
      return new Subscription(function (){
        subscriber.closed = true;
        (sub as ()=> void)()
      })
    }else if (sub instanceof Subscription){
      return new Subscription( function (){
        subscriber.closed = true;
        (sub as Subscription).unsubscribe()
      })
    }
    return new Subscription(function (){
      subscriber.closed  = true
    })
  }
}

