// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const playList = cloud.database().collection('playList');

// 云函数入口函数
exports.main = async (event, context) => {
  const {start, count} = event || {};

  return await playList.skip(start)
  .limit(count)
  .orderBy('createTime', 'desc')
  .get()
  .then(res => {
    return res;
  })
}