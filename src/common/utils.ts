// 对象中去除值为空的键值对
type AnyObject = Record<string, unknown>;

export const removeEmptyValues = <T extends AnyObject>(obj: T): Partial<T> => {
  // 不是对象直接返回
  if (Object.prototype.toString.call(obj)!=='[object Object]') return obj
  return Object.fromEntries(
      // Object.entries(obj).filter(([_, value]) => value !== null && value !== undefined && value !== '')
      // 传空字符串暂不过滤
      Object.entries(obj).filter(([_, value]) => value !== null && value !== undefined)
  ) as Partial<T>
}

// 同步等待
export const wait = async (time: number) => {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(null)
    }, time)
  })
}