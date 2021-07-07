// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios');
const NeteaseCloudMusicApi = require('NeteaseCloudMusicApi');

cloud.init()
const db = cloud.database();

// const url = 'https://music.163.com/api/playlist/highquality/tags';

const initPlayList = db.collection('playList');
const {top_playlist, login_cellphone} = NeteaseCloudMusicApi;

const MAX_COUNT = 100;
// 云函数入口函数
exports.main = async (event, context) => {
  const playListCountData = await initPlayList.count();
  const {total = 0} = playListCountData || {};
  const batchTimes = Math.ceil(total / MAX_COUNT);
  const promiseList = [];
  let allInitData = {data: []};

  for (let i = 0; i < batchTimes; i++) {
    const promise = initPlayList.skip(i * MAX_COUNT).limit(MAX_COUNT).get();

    promiseList.push(promise);    
  }

 if (promiseList.length) {
  allInitData = (await Promise.all(promiseList)).reduce((cur, value) => {
    return {
      data: cur.data.concat(value.data)
    }
  });
 }
 

  // 发送请求
  const userInfo = await login_cellphone({
      phone: 18883880426,
      password: '742981515'
    })
  const playList = await top_playlist(
    {
      cookie: userInfo.body.cookie
    }
  );

  const data = playList.body.playlists;
 
  // // 插入数据库
  for(let i = 0; i < data.length; i++) {
    if (allInitData.data.every(info => info.id !== data[i].id)) {
      await db.collection('playList').add({
        data: {
          ...data[i],
          createTime: db.serverDate()
        }
      }).then(() => console.log('插入成功'))
        .catch(() => console.log('插入失败'))
    }
  }
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}