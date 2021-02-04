import {
  createAllWan,
  createAllTong,
  createAllTiao,
  calcTing
} from "../../utils/Suan.js";
Page({
  data: {
    allWan: createAllWan(),
    allTiao: createAllTiao(),
    allTong: createAllTong(),
    shouMa: [],
    huMa: []
  },

  clac(shouMa) {
    let wan = []
    let tong = []
    let tiao = []
    shouMa.forEach(element => {
      if (!element.select) {
        if (element.id > 20) {
          tiao.push(element.id)
        } else if (element.id > 10) {
          tong.push(element.id)
        } else {
          wan.push(element.id)
        }
      }

    });
    let result = calcTing(wan, tong, tiao)
    this.setData({
      huMa: result,
      shouMa: shouMa
    })
  },

  onClearClick: function (event) {
    this.setData({
      shouMa: [],
      huMa: []
    })
  },

  //选择下方牌型后的点击事件
  tapShou: function (event) {
    // let item = event.target.dataset.card
    let index = event.target.dataset.index
    var newShouMa = []
    this.data.shouMa.forEach((ele, i) => {
      var newEle = {
        ...ele,
        select: false
      }
      if (i == index) {
        if (!ele.select) {
          newEle.select = true
          newShouMa.push(newEle)
        }
      } else {
        newShouMa.push(newEle)
      }

    })
    this.clac(newShouMa)
  },
  //双击事件
  onDoubleTap: function (event) {
    let item = event.target.dataset.card
    let newShouMa = []
    let flag = false
    this.data.shouMa.forEach(element => {
      if (element.id != item.id || flag) {
        newShouMa.push(element)
      } else {
        flag = true
      }
    });
    this.clac(newShouMa)
  },
  //选择上方牌型后的点击事件
  tapZhuo: function (event) {
    let item = event.target.dataset.card
    let newShouMa = this.data.shouMa
    if (newShouMa.length > 13) {
      return
    }
    let filter = newShouMa.filter(i => {
      return i.id == item.id
    })
    if (filter.length > 3) {
      return
    }
    newShouMa.push(item)
    newShouMa.sort((a, b) => {
      return a.id - b.id
    })
    this.clac(newShouMa)
  }
})