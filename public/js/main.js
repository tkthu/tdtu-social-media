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

var upload = new FileUploadWithPreview("myUniqueUploadId", {
  showDeleteButtonOnImages: true,
  text: {
      chooseFile: "chọn file đính kèm",
      browse: "Browse",
      selectedCount: "File đính kèm",
  },
  presetFiles: [
      "./img/no-face.png",
      "https://images.unsplash.com/photo-1557090495-fc9312e77b28?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
  ],
});

var loadingMorePage = false;
if ($('.main').length){// nếu trang có class main
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
if ($('.detail-posted').length){// nếu trang có class main
  loadMoreCmt();
}

/* ------------------- ajax load them post và comment ------------------ */
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
      closeCreatePost();
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
/* End of ------------ ajax load them post và comment --------------------------- */

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

$('#upload-post').submit( (e) => {
  e.preventDefault();

  var formData = new FormData(e.target);
  if (formData.has('chuyenmuc')){
    formData.set('tenchuyenmuc',$(`#${formData.get('chuyenmuc')}`).html());
  }
  
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

$('.comment').submit( e => {
  e.preventDefault(); 

  const postId = $('.detail-posted').attr('id') ;

  var formData = new FormData(e.target);
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

$('.comment-readmore').click(e => {
  e.preventDefault();
  loadMoreCmt(e);
});

// --------- Chỉnh sửa profile ---------
function uploadFileImg(target) {
    document.getElementById("file-img").innerHTML = target.files[0].name;
}

function uploadFileImgBackground(target) {
    document.querySelector(".edit-profile__body--edit-imgBackground-input").innerHTML = target.files[0].name;
}

// ---------------- Chỉnh sửa nội dung post ------------------
function uploadPostImg(target) {
    document.querySelector(".edit-content__body--edit-imgBackground-input").innerHTML = target.files[0].name;
}

function uploadPostFile(target) {
    document.querySelector(".edit-content__body--edit-file-input").innerHTML = target.files[0].name;
}

// -------------- Tạo bài viết --------------
function uploadNewImage(target) {
    document.querySelector(".upload-post__body--create-imgBackground-input").innerHTML = target.files[0].name;
}

function uploadNewFile(target) {
    document.querySelector(".upload-post__body--create-file-input").innerHTML = target.files[0].name;
}

function uploadVideo(target) {
    document.querySelector(".upload-post__body--create-video-input").innerHTML = target.files[0].name;
}

// -------------- Tạo tài khoản phòng khoa --------------
function uploadAddImg(target) {
  document.querySelector(".add-account__body--add-imgBackground-input").innerHTML = target.files[0].name;
}

// Hiện bảng tạo thêm tài khoản phòng khoa
function addAccountDepartments() {
  var x = document.querySelector("#add-account");
    x.style.display = "block";
}

// Hiện bảng sửa thông tin phòng/khoa
function editInfoPhongKhoa() {
    var x = document.querySelector("#edit-info-phongKhoa");
      x.style.display = "block";

      //TODO: fetch user rồi hiện lên popup

}

// Hiện bảng sửa user profile
function editUserProfile() {
  var form = document.querySelector("#edit-profile");
  form.style.display = "block";

  //TODO: fetch user rồi hiện lên popup
}

//============================ Post =====================================
// Hiện bảng sửa nội dung bài đăng
function editContentPosted(target) {
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
        $('.edit-content__body--edit-content-input').html(post.content);

        //TODO: hiện những cái còn lại
      }
    })
    .catch(e => console.log("error ___ ",e));
}

// Hiện bảng tạo bài viết
function createPost() {
  var form = document.querySelector("#upload-post");
  form.style.display = "block";
  form.reset();
}
//============================ Xóa =====================================
// Hiện popup có chắc muốn xóa
function delConfirm(target) {
  $('#confirm-del').modal('show');
  $('#del-item-name').html($(target).data("item-name"));
  $('.btn-confirm-del').data('item-id', $(target).data("item-id"));
  $('.btn-confirm-del').data('item-type', $(target).data("item-type"));
}

$('.btn-confirm-del').click( e => {
  //TODO: delete item
  $('#confirm-del').modal('hide');

  const itemType = $(e.target).data('item-type');
  const itemId = $(e.target).data('item-id');
  if( itemType == "post" ){//xóa post
    deletePost(itemId);
  }
})

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
//============= Tắt bảng sửa thông tin, bài viết ======================
function closeInfoPhongKhoa() {
  var x = document.querySelector("#edit-info-phongKhoa");
    x.style.display = "none";
}

function closeAddAccount() {
  var x = document.querySelector("#add-account");
    x.style.display = "none";
}

function closeCreatePost() {
  var form = document.querySelector("#upload-post");
  form.style.display = "none";
}

function closeEditContentPosted() {
  var form = document.querySelector("#edit-content");
  form.style.display = "none";
}

function closeEditUserProfile() {
  var form = document.querySelector("#edit-profile");
  form.style.display = "none";
}