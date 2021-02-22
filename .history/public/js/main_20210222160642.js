function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    if(profile.getEmail().endsWith('@student.tdtu.edu.vn')){// là sinh viên
        //TODO: nếu đăng nhập lần đầu tiên => lưu info vào database        
    }
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
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

// Hiện bảng tạo bài viết
function createPost() {
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

// closeCreatePost.addEventListener("click", () => {
//   if (uploadPost.style.display === "block") {
//     uploadPost.style.display = "none";
//   }
//   else {
//     uploadPost.style.display = "block";
//   }
// });

function closeCreatePost() {
  var x = document.querySelector(".upload-post");
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
