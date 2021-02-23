function onSignIn(googleUser) {
    const email = googleUser.getBasicProfile().getEmail();
    const displayName = googleUser.getBasicProfile().getName();
    const imageUrl = googleUser.getBasicProfile().getImageUrl();

    const suffix = '@student.tdtu.edu.vn';  
    if(email.endsWith(suffix)){// là sinh viên
        //TODO: nếu đăng nhập lần đầu tiên => lưu info vào database
        const body = JSON.stringify({
            username: email.split(suffix)[0],
            displayName,
            imageUrl,
        })
        const headers = { 'Content-Type': 'application/json' };

        fetch('/login/GGAuth', { method: 'post', body, headers })
        .then(resp => {            
            if(resp.status < 200 || resp.status >= 300)
                throw new Error(`Request failed with status ${resp.status}`)
            return resp.json()
        })
        .then(json => {
            console.log(json);
            window.location.replace(json.url);
        })
        .catch(err => {
            //TODO: hiện thông báo lổi ở err-msg
            console.log(`error: ${err}`);            
        })
    }else{
        //TODO: hiện thông báo lổi ở err-msg
        console.log(`Tài khoản phải có đuôi "${suffix}"`);
    }  
        
}

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

// Sidebar responsive
// var bars = document.querySelector(".fa-bars");
// var sidebar = document.querySelector(".sidebar");
// var body = document.querySelector(".body");
// bars.addEventListener("click", () => {
//   if(sidebar.style.display === "block") {
//     sidebar.style.display = "none";
//     body.style.marginLeft = "100px";
//   }
//   else {
//     sidebar.style.display = "block";
//     body.style.marginLeft = "0px";
//   }

// });
