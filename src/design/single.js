// 单例思想 => 无论我们创建了多少次,他都只给你返回第一次所创建的唯一的一个实例
// Vuex 的 Store

class Single {
  show() {
    console.log('单例对象')
  }
}

const s1 = new Single()
const s2 = new Single()

// s1 === s1  // false

// 有两种办法实现单例
class SingleStore {
  show() {
    console.log('单例对象')
  }

  // 1.利用静态方法
  static getInstance() {
    if (!SingleStore.instance) {
      SingleStore.instance = new SingleStore()
    }
    return SingleStore.instance
  }
}

const s1 = new SingleStore.getInstance()
const s2 = new SingleStore.getInstance()

// s1 === s2  //true

// 2.利用闭包
SingleStore.getInstance = (function() {
  let instance = null
  return function() {
    if (!instance) {
      instance = new SingleStore()
    }
    return instance
  }
})()


// 利用单例去调整

class Storage{
  static getInstance() {
    if(!Storage.instance) {
      Storage.instance = new Storage()
    }
    return Storage.instance
  }

  get(key){
    return localStorage.getItem(key)
  }

  set(key, value){
    return localStorage.setItem(key, value)
  }
}
