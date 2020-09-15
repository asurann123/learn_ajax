window.onload = function doAction(){

  var request = createHttpRequest();
  if (request == null) {
    alert("HttpRequestが取得できませんでした。");
    return;
  }

  let result = confirm("更新しますか？");

  if (result) {
    request.open("GET","get_baseball_news.php",true);
  }

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
  var top_imgs = document.getElementById("top_imgs")
  var main_contents = document.querySelector('ul');
  var xml_obj = request.responseXML;
  var loading = document.getElementById("loading");
  let img_links_array = [];

  //ローディング画面を消す
  loading.style.display ="none";

  //甲子園の場合のXML処理
  if (mode == 1) {
    var entry_lenght = xml_obj.getElementsByTagName("item").length;
    var html = '';
    for (var i = 0; i < entry_lenght; i++) {
      var title_ele = xml_obj.getElementsByTagName("item")[i].getElementsByTagName("title").item(0);
      var summary = xml_obj.getElementsByTagName("item")[i].getElementsByTagName("description").item(0);
      var url = xml_obj.getElementsByTagName("item")[i].getElementsByTagName("link").item(0);
      html +='<div class="card"><img class="bd-placeholder-img card-img-top" src="" alt=""><div class="card-body"><h5 class="card-title"><b>' + title_ele.textContent + '</b></h5><p class="card-text">' + summary.textContent + '...</p><a href="' + url.textContent + '" class="btn btn-outline-info" target=”_blank”>詳しく</a></div></div><hr>'
    }
    main_contents.innerHTML = html;

  //普通の画面の場合のXML処理
  }else {
    var entry_lenght = xml_obj.getElementsByTagName("entry").length;
    var html = '';

    for (var i = 0; i < entry_lenght; i++) {

      //取得したXMLの処理
      var pre_main_content_html = '';
      var title_ele = xml_obj.getElementsByTagName("entry")[i].getElementsByTagName("title").item(0);
      var summary = xml_obj.getElementsByTagName("entry")[i].getElementsByTagName("summary").item(0);
      var url = xml_obj.getElementsByTagName("entry")[i].getElementsByTagName("id").item(0);
      var img_link = xml_obj.getElementsByTagName("entry")[i].getElementsByTagName("link").item(1);

      //写真がついている記事は画像を表示できるカードで表示する
      if (img_link !== null) {
        var img_link_dict = {title:title_ele.textContent, imglink:img_link.getAttribute('href'), pagelink:url.textContent, summarycontent:summary.textContent};
        img_links_array.push(img_link_dict);
        img_link = img_link.getAttribute('href');
        pre_main_content_html = '<br><div class="card"><img src="' + img_link + '" class="card-img-top" width="30%" height="30%"><div class="card-body"><h5 class="card-title"><b>' + title_ele.textContent + '</b></h5><p class="card-text">' + summary.textContent + '</p><a href="' + url.textContent + '" class="btn btn-outline-info" target=”_blank">詳しく</a></div></div>';
      }else{
        pre_main_content_html +='<br><div class="card"><img class="bd-placeholder-img card-img-top" src="" alt=""><div class="card-body"><h5 class="card-title"><b>' + title_ele.textContent + '</b></h5><p class="card-text">' + summary.textContent + '</p><a href="' + url.textContent + '" class="btn btn-outline-info" target=”_blank”>詳しく</a></div></div>'
      }
      html += pre_main_content_html
      }

    //トップのカルーセルを生成(3枚以上集まらないと表示しない)
    if (img_links_array.length >= 3) {
      top_imgs_html = '<br><h5>Top</h5><div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel"><ol class="carousel-indicators"><li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li><li data-target="#carouselExampleIndicators" data-slide-to="1"></li><li data-target="#carouselExampleIndicators" data-slide-to="2"></li></ol><div class="carousel-inner"><div class="carousel-item active"><a href="' + img_links_array[0]['pagelink'] +'"><img class="d-block w-100" src="' + img_links_array[0]['imglink'] + '" alt="First slide"></a><div class="carousel-caption"><h5><b>' + img_links_array[0]['title'] + '</b></h5></div></div><div class="carousel-item"><a href="' + img_links_array[1]['pagelink'] +'"><img class="d-block w-100" src="' + img_links_array[1]['imglink'] + '" alt="Second slide"></a><div class="carousel-caption"><h5><b>' + img_links_array[1]['title'] + '</b></h5></div></div><div class="carousel-item"><a href="' + img_links_array[2]['pagelink'] +'"><img class="d-block w-100" src="' + img_links_array[2]['imglink'] + '" alt="Third slide"></a><div class="carousel-caption"><h5><b>' + img_links_array[2]['title'] + '</b></h5></div></div></div><a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">Previous</span></a><a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">Next</span></a></div>';
      top_imgs.innerHTML = top_imgs_html + '<hr size="20" noshade><h5>New Articles</h5>';
    }
    main_contents.innerHTML = html + '<br>';
  }

}

//エラー等の出力
function errorPrint(request){
  var obj = document.getElementById("msg");
  var html = '<div class="spinner-border text-primary" role="status"><span class="sr-only" id="msg">Loading...</span></div>'
  obj.innerHTML = html;
};

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
