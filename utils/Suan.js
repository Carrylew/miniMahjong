

  export function calcTing(listWan, listTong, listTiao) {
    console.log(listWan)
    console.log(listTong)
    console.log(listTiao)
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
    if (listWan.length % 3 == 0) {
      //万字的牌型已经组成了刻字或者顺子,无论怎么样都不能胡万字,以下筒条同理
    } else {
      let kehuWan = isCanhu(allCard, "万")
      result = result.concat(kehuWan)
    }

    if (listTiao.length % 3 == 0) {} else {
      let kehuTiao = isCanhu(allCard, "条")
      result = result.concat(kehuTiao)
    }

    if (listTong.length % 3 == 0) {} else {
      let kehuTong = isCanhu(allCard, "筒")
      result = result.concat(kehuTong)
    }
    return result
  }

  function isCanhu(allCard, type) {
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

Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

export function createAllWan() {
  return [
    {
      id: 1,
      name: '一万',
      img: '../../img/wan1.png'
    },
    {
      id: 2,
      name: '二万',
      img: '../../img/wan2.png'
    },
    {
      id: 3,
      name: '三万',
      img: '../../img/wan3.png'
    }, {
      id: 4,
      name: '四万',
      img: '../../img/wan4.png'
    }, {
      id: 5,
      name: '五万',
      img: '../../img/wan5.png'
    }, {
      id: 6,
      name: '六万',
      img: '../../img/wan6.png'
    }, {
      id: 7,
      name: '七万',
      img: '../../img/wan7.png'
    }, {
      id: 8,
      name: '八万',
      img: '../../img/wan8.png'
    },
    {
      id: 9,
      name: '九万',
      img: '../../img/wan9.png'
    },

  ]
}
export function createAllTiao() {
  return [
    {
      id: 21,
      name: '一条',
      img: '../../img/tiao1.png'
    },
    {
      id: 22,
      name: '二条',
      img: '../../img/tiao2.png'
    },
    {
      id: 23,
      name: '三条',
      img: '../../img/tiao3.png'
    }, {
      id: 24,
      name: '四条',
      img: '../../img/tiao4.png'
    }, {
      id: 25,
      name: '五条',
      img: '../../img/tiao5.png'
    }, {
      id: 26,
      name: '六条',
      img: '../../img/tiao6.png'
    }, {
      id: 27,
      name: '七条',
      img: '../../img/tiao7.png'
    }, {
      id: 28,
      name: '八条',
      img: '../../img/tiao8.png'
    },
    {
      id: 29,
      name: '九条',
      img: '../../img/tiao9.png'
    },

  ]
}
export function createAllTong() {
  return [
    {
      id: 11,
      name: '一筒',
      img: '../../img/tong1.png'
    },
    {
      id: 12,
      name: '二筒',
      img: '../../img/tong2.png'
    },
    {
      id: 13,
      name: '三筒',
      img: '../../img/tong3.png'
    }, {
      id: 14,
      name: '四筒',
      img: '../../img/tong4.png'
    }, {
      id: 15,
      name: '五筒',
      img: '../../img/tong5.png'
    }, {
      id: 16,
      name: '六筒',
      img: '../../img/tong6.png'
    }, {
      id: 17,
      name: '七筒',
      img: '../../img/tong7.png'
    }, {
      id: 18,
      name: '八筒',
      img: '../../img/tong8.png'
    },
    {
      id: 19,
      name: '九筒',
      img: '../../img/tong9.png'
    },

  ]
}
