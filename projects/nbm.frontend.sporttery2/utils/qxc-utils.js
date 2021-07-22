import random from 'lodash/random'
import sum from 'lodash/sum'

export const items31 = [
  {
    name: '大',
    value: 100,
  },
  {
    name: '小',
    value: -100,
  },
  {
    name: '单',
    value: 1,
  },
  {
    name: '双',
    value: 0,
  },
  {
    name: '大单',
    value: 1001,
  },
  {
    name: '大双',
    value: 1000,
  },
  {
    name: '小单',
    value: -1001,
  },
  {
    name: '小双',
    value: -1000,
  },
]

export const oloeItems = [
  {
    value: 100,
    name: '大'
  },
  {
    value: -100,
    name: '小'
  },
  {
    value: 0,
    name: '双'
  },
  {
    value: 1,
    name: '单'
  },
]

export const typeColumnMapping = {
  // 32为前2玩法
  32: [0, 1],
  // 33前三玩法
  33: [0, 1, 2],
  // 34为后2玩法
  34: [2, 3],
  // 35为后3玩法
  35: [1, 2, 3],
  // 36为千位大小单双
  36: [0],
  // 37为百位大小单双
  37: [1],
  // 38为十位大小单双
  38: [2],
  // 39为个位大小单双
  39: [3],
}

const creators = {
  1: type => {
    const lt = type % 10
    const item = [null, null, null, null]
    const indexies = [0, 1, 2, 3]
    for (let i = 0; i < lt; i++) {
      const index = indexies.splice(random(0, indexies.length - 1), 1)
      item[index] = random(0, 9)
    }

    return item
  },
  2: type => {
    const lt = type % 20
    const item = []
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

    for (let i = 0; i <= lt; i++) {
      item.push(numbers.splice(random(0, numbers.length - 1), 1))
    }

    return item
  },
  3: type => {
    const item = [null, null, null, null]
    typeColumnMapping[type].forEach(index => {
      item[index] = oloeItems[random(0, oloeItems.length - 1)].value
    })
    return item
  },
  31: () => {
    return [items31[random(0, items31.length - 1)].value]
  }
}

export const randomItem = type => {
  const fn = (
    type === 31
    ? creators[31]
    : creators[parseInt(type/10)]
  )
  return fn(type)
}

export const getName = (value, type) => {
  if (value === null) {
    return '-'
  }

  if (type < 30) {
    return value
  }

  if (type === 31) {
    return items31.find(
      item => value === item.value
    ).name
  }

  return oloeItems.find(
    item => value === item.value
  ).name
}

const pac2 = (list1, list2, fn) => {
  const items = []
  list1.forEach(v1 =>
    list2.forEach(v2 =>
      items.push([v1, v2])
    )
  )
  return items
}

const pac3 = (list1, list2, list3, fn) => {
  const items = []
  list1.forEach(v1 => 
    list2.forEach(v2 => 
      list3.forEach(v3 => 
        items.push([v1, v2, v3])
      )
    )
  )
  return items
}

const typeSplit = {
  /** 一定 */
  11: options => {
    const items = []
    options.forEach((numbers, i) => {
      if (!numbers || !numbers.length) {
        return
      }

      numbers.forEach(num => {
        const item = [null, null, null, null]
        item[i] = num
        items.push(item)
      })
    })
    return items
  },
  /** 二定 */
  12: options => {
    if (
      sum(
        options.map(nums => nums.length ? 1 : 0)
      ) < 2
    ) {
      return []
    }

    const items = []

    for (let i = 0; i < options.length - 1; i++) {
      const nums1 = options[i]
      if (!nums1.length) {
        continue;
      }

      for (let j = i + 1; j < options.length; j++) {
        const nums2 = options[j]
        if (!nums2.length) {
          continue;
        }

        nums1.forEach(n1 => {
          nums2.forEach(n2 => {
            const item = [null, null, null, null]
            item[i] = n1
            item[j] = n2
            items.push(item)
          })
        })
      }
    }

    return items
  },
  /** 三定 */
  13: options => {
    if (
      sum(
        options.map(nums => nums.length ? 1 : 0)
      ) < 3
    ) {
      return []
    }

    const items = []

    const idxies13 = [
      [0, 1, 2],
      [0, 1, 3],
      [0, 2, 3],
      [1, 2, 3],
    ]
    idxies13.forEach(idxies => {
      if (
        sum(
          idxies.map(index => options[index].length ? 1 : 0)
        ) < 3
      ) {
        return
      }

      for (let i = 0; i < options[idxies[0]].length; i++) {
        for (let j = 0; j < options[idxies[1]].length; j++) {
          for (let k = 0; k < options[idxies[2]].length; k++) {
            const item = [null, null, null, null]
            item[idxies[0]] = options[idxies[0]][i]
            item[idxies[1]] = options[idxies[1]][j]
            item[idxies[2]] = options[idxies[2]][k]
            items.push(item)
          }
        }
      }
    })

    return items
  },
  /** 四定 */
  14: options => {
    if (
      sum(
        options.map(nums => nums.length ? 1 : 0)
      ) < 4
    ) {
      return []
    }
    const items = []

    for (let i = 0; i < options[0].length; i++) {
      for (let j = 0; j < options[1].length; j++) {
        for (let k = 0; k < options[2].length; k++) {
          for (let l = 0; l < options[3].length; l++) {
            items.push([
              options[0][i],
              options[1][j],
              options[2][k],
              options[3][l]
            ])
          }
        }
      }
    }

    return items
  },
  /** 二字现 */
  21: options => {
    if (options.length < 2) {
      return []
    }
    const items = []
    for (let i = 0; i < options.length - 1; i++) {
      for (let j = i+1; j < options.length; j++) {
        items.push([options[i], options[j]])
      }
    }
    return items
  },
  /** 三字现 */
  22: options => {
    if (options.length < 3) {
      return []
    }
    const items = []

    for (let i = 0; i < options.length - 2; i++) {
      for (let j = i + 1; j < options.length - 1; j++) {
        for (let k = j + 1; k < options.length; k++) {
          items.push([options[i], options[j], options[k]])
        }
      }
    }

    return items
  },
  /** 总和 */
  31: options => options.map(opt => ([opt])),
  /** 前二 */
  32: options => {
    if (!options[0].length || !options[1].length) {
      return []
    }
    return pac2(options[0], options[1])
  },
  /** 前三 */
  33: options => {
    if (
      !options[0].length
      ||
      !options[1].length
      ||
      !options[2].length
    ) {
      return []
    }
    return pac3(
      options[0],
      options[1],
      options[2]
    )
  },
  /** 后二 */
  34: options => {
    if (!options[2].length || !options[3].length) {
      return []
    }
    return pac2(options[2], options[3])
  },
  /** 后三 */
  35: options => {
    if (
      !options[1].length
      ||
      !options[2].length
      ||
      !options[3].length
    ) {
      return []
    }
    return pac3(
      options[1],
      options[2],
      options[3]
    )
  },
  // 千位
  36: options => options[0].map(opt => ([opt])),
  // 百位
  37: options => options[1].map(opt => ([opt])),
  // 十位
  38: options => options[2].map(opt => ([opt])),
  // 个位
  39: options => options[3].map(opt => ([opt]))
}

export const multiSplit = (options, type) => {
  const fn = typeSplit[type]
  if (fn) {
    const items = fn(options)
    console.log(items)
    return items
  }
  return []
}