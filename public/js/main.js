//=================================== realtime  ==============================================================
const socket = io();
socket.on('post-alert', data => {
  // hiện post
  const postContainerElement = $('.main');
  setupHelperHbs();
  const template = Handlebars.compile($('#post-fb_template').html());
  const context = {
    post : data.post,
    user : data.user,
  };
  const html = template(context);
  postContainerElement.prepend(html);
  postContainerElement.data(
    'offset',
    postContainerElement.data('offset') + 1
  );

  // hiện alert
  if(data.broadcast){
    const template = Handlebars.compile($('#instant-notifi').html());
    const context = {
      post : data.post,
    }
    const html = template(context);
    $('#alert-section').prepend(html);
  }
})

socket.on('comment', data => {
  // hiện comment
  const postElement = $('.detail-posted');
  if(postElement.attr('id') == data.comment.postId){
    setupHelperHbs();
    const template = Handlebars.compile($('#comment_template').html());      
    const context = {
      comment : data.comment,
      user : data.user
    };
    const html = template(context);
    postElement.find('.other-comment-section').prepend(html);
    postElement.data(
      'offset',
      postElement.data('offset') + 1
    );
  }
})

socket.on('deleted-post', data => {
  if($(`.detail-posted`).length){// đang ở trang chi tiết thông báo
    alert('post này đã bị xóa');
    window.location.replace("/");
  }else if ($(`.main`).length){// đang ở trang nhà hoặc chủ
    $(`#${data.postId}`).remove();
    //update offset
    const postContainerElement = $('.main');
    postContainerElement.data(
    'offset',
    postContainerElement.data('offset') - 1
    );
  }
})

socket.on('edit-post', data => {
  console.log("edddddddddddddddddddddddddd")
  console.log("data.post ", data.post)
  
  var postElement = $(`#${data.post._id}`);

  // hiện post
  setupHelperHbs();
  const template = Handlebars.compile($('#post-fb_template').html());
  const context = {
    post : data.post,
    user : data.user,
  };
  const html = template(context);
  postElement.replaceWith(html);
})


//=============== ajax load thêm post và comment  ============================================================
var loadingMorePage = false;
if ($('.main').length){
  // nếu trang có class main
  loadMorePost();
  window.onscroll = function() {
    const reachBottom = () => window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
    if(!loadingMorePage){
      if(reachBottom()){
        loadingMorePage = true;
        loadMorePost();
      }
    }
    if(!reachBottom()){
      loadingMorePage = false;
    }
  }
}
if ($('.detail-posted').length){
  // nếu trang có class detail-posted
  loadMoreCmt();
}
$('.comment-readmore').click(e => {
  e.preventDefault();
  loadMoreCmt(e);
});

async function loadMorePost() {
  const postContainerElement = $('.main');

  const curPostPage = postContainerElement.data('current-page');
  const offset = postContainerElement.data('offset');
  const pageOwner = window.location.pathname.split('/').pop();

  console.log("current post page", postContainerElement.data('current-page'));

  return await fetch(`/api/posts?page=${curPostPage}&user=${pageOwner}&offset=${offset}`,{
    method : 'GET'
  })
  .then(resp => {            
    if(resp.status < 200 || resp.status >= 300)
      throw new Error(`Request failed with status ${resp.status}`)
    return resp.json();
  })
  .then(json => {
    
    if (json.code === 0){// lấy n post thành công
      setupHelperHbs();
      var template = Handlebars.compile($('#post-fb_template').html());
      json.data.posts.forEach(post => {
        var context = {
          post ,
          user : json.data.user,
        }        
        var html = template(context);
        postContainerElement.append(html);
        console.log("load thêm post ", post);     
      });
      postContainerElement.data('current-page', curPostPage + 1);
    }
    else if(json.code === 1){// hết post
      console.log("hết post");
    }
  })
  .catch(e => console.log("error ___ ",e));
  
}

async function loadMoreCmt(){
  const postElement = $('.detail-posted');  
  const postId = postElement.attr('id') ;
  const curCmtPage = postElement.data('current-page') ;
  const offset = postElement.data('offset') ;

  await fetch(`/api/post/${postId}/comments?page=${curCmtPage}&offset=${offset}`,{
    method : 'GET'
  })
  .then(resp => {            
    if(resp.status < 200 || resp.status >= 300)
      throw new Error(`Request failed with status ${resp.status}`)
    return resp.json();
  })
  .then(json => {
    if (json.code === 0){// lấy 10 comment thành công      
      setupHelperHbs();      
      var template = Handlebars.compile($('#comment_template').html());
      
      json.data.comments.forEach(cmt => {
        var context = {
          comment: cmt ,          
          user : json.data.user,
        }        
        var html = template(context);
        postElement.find('.other-comment-section').append(html);

      });
      postElement.data('current-page', curCmtPage + 1);
      
    }else if (json.code === 1){
      console.log("hết comment");
      postElement.find('.comment-readmore').hide();
    }
  })
  .catch(e => console.log("error ___ ",e))
}


//====================== Login, logout, register ===============================================================
function onSignIn(googleUser) {
    const email = googleUser.getBasicProfile().getEmail();
    const displayName = googleUser.getBasicProfile().getName();
    const imageUrl = googleUser.getBasicProfile().getImageUrl();
    

    const suffix = '@student.tdtu.edu.vn';  
    const username = email.split(suffix)[0];
    if(email.endsWith(suffix)){// là sinh viên
        const body = JSON.stringify({
            username
        })
        const headers = { 'Content-Type': 'application/json' };

        fetch('/login/GGAuth', { method: 'post', body, headers })
        .then(resp => {            
            if(resp.status < 200 || resp.status >= 300)
                throw new Error(`Request failed with status ${resp.status}`)
            return resp.json()
        })
        .then(json => {
            if(json.code === 1){// đăng nhập email lần đầu
              signOut();
              firstTimeLogin(username,displayName,imageUrl);    
            }else if (json.code === 0){// đăng nhập thành công
              window.location.replace('/');
            }        
        })
        .catch(err => {
            console.log(`error: ${err}`);            
        })
    }else{
        console.log(`Tài khoản phải có đuôi "${suffix}"`);
    }        
}

function signOut() {
  gapi.load('auth2', function() {
    gapi.auth2.init(
      {
        client_id: '166513767436-l8pgm3hatt7ev99qvechpj63mgu2cttd.apps.googleusercontent.com'
      }
    ).then( () => {
      var auth2 = gapi.auth2.getAuthInstance();  
      if(auth2.isSignedIn.get()){
        auth2.signOut().then(function () {
          console.log('User signed out.');
          window.location.replace('/logout');   
        });
      }else{
        window.location.replace('/logout');
      }
    })
  })
}

function firstTimeLogin(username,displayName,imageUrl) {
  $('#set-pass-modal').modal('show');
  $('#confirm-set-pass').attr('data-username',username);
  $('#confirm-set-pass').attr('data-display-name',displayName);
  $('#confirm-set-pass').attr('data-image-url',imageUrl);  
}

$('#confirm-set-pass').click(e => {
  e.preventDefault()

  const password = $('#newPassword').val();
  const confirmPassword = $('#confirmPassword').val();

  if( password.length < 6){
    return $('#set-pass-err-msg').html("mật khẩu phải có ít nhất 6 kí tự");
  }if( password !== confirmPassword){
    return $('#set-pass-err-msg').html("mật khẩu xác nhận không khớp");
  }

  const username = $(e.target).data('username');
  const displayName = $(e.target).data('display-name');
  const imageUrl = $(e.target).data('image-url');
  const userType = 'student'

  const data= {
    username, displayName, imageUrl, password, userType
  }

  fetch("/register",{
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)     
  })
  .then(resp => {            
      if(resp.status < 200 || resp.status >= 300)
          throw new Error(`Request failed with status ${resp.status}`)
      return resp.json()
  })
  .then(json => {
    if (json.code === 0){// đăng kí thành công
      window.location.replace('/');
    }
    else{
      //1: user đã có tài khoản
      console.log(`error: ${json.msg}`);   
    }  
  })
  .catch(e => console.log(e))
})
//================================= POST ========================================================================
//---------------- utils -----------------------------
function addFileInputTag(target){
  var form = $(target).parents('form');
  var container = form.find('.popup-attachment-section');
  if (container.children().length == 0 || container.find(".input-file input").last().get(0).files.length != 0){
    addAttachmentInputTag(container);
  }
}
function addAttachmentInputTag (container){
  container.append(`
    <div class="input-file">
      <input type="file" name="attachmentFile" style="color:white" />
      <span class="pointer" onclick="removeParent(this)" style="color:white" >&times;</span>
    </div>
  `)
}
$('.input-clip-url').on('keypress',function(e) {
  if(e.which == 13) {
    e.preventDefault()
    var link = $(e.target).val();
    var videoId;
    var newval = '';

    if (newval = link.match(/(\?|&)v=([^&#]+)/)) {
      videoId = newval.pop();
    } else if (newval = link.match(/(\.be\/)+([^\/]+)/)) {
      videoId = newval.pop();
    } else if (newval = link.match(/(\embed\/)+([^\/]+)/)) {
      videoId = newval.pop().replace('?rel=0','');
    }
    // https://www.youtube.com/watch?v=YSuo0j2xsj8
    // http://youtu.be/YSuo0j2xsj8
    // www.youtube.com/embed/YSuo0j2xsj8

    var form = $(e.target).parents('form')
    var container = form.find('.popup-youtube-section');
    addEmbedVideoInputTag(container, videoId);
    $(e.target).val("")
  }
});

function addEmbedVideoInputTag (container, videoId){
  container.append(`
    <div class="input-video-embed">
        <iframe src="https://www.youtube.com/embed/${videoId}"></iframe>
        <input type="hidden" name="videoId" value="${videoId}">
        <span onclick="removeParent(this)" style="color:white; vertical-align: top;" class="pointer" >&times;</span>
    </div>
    `)
}

function addOldAttachmentTag (container, fileLink){
  const fileName = fileLink.split('\\').pop().split('/').pop();
  container.append(`    
    <p style="color:white" class="input-video-field" > 
      <input type="hidden" name="attachmentFileOld" value="${fileLink}"/>
      ${fileName}
      <span onclick="removeParent(this)"  class="pointer" >&times;</span>
    </p>   
  `)
}

function removeParent(target){
  target.parentNode.remove()
}

function deletePost(postId){
  fetch(`/api/post/${postId}`,{
    method : 'DELETE',
  })
  .then(resp => {            
    if(resp.status < 200 || resp.status >= 300)
      throw new Error(`Request failed with status ${resp.status}`)
    return resp.json();
  })
  .then(json => {
    if (json.code === 0){// xóa post thành công
      socket.emit('delete-post-success', json.data);
    }
  })
  .catch(e => console.log("error ___ ",e))
}

function resetPostDetailForm(form){ // Reset trạng thái cúa popup bài viết
  form.trigger("reset");
  form.find('.popup-youtube-section').html('');
  form.find('.popup-attachment-section').html('');
  form.find('.popup-attachment-old-section').html('');
}
//---------------- Đăng ----------------------------------
function createPost() {// Hiện popup tạo bài viết
  var form = $("#upload-post");
  form.css('display','block');
}
$('#upload-post').submit( (e) => { // Submit bài viết
  e.preventDefault();

  //TODO: kiểm tra validate
  var formData = new FormData(e.target);
  if (formData.get('title').trim() == ""){
    alert('post phải có tiêu đề')
    return false;
  }
  if (formData.has('chuyenmuc')){
    formData.set('tenchuyenmuc',$(`#${formData.get('chuyenmuc')}`).html());
  }

  // console.log("formData")
  // for (var pair of formData.entries()) {
  //   console.log(pair[0], ', ' , pair[1]); 
  // }  
  
  fetch("/api/post",{
    method : 'POST',
    body:  formData
  })
  .then(resp => {            
    if(resp.status < 200 || resp.status >= 300)
      throw new Error(`Request failed with status ${resp.status}`)
    return resp.json();
  })
  .then(json => {
    if (json.code === 0){// đăng post thành công
      closeCreatePost();
      socket.emit('post-success', json.data);
    }
  })
  .catch(e => console.log("error ___ ",e))

})
function closeCreatePost() { // Đóng popup tạo bài viết
  var form = $("#upload-post");
  form.css('display','none');
  resetPostDetailForm(form);
}
//----------------- Sửa ----------------------------------
function editContentPosted(target) { // Hiện popup sửa bài viết
  var form = document.querySelector("#edit-content");
  form.style.display = "block";

  const postId = $(target).data('item-id');
  fetch(`/api/post/${postId}`,{
    method : 'GET',
  })
  .then(resp => {            
    if(resp.status < 200 || resp.status >= 300)
      throw new Error(`Request failed with status ${resp.status}`)
    return resp.json();
  })
  .then(json => {
    if (json.code === 0){// lấy 1 post thành công
      const post = json.data.post
      $('#edit-content__body--postId').val(postId);//kèm theo post ID hidden
      console.log("post",post)
      if(post.department){
        $('#edit-content__body--chuyenmuc').val(post.department.id);        
      }      
      $('#edit-content__body--tieude').val(post.name);
      $('#edit-content__body--noidung').html(post.content);

      if(post.videoIdArray){
        var container = $('#edit-content .popup-youtube-section');
        post.videoIdArray.forEach( videoId => {
          addEmbedVideoInputTag(container, videoId);
        });
      }
      //hiện những attachment cũ
      container = $('#edit-content .popup-attachment-old-section');
      if(post.attachmentsArray){
        post.attachmentsArray.forEach( attachment => {
          addOldAttachmentTag(container, attachment);
        });
      }      
      if(post.imagesArray){
        post.imagesArray.forEach( image => {
          addOldAttachmentTag(container, image);
        });
      }
    }

  })
  .catch(e => console.log("error ___ ",e));    
}
$('#edit-content').submit( (e) => { // Lưu bài viết
  e.preventDefault();

  //TODO: kiểm tra validate
  var formData = new FormData(e.target);
  if (formData.get('title').trim() == ""){
    alert('post phải có tiêu đề')
    return false;
  }
  if (formData.has('chuyenmuc')){
    formData.set('tenchuyenmuc',$(`#${formData.get('chuyenmuc')}`).html());
  }
  const postId = formData.get('postId');
  console.log(`/api/post/${postId}`)
  fetch(`/api/post/${postId}`,{
    method : 'POST',
    body:  formData
  })
  .then(resp => {            
    if(resp.status < 200 || resp.status >= 300)
      throw new Error(`Request failed with status ${resp.status}`)
    return resp.json();
  })
  .then(json => {
    if (json.code === 0){// sửa post thành công
      closeEditContentPosted();
      socket.emit('edit-post-success', json.data);
    }
  })
  .catch(e => console.log("error ___ ",e))
})
function closeEditContentPosted() { // Đóng popup sửa bài viết
  var form = $("#edit-content");
  form.css('display','none');
  resetPostDetailForm(form);
}


//================================= COMMENT ===================================================================
//---------------- utils -----------------------------

//---------------- Đăng ----------------------------------
$('.comment').submit( e => {
  e.preventDefault(); 

  const postId = $('.detail-posted').attr('id') ;

  var formData = new FormData(e.target);

  console.log("formData")
  for (var pair of formData.entries()) {
    console.log(pair[0], ', ' , pair[1]); 
  }  
  fetch(`/api/post/${postId}/comment`,{
    method : 'POST',
    body:  formData
  })
  .then(resp => {            
    if(resp.status < 200 || resp.status >= 300)
      throw new Error(`Request failed with status ${resp.status}`)
    return resp.json();
  })
  .then(json => {
    if (json.code === 0){// đăng comment thành công
      $(e.target).children('.comment--write').val('');
      socket.emit('comment-success', json.data);
    }
  })
  .catch(e => console.log("error ___ ",e))
})
//----------------- Sửa ----------------------------------


//================================= PROFILE ====================================================================
// --------------- utils ---------------------------------
function uploadFileImg(target) {
    document.getElementById("file-img").innerHTML = target.files[0].name;
}

function uploadFileImgBackground(target) {
    document.querySelector(".edit-profile__body--edit-imgBackground-input").innerHTML = target.files[0].name;
}
// --------------- sửa ---------------------------------
function editUserProfile() {// Hiện popup sửa user profile
  var form = document.querySelector("#edit-profile");
  form.style.display = "block";
  //TODO: fetch user rồi hiện lên popup  
}

function closeEditUserProfile() {// Đóng popup sửa user profile
  var form = document.querySelector("#edit-profile");
  form.style.display = "none";
}


//================================= Account Phòng khoa ============================================================
// -------------- Tạo  ----------------------------------
function addAccountDepartments() {// Hiện popup tạo thêm tài khoản phòng khoa
  var x = document.querySelector("#add-account");
    x.style.display = "block";
}
function closeAddAccount() {// Đóng popup tạo thêm tài khoản phòng khoa
  var x = document.querySelector("#add-account");
    x.style.display = "none";
}

// -------------- Sửa ------------------------------------
function editInfoPhongKhoa() {// Hiện popup sửa thông tin phòng/khoa
    var x = document.querySelector("#edit-info-phongKhoa");
    x.style.display = "block";
    //TODO: fetch user rồi hiện lên popup
}
function closeInfoPhongKhoa() {// Đóng popup sửa thông tin phòng/khoa
  var x = document.querySelector("#edit-info-phongKhoa");
    x.style.display = "none";
}


//================================ COMMON UTILS ===================================================================
// Hiện popup có chắc muốn xóa ?
function delConfirm(target) {
  $('#confirm-del').modal('show');
  $('#del-item-name').html($(target).data("item-name"));
  $('.btn-confirm-del').data('item-id', $(target).data("item-id"));
  $('.btn-confirm-del').data('item-type', $(target).data("item-type"));
}
// Nút chắc chắn muốn xóa
$('.btn-confirm-del').click( e => {
  $('#confirm-del').modal('hide');
  const itemType = $(e.target).data('item-type');
  const itemId = $(e.target).data('item-id');
  if( itemType == "post" ){//xóa post
    deletePost(itemId);
  }
})

function setupHelperHbs(){
  dayjs.extend(window.dayjs_plugin_relativeTime)
  Handlebars.registerHelper('cutDown', function(post, options) {
    if(post !== undefined && post.content !== undefined){
        var content = post.content;
        const minlen = 200;
        if (content.length > minlen){
            content = content.substring(0,minlen) + `...  <a href="/${post.sender.id}/posts/${post._id}">xem thêm</a>`;
        }
        return content;
    }
    return "";
    
  });
  Handlebars.registerHelper('inc', function(value, options){return parseInt(value) + 1;});
  Handlebars.registerHelper('fromNow', function(value, options) {
    if (dayjs(value).isBefore(dayjs(new Date().toISOString()),"day")){
      return dayjs(value).format('DD/MM/YYYY HH:mm');
    }
    return dayjs(value).fromNow();
  });
  Handlebars.registerHelper('getFileName', function(value, options) {
    return value.split('\\').pop().split('/').pop();
  });
  Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
  });
}