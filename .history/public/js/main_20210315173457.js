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
  auth2.signOut().then(function () {
    console.log('User signed out.');
    window.location.replace('/logout')    
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
  .then(result => result.json())
  .then(json => {
    if(json.code === 1){// user đã có tài khoản
      console.log(`error: ${json.msg}`);     
    }else if (json.code === 0){// đăng kí thành công
      window.location.replace('/');
    }    
  })
  .catch(e => console.log(e))
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

// Hiện bảng sửa thông tin cá nhân
function editInfoUser() {
    var x = document.querySelector(".edit-profile");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
}

// Hiện bảng sửa nội dung bài đăng
function editContentPosted() {
    var x = document.querySelector(".edit-content");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
}

// Hiện bảng tạo bài viết tại trang chủ
function createPost() {
    var x = document.querySelector(".upload-post-home");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
}

// Hiện bảng tạo bài viết tại cá nhân
function createPostAtPersonal() {
  var x = document.querySelector(".upload-post");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

//============= Tắt bảng sửa thông tin, bài viết ======================
var closeEditProfile = document.querySelector(".edit-profile__header--close");
var closeEditContent = document.querySelector(".edit-content__header--close");
var closeCreatePost = document.querySelector(".upload-post__header--close");

var editProfile = document.querySelector(".edit-profile");
var editContent = document.querySelector(".edit-content");
var uploadPost = document.querySelector(".upload-post");

closeEditProfile.addEventListener("click", () => {
  if (editProfile.style.display === "block") {
    editProfile.style.display = "none";
  }
  else {
    editProfile.style.display = "block";
  }
});

closeEditContent.addEventListener("click", () => {
  if (editContent.style.display === "block") {
    editContent.style.display = "none";
  }
  else {
    editContent.style.display = "block";
  }
});

closeCreatePost.addEventListener("click", () => {
  if (uploadPost.style.display === "block") {
    uploadPost.style.display = "none";
  }
  else {
    uploadPost.style.display = "block";
  }
});

function closeCreatePostHome() {
  var x = document.querySelector(".upload-post-home");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

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
  var x = document.querySelector(".edit-info");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}
