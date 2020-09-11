//Httpリクエストｒの作成
function createHttpRequest(){
  var httplist = [
    function(){return new XMLHttpRequest();},
    function(){return new ActiveObject("Msxml2.XMLHTTP");},
    function(){return new ActiveObject("Microsoft.XMLHTTP");}
  ];
  for (var i = 0; i < httplist.length; i++) {
    try {
      var http = httplist[i]();
      if (http != null) {
        return http;
      }
    } catch (e) {

    }
  }
  return null;
}

window.onload = function doAction(){

  var request = createHttpRequest();
  if (request == null) {
    alert("HttpRequestが取得できませんでした。");
    return;
  }
  //alert("非同期通信を開始します");
  request.open("GET","get_baseball_news.php",true);

  //request.setRequestHeader("User-Agent" , "XMLHttpRequest");
  request.onreadystatechange = function(){
    if (request.readyState == 4 && request.status == 200) {
        anime({
            targets: loading,
            opacity: 0,
            easing: 'easeInOutExpo'
          });

      //読み込んでいる風の処理
      setTimeout(function(){
        callback(request,0);
      }, 1000);

    }else{
      //errorPrint(request)
    }

  }
  request.send();
}

function Koshien(){
  var request = createHttpRequest();
  request.open("GET","get_baseball_news.php?mode=1",true);
  request.onreadystatechange = function(){
    if (request.readyState == 4 && request.status == 200) {
      callback(request,1);
    }
  }
  request.send();
}

//コールバック関数
function callback(request,mode){
  var obj = document.querySelector('ul');
  var xml_obj = request.responseXML;
  var loading = document.getElementById("loading");
  loading.style.display ="none";

  if (mode == 1) {
    var entry_lenght = xml_obj.getElementsByTagName("item").length;
    var html = '';
    for (var i = 0; i < entry_lenght; i++) {
      var title_ele = xml_obj.getElementsByTagName("item")[i].getElementsByTagName("title").item(0);
      var summary = xml_obj.getElementsByTagName("item")[i].getElementsByTagName("description").item(0);
      var url = xml_obj.getElementsByTagName("item")[i].getElementsByTagName("link").item(0);
      html +='<div class="card"><img class="bd-placeholder-img card-img-top" src="" alt=""><div class="card-body"><h5 class="card-title"><b>' + title_ele.textContent + '</b></h5><p class="card-text">' + summary.textContent + '...</p><a href="' + url.textContent + '" class="btn btn-outline-info" target=”_blank”>詳しく</a></div></div><hr>'
    }
    obj.innerHTML = html;
  }else {
    var entry_lenght = xml_obj.getElementsByTagName("entry").length;
    var html = '';
    for (var i = 0; i < entry_lenght; i++) {
      var title_ele = xml_obj.getElementsByTagName("entry")[i].getElementsByTagName("title").item(0);
      var summary = xml_obj.getElementsByTagName("entry")[i].getElementsByTagName("summary").item(0);
      var url = xml_obj.getElementsByTagName("entry")[i].getElementsByTagName("id").item(0);
      html +='<div class="card"><img class="bd-placeholder-img card-img-top" src="" alt=""><div class="card-body"><h5 class="card-title"><b>' + title_ele.textContent + '</b></h5><p class="card-text">' + summary.textContent + '</p><a href="' + url.textContent + '" class="btn btn-outline-info" target=”_blank”>詳しく</a></div></div><hr>'
    }
    obj.innerHTML = html;
  }

}

//エラー等の出力
function errorPrint(request){
  var obj = document.getElementById("msg");
  var html = '<div class="spinner-border text-primary" role="status"><span class="sr-only" id="msg">Loading...</span></div>'
  obj.innerHTML = html;
};
