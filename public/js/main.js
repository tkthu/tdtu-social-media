function init() {
  gapi.load('auth2', function() {
    gapi.auth2.init(
      {
        client_id: '166513767436-l8pgm3hatt7ev99qvechpj63mgu2cttd.apps.googleusercontent.com'
      }
    )
  });
}

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
              gapi.auth2.getAuthInstance().signOut();
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
  var auth2 = gapi.auth2.getAuthInstance();
  window.location.replace('/logout');
  auth2.signOut().then(function () {
    console.log('User signed out.');     
  });  
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

$('#upload-post').submit(e => {
  e.preventDefault();

  var formData = new FormData($('#upload-post')[0]);
  //TODO: kt userId có empty
  if( formData.get('userId').trim() === "" ){
    return;
  }
  if (formData.has('chuyenmuc')){
    formData.set('tenchuyenmuc',$(`#${formData.get('chuyenmuc')}`).html());
  }  
  for (var pair of formData) {
    console.log(pair[0] +"  : "+ pair[1]);
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
      var markup =  Handlebars.templates['post-fb']({post: json.data})
      
      $('.main').append(markup)
      console.log("post: ", json.data)
    }
  })
  .catch(e => console.log("error ___ ",e))

})


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
  var x = document.querySelector(".add-account");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

// Hiện bảng sửa thông tin sinh viên
function editInfoStudent() {
    var x = document.querySelector(".edit-info");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
}

// Hiện bảng sửa thông tin phòng/khoa
function editInfoPhongKhoa() {
    var x = document.querySelector(".edit-info-phongKhoa");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }

}

// Hiện bảng sửa user profile
function editUserProfile() {
  var form = document.querySelector("#edit-profile");
  form.style.display = "block";
}

function closeEditUserProfile() {
var form = document.querySelector("#edit-profile");
form.style.display = "none";
}

// Hiện bảng sửa nội dung bài đăng
function editContentPosted() {
    var form = document.querySelector("#edit-content");
    form.style.display = "block";
}

function closeEditContentPosted() {
  var form = document.querySelector("#edit-content");
  form.style.display = "none";
}

// Hiện bảng tạo bài viết
function createPost() {
  var form = document.querySelector("#upload-post");
  form.style.display = "block";
}

function closeCreatePost() {
  var form = document.querySelector("#upload-post");
  form.style.display = "none";
}

// Hiện bảng có chắc muốn xóa
function delConfirm() {
  $('#confirm-del').modal('show');
}

//============= Tắt bảng sửa thông tin, bài viết ======================
function closeInfoPhongKhoa() {
  var x = document.querySelector(".edit-info-phongKhoa");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

function closeInfoStudent() {
  var x = document.querySelector(".edit-info");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

function closeAddAccount() {
  var x = document.querySelector(".add-account");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}
