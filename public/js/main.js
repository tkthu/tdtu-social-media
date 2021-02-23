// function uploadFile(target) {
//     document.getElementById("file-name").innerHTML = target.files[0].name;
// }

function onSignIn(googleUser) {
    console.log('in  onSignIn')
    const email = googleUser.getBasicProfile().getEmail();
    const displayName = googleUser.getBasicProfile().getName();
    const imageUrl = googleUser.getBasicProfile().getImageUrl();    
    
    console.log(email)
    console.log(displayName)
    console.log(imageUrl)

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