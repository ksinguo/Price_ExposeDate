require('dotenv').config();
var express = require('express');
var app = express();
var engine = require('ejs-locals');
var bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors'); // 引入 cors 中間件
//載入firebase
var admin = require("firebase-admin");
//var serviceAccount = require("./test-352ee-firebase-adminsdk-jlepp-ba24cca1c6.json");
//使用環境變數載入firebase相關設定
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://test-352ee-default-rtdb.firebaseio.com"
});


app.engine('ejs',engine);
//app.set('views','./views');
// 設置 CORS 政策
app.use(cors({
  origin: 'https://ub-land-price.vercel.app'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');
//增加靜態檔案的路徑，之後如果要用到public靜態文件，路徑寫法是/js/all.js，如果沒有寫是沒辦法抓到public裡面的檔案
app.use(express.static(path.join(__dirname, 'public')));

// 增加 body 解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
//載入firebase
const fireDate = admin.database();
//
//路由
app.get('/',function(req,res){
  res.render("index.ejs")
})
app.get('/fetchData/:code', (req, res) => {
  const inputCode = req.params.code;
  const dbRef = fireDate.ref(inputCode);

  dbRef.once('value', snapshot => {
    if (snapshot.exists()) {
      const value = snapshot.val();
      res.status(200).json({ value: value });
    } else {
      //res.status(404).send('找不到相應的資料');
      //找不到相應的資料，那我就回傳value=7給使用者判斷
      res.status(200).json({ value: '7' });
    }
  }, error => {
    console.error('Error:', error.code);
    res.status(500).send('資料讀取失敗');
  });
});

// 監聽 port
var port = process.env.PORT || 30000;
app.listen(port,function(){
  console.log(`Server is running on port ${port}`);
});
module.exports = app;