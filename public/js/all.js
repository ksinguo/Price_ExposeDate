// function startSearch(){
//     alert('1234');
// }

function startSearch() {
  var inputCode = document.getElementById('codeInput').value;
  const outputResult = document.getElementById('result');
  let str =''; 
  if(!inputCode){
    alert('請輸入申報書序號');
  }
  else{
    axios.get('http://127.0.0.1:30000/fetchData/' + inputCode)
      .then(function (response) {
        const value = response.data.value;
        if(value == '5' || value == '2'){
          str = '<table><tr><th>申報書序號</th><th>地所揭露狀態</th></tr><tr><td>'+inputCode+'</td><td>交易價格已揭露</td></tr></table>'
          outputResult.innerHTML = str;
        }
        else if(value == '4' || value == '3'){
          str = '<table><tr><th>申報書序號</th><th>地所揭露狀態</th></tr><tr><td>'+inputCode+'</td><td>交易價格不揭露</td></tr></table>'
          outputResult.innerHTML = str;
        }
        else if(value =='1' || value == '6') {
          //alert('資料揭露，備註欄不揭露')
          str = '<table><tr><th>申報書序號</th><th>揭露狀態</th></tr><tr><td>'+inputCode+'</td><td>受理機關作業中</td></tr></table>'
          outputResult.innerHTML = str;
        }
        else{
          alert('輸入的申報書序號找不到資料，請重新輸入');
          outputResult.innerHTML = str;
        }
      })
      .catch(function (error) {
        console.error('Error:', error);
        alert('網路異常，請聯絡花蓮縣鳳林地政事務所');
      });
  }
  
  }


function resetAll(){
  const inputCode = document.getElementById('codeInput');
  const outputResult = document.getElementById('result');
  inputCode.value = '';
  let str = '';
  outputResult.innerHTML = str;
  }
