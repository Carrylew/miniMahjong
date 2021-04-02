export function calcTing(listWan, listTong, listTiao) {
  //均为空---还没有选择牌型
  if (listWan.length == 0 && listTiao.length == 0 && listTong.length == 0) {
    return []
  }
  //均不为空---未打缺
  if (listWan.length != 0 && listTiao.length != 0 && listTong.length != 0) {
    return []
  }
  //手牌大于13张:牌型是不对的   可胡的牌型必须是对3取余等于1,否则就是相公
  const length = listWan.length + listTiao.length + listTong.length
  if (length % 3 != 1 || length > 13) {
    return []
  }
  let allCard = []
  allCard = allCard.concat(listWan).concat(listTong).concat(listTiao)
  let result = []

  let kehuQiDui = []
  if (allCard.length == 13) { //如果牌型为13张,去尝试七对是否可胡
    kehuQiDui = yichuDuizi([...allCard])
    result = result.concat(kehuQiDui)
  }

  if (listWan.length % 3 == 0) {
    //万字的牌型已经组成了刻字或者顺子,无论怎么样都不能胡万字,以下筒条同理
  } else {
    let kehuWan = isCanhu(allCard, "万", kehuQiDui)
    result = result.concat(kehuWan)
  }

  if (listTiao.length % 3 == 0) {} else {
    let kehuTiao = isCanhu(allCard, "条", kehuQiDui)
    result = result.concat(kehuTiao)
  }

  if (listTong.length % 3 == 0) {} else {
    let kehuTong = isCanhu(allCard, "筒", kehuQiDui)
    result = result.concat(kehuTong)
  }
  result.sort((a, b) => {
    return a.id - b.id
  })
  return result
}

function yichuDuizi(allCard) {
  if (allCard.length == 1) {
    return [getObjById(allCard[0])]
  }
  var filter = allCard.filter(it => {
    return it == allCard[0]
  })
  if (filter.length == 2 || filter.length == 3) { //如果找到了一对牌或者三张,移除两张
    allCard.remove(filter[0])
    allCard.remove(filter[0])
    return yichuDuizi(allCard)
  } else if (filter.length == 4) { //如果找到了两对牌,全部移除
    allCard.remove(filter[0])
    allCard.remove(filter[0])
    allCard.remove(filter[0])
    allCard.remove(filter[0])
    return yichuDuizi(allCard)
  } else { //如果只找到了一张,我们再去尝试找第二张牌
    var filter2 = allCard.filter(it => {
      return it == allCard[1]
    })
    if (filter2.length == 2 || filter2.length == 3) { //如果找到了一对牌或者三张,移除两张
      allCard.remove(filter2[0])
      allCard.remove(filter2[0])
      return yichuDuizi(allCard)
    } else if (filter2.length == 4) { //如果找到了两对牌,全部移除
      allCard.remove(filter2[0])
      allCard.remove(filter2[0])
      allCard.remove(filter2[0])
      allCard.remove(filter2[0])
      return yichuDuizi(allCard)
    } else { //如果第二张牌还是只找到了一张,那就说明不能胡七对了
      return []
    }
  }
}



function isCanhu(allCard, type, kehuQiDui) {
  let canHu = []
  let originCard
  switch (type) {
    case "万":
      originCard = createAllWan()
      break;
    case "筒":
      originCard = createAllTong()
      break;
    default:
      originCard = createAllTiao()
      break;
  }
  //依次对所有牌型进行尝试,是否可以胡牌
  for (let j = 0; j < originCard.length; j++) {
    let x = originCard[j]

    if (kehuQiDui.length == 1 && kehuQiDui[0].id == x.id) {
      continue
    }
    let cards = [...allCard]
    cards.push(x.id) // 将X插入到牌型中,组成3n+2的牌型
    if (cards.length == 2) { //如果是清勾吊的牌型,直接判断两张牌是否相等就可以了
      if (cards[0] == cards[1]) {
        if (canHu.indexOf(x) < 0) {
          canHu.push(x)
        }
      }
    } else {
      //取出一对将牌,从14(11,....)张中取出一对相同的值
      cards.sort()
      for (let i = 0; i < allCard.length; i++) {
        let jiangs = cards.filter(value => {
          return value == cards[i]
        })
        if (jiangs.length > 1) {
          //手牌中card[i]有多个一样的值
          let noJiangCards = [...cards]
          noJiangCards.remove(jiangs[0])
          noJiangCards.remove(jiangs[1])
          let hu = keZiOrShunZi(noJiangCards)
          if (hu) {
            if (canHu.indexOf(x) < 0) {
              canHu.push(x)
            }
            break
          }
        } else {
          //手牌中card[i]没有一样的值,不能为将
        }
      }
    }

  };
  return canHu
}

function keZiOrShunZi(noJiang) {
  if (noJiang.length == 0) {
    return true
  }
  var filter = noJiang.filter(it => {
    return it == noJiang[0]
  })
  //组成了克子,移除三个
  if (filter.length > 2) {
    noJiang.remove(filter[0])
    noJiang.remove(filter[0])
    noJiang.remove(filter[0])
    return keZiOrShunZi(noJiang)
  } else {
    let more1 = noJiang.indexOf(noJiang[0] + 1)
    let more2 = noJiang.indexOf(noJiang[0] + 2)
    if (more1 > -1 && more2 > -1) {
      noJiang.remove(noJiang[0] + 2)
      noJiang.remove(noJiang[0] + 1)
      noJiang.remove(noJiang[0] + 0)
      return keZiOrShunZi(noJiang)
    }
    return false
  }
}

function getObjById(id) {
  switch (id) {
    case 1:
      return {
        id: 1,
          name: '一万',
          img: '../../img/wan1.png',
          select: false
      }
      break
    case 2:
      return {
        id: 2,
          name: '二万',
          img: '../../img/wan3.png',
          select: false
      }
      break
    case 3:
      return {
        id: 3,
          name: '三万',
          img: '../../img/wan3.png',
          select: false
      }
      break
    case 4:
      return {
        id: 4,
          name: '四万',
          img: '../../img/wan4.png',
          select: false
      }
      break
    case 5:
      return {
        id: 5,
          name: '五万',
          img: '../../img/wan5.png',
          select: false
      }
      break
    case 6:
      return {
        id: 6,
          name: '六万',
          img: '../../img/wan6.png',
          select: false
      }
      break
    case 7:
      return {
        id: 7,
          name: '七万',
          img: '../../img/wan7.png',
          select: false
      }
      break
    case 8:
      return {
        id: 8,
          name: '八万',
          img: '../../img/wan8.png',
          select: false
      }
      break
    case 9:
      return {
        id: 9,
          name: '九万',
          img: '../../img/wan9.png',
          select: false
      }
      break


    case 11:
      return {
        id: 11,
          name: '一筒',
          img: '../../img/tong1.png',
          select: false
      }
      break
    case 12:
      return {
        id: 12,
          name: '二筒',
          img: '../../img/tong2.png',
          select: false
      }
      break
    case 13:
      return {
        id: 13,
          name: '三筒',
          img: '../../img/tong3.png',
          select: false
      }
      break
    case 14:
      return {
        id: 14,
          name: '四筒',
          img: '../../img/tong4.png',
          select: false
      }
      break
    case 15:
      return {
        id: 15,
          name: '五筒',
          img: '../../img/tong5.png',
          select: false
      }
      break
    case 16:
      return {
        id: 16,
          name: '六筒',
          img: '../../img/tong6.png',
          select: false
      }
      break
    case 17:
      return {
        id: 17,
          name: '七筒',
          img: '../../img/tong7.png',
          select: false
      }
      break
    case 18:
      return {
        id: 18,
          name: '八筒',
          img: '../../img/tong8.png',
          select: false
      }
      break
    case 19:
      return {
        id: 19,
          name: '九筒',
          img: '../../img/tong9.png',
          select: false
      }
      break


    case 21:
      return {
        id: 21,
          name: '一条',
          img: '../../img/tiao1',
          select: false
      }
      break
    case 22:
      return {
        id: 22,
          name: '二条',
          img: '../../img/tiao2.png',
          select: false
      }
      break
    case 23:
      return {
        id: 23,
          name: '三条',
          img: '../../img/tiao3.png',
          select: false
      }
      break
    case 24:
      return {
        id: 24,
          name: '四条',
          img: '../../img/tiao4.png',
          select: false
      }
      break
    case 25:
      return {
        id: 25,
          name: '五条',
          img: '../../img/tiao5.png',
          select: false
      }
      break
    case 26:
      return {
        id: 26,
          name: '六条',
          img: '../../img/tiao6.png',
          select: false
      }
      break
    case 27:
      return {
        id: 27,
          name: '七条',
          img: '../../img/tiao7.png',
          select: false
      }
      break
    case 28:
      return {
        id: 28,
          name: '八条',
          img: '../../img/tiao8.png',
          select: false
      }
      break
    case 29:
      return {
        id: 29,
          name: '九条',
          img: '../../img/tiao9.png',
          select: false
      }
      break
  }
}
Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

export function createAllWan() {
  return [{
      id: 1,
      name: '一万',
      img: '../../img/wan1.png',
      select: false
    },
    {
      id: 2,
      name: '二万',
      img: '../../img/wan2.png',
      select: false
    },
    {
      id: 3,
      name: '三万',
      img: '../../img/wan3.png',
      select: false
    }, {
      id: 4,
      name: '四万',
      img: '../../img/wan4.png',
      select: false
    }, {
      id: 5,
      name: '五万',
      img: '../../img/wan5.png',
      select: false
    }, {
      id: 6,
      name: '六万',
      img: '../../img/wan6.png',
      select: false
    }, {
      id: 7,
      name: '七万',
      img: '../../img/wan7.png',
      select: false
    }, {
      id: 8,
      name: '八万',
      img: '../../img/wan8.png',
      select: false
    },
    {
      id: 9,
      name: '九万',
      img: '../../img/wan9.png',
      select: false
    },

  ]
}
export function createAllTiao() {
  return [{
      id: 21,
      name: '一条',
      img: '../../img/tiao1.png',
      select: false
    },
    {
      id: 22,
      name: '二条',
      img: '../../img/tiao2.png',
      select: false
    },
    {
      id: 23,
      name: '三条',
      img: '../../img/tiao3.png',
      select: false
    }, {
      id: 24,
      name: '四条',
      img: '../../img/tiao4.png',
      select: false
    }, {
      id: 25,
      name: '五条',
      img: '../../img/tiao5.png',
      select: false
    }, {
      id: 26,
      name: '六条',
      img: '../../img/tiao6.png',
      select: false
    }, {
      id: 27,
      name: '七条',
      img: '../../img/tiao7.png',
      select: false
    }, {
      id: 28,
      name: '八条',
      img: '../../img/tiao8.png',
      select: false
    },
    {
      id: 29,
      name: '九条',
      img: '../../img/tiao9.png',
      select: false
    },

  ]
}
export function createAllTong() {
  return [{
      id: 11,
      name: '一筒',
      img: '../../img/tong1.png',
      select: false
    },
    {
      id: 12,
      name: '二筒',
      img: '../../img/tong2.png',
      select: false
    },
    {
      id: 13,
      name: '三筒',
      img: '../../img/tong3.png',
      select: false
    }, {
      id: 14,
      name: '四筒',
      img: '../../img/tong4.png',
      select: false
    }, {
      id: 15,
      name: '五筒',
      img: '../../img/tong5.png',
      select: false
    }, {
      id: 16,
      name: '六筒',
      img: '../../img/tong6.png',
      select: false
    }, {
      id: 17,
      name: '七筒',
      img: '../../img/tong7.png',
      select: false
    }, {
      id: 18,
      name: '八筒',
      img: '../../img/tong8.png',
      select: false
    },
    {
      id: 19,
      name: '九筒',
      img: '../../img/tong9.png',
      select: false
    },

  ]
}