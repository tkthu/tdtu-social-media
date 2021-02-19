// function uploadFile(target) {
//     document.getElementById("file-name").innerHTML = target.files[0].name;
// }

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    if(profile.getEmail().endsWith('@student.tdtu.edu.vn')){// là sinh viên
        //TODO: nếu đăng nhập lần đầu tiên => lưu info vào database        
    }
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }