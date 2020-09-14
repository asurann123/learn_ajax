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
  var top_imgs = document.getElementById("top_imgs")
  var main_contents = document.querySelector('ul');
  var xml_obj = request.responseXML;
  var loading = document.getElementById("loading");
  let img_links_array = [];
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
    main_contents.innerHTML = html;
  }else {
    var entry_lenght = xml_obj.getElementsByTagName("entry").length;
    var html = '';
    for (var i = 0; i < entry_lenght; i++) {
      var title_ele = xml_obj.getElementsByTagName("entry")[i].getElementsByTagName("title").item(0);
      var summary = xml_obj.getElementsByTagName("entry")[i].getElementsByTagName("summary").item(0);
      var url = xml_obj.getElementsByTagName("entry")[i].getElementsByTagName("id").item(0);
      var img_link = xml_obj.getElementsByTagName("entry")[i].getElementsByTagName("link").item(1);
      if (img_link !== null) {
        var img_link_dict = {title:title_ele.textContent, imglink:img_link.getAttribute('href'), pagelink:url.textContent, summarycontent:summary.textContent};
        img_links_array.push(img_link_dict);
        html +='<div class="card"><img class="bd-placeholder-img card-img-top" src="" alt=""><div class="card-body"><h5 class="card-title"><b>' + img_link_dict['title'] + '</b></h5><p class="card-text">' + img_link_dict['summarycontent'] + '</p><a href="' + img_link_dict['pagelink'] + '" class="btn btn-outline-info" target=”_blank”>詳しく</a></div></div><hr>'
      }

    }
    top_imgs_html = '<div id="carouselExampleControls" class="carousel slide" data-ride="carousel"><div class="carousel-inner"><div class="carousel-item active"><a href="' + img_links_array[0]['pagelink'] + '"><img class="d-block w-100" style="height: 15rem;" src="' + img_links_array[0]['imglink'] + '" alt="First slide"></a></div><div class="carousel-item"><a href="' + img_links_array[1]['pagelink'] + '"><img class="d-block w-100" style="height: 15rem;" src="' + img_links_array[1]['imglink'] + '" alt="Second slide"></div><div class="carousel-item"><a href="' + img_links_array[2]['pagelink'] + '"><img class="d-block w-100" style="height: 15rem;" src="' + img_links_array[2]['imglink'] + '" alt="Third slide"></div>  </div><a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">Previous</span></a><a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">Next</span></a></div>';
    top_imgs.innerHTML = top_imgs_html;
    main_contents.innerHTML = html;
  }

}

//エラー等の出力
function errorPrint(request){
  var obj = document.getElementById("msg");
  var html = '<div class="spinner-border text-primary" role="status"><span class="sr-only" id="msg">Loading...</span></div>'
  obj.innerHTML = html;
};
