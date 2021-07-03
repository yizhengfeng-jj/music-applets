// miniprogram/components/playList/index.js

Component({

  /**
   * 页面的初始数据
   */
  data: {
    _count: 0
  },
  properties: {
    picUrl: String,
    count: Number,
    name: String
  },

  observers: {
    count(value) {
      this.setData({
        _count: this._transNumbe(value, 2)
      })
    }
  },
  methods: {
    _transNumbe(number, limit) {
      // 取消小数点
      const stringN = number.toString();
      const calculateNumber = stringN.split('.')[0];
      const {length} = calculateNumber;

      if (length < 6) {
        return number;
      }
      else if (length >= 6 && length <= 8) {
        let realNumber = Number(calculateNumber) / 10000;
        realNumber = realNumber.toFixed(limit);

        return `${realNumber}万`
      }
      else {
        let realNumber = Number(calculateNumber) / 100000000;
        realNumber = realNumber.toFixed(limit);

        return `${realNumber}亿`
      }
    }
  }

})
