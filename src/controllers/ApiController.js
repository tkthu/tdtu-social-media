const postModel = require('../models/post.model');
const commentModel = require('../models/comment.model');

const unreadNotifiModel = require('../models/unreadNotifi.model');
const userModel = require('../models/user.model');

const {unlink}  = require('fs/promises');
const bcrypt = require('bcrypt');

const mogoose = require('mongoose');
const {multipleMongooseToObject, mongooseToObject} = require('../../util/mongoose');

const {fBucket} = require('../../util/config/db/firebaseAdmin');
const { v4: uuid } = require("uuid");
const credentials = require('../../credentials/credentials');

// --------------------- middleware -------------------------
getFirebaseFileUrl = (str) => {
    const localPrefix = "public\\upload\\";
    return str.replace(localPrefix,"").replace(/\\/g, "/");
}

const bucketUrl = `https://firebasestorage.googleapis.com/v0/b/${credentials.firebaseConfig.storageBucket}/o`

//TODO: rename post name thành title
class ApiController{

    /* ========================== POST ================================ */
    // [GET] /posts?page=   &user=    &offset=
    getPosts(req, res){
        // mỗi lần chỉ hiện 10 bài có createdAt mới nhất
        const pageNum = parseInt(req.query.page);
        const offset = parseInt(req.query.offset);
        const postPerPage = 10;

        const senderId = req.query.user !== "" ? req.query.user : {$ne: null}
        postModel.find({"sender.id" :senderId}).sort({createdAt: -1}).skip( offset + (pageNum-1)*postPerPage).limit(postPerPage)
        .then(postsFound => {
            if (postsFound === null){
                throw new Error('not found posts');
            }
            if (postsFound.length === 0 ){
                return res.status(200).json({
                    code:1,
                    msg:'hết post',
                });
            }

            var posts = multipleMongooseToObject(postsFound);

            return res.status(200).json({
                code:0,
                msg:`lấy ${postPerPage} post thành công`,
                data: {
                    posts,
                    user: req.user,       
                }
            });

        })
        .catch(err => {
            return res.status(500).json({
                msg:'lấy 10 post thất bại với lỗi ' + err,
            });
        })
        
    }
    // [GET] /post/:postId
    getOnePost(req, res){
        const {postId} = req.params;

        postModel.findOne({_id: postId})
        .then(postFound => {
            if (postFound === null){
                throw new Error('not found post');
            }
            return res.status(200).json({
                code:0,
                msg:`lấy post thành công`,
                data: {
                    post : mongooseToObject(postFound),
                    user: req.user,
                }
            });

        })
        .catch(err => {
            return res.status(500).json({
                msg:'lấy post thất bại với lỗi ' + err,
            });
        })
        
    }
    // [POST] /post
    async addPost(req, res){
        var imagesArray = [];
        var attachmentsArray = [];        
        if(req.files.attachmentFile !== undefined){
            var promises = []
            imagesArray = req.files.attachmentFile
            .filter(fi => fi.mimetype.startsWith('image/') )
            .map( fi => {
                promises.push(
                    fBucket.upload(fi.path,{
                        destination: getFirebaseFileUrl(fi.path),
                        metadata : {
                            metadata:{
                                firebaseStorageDownloadTokens: uuid(),
                            }, 
                        },
                    })           
                );
                return `${bucketUrl}/${encodeURIComponent(getFirebaseFileUrl(fi.path))}?alt=media`;
            });
            
            attachmentsArray = req.files.attachmentFile
            .filter(fi => !fi.mimetype.startsWith('image/') )
            .map( fi => {
                promises.push(
                    fBucket.upload(fi.path,{
                        destination: getFirebaseFileUrl(fi.path),
                        metadata : {
                            metadata:{
                                firebaseStorageDownloadTokens: uuid(),
                            },
                        },
                    })
                );
                return `data:text/plain;charset=UTF-8,${bucketUrl}/${encodeURIComponent(getFirebaseFileUrl(fi.path))}?alt=media`
            });

            await Promise.all(promises)
            .then( () => {
                console.log('thêm hết file')
                // xóa file tạm
                req.files.attachmentFile.forEach(fi => {
                    unlink(fi.path);
                })
            })
            .catch( (err) => {
                console.log('thêm fiel bị lỗi ',err)
            })
            
        }
        
        var videoIdArray = undefined;
        if (req.body.videoId){
            videoIdArray = Array.isArray(req.body.videoId) ? req.body.videoId : [req.body.videoId]
        }

        const post = {
            _id: mogoose.Types.ObjectId(),
            name: req.body.title,
            createdAt: new Date().toISOString(),
            content: req.body.content,
            department: {
                id: req.body.chuyenmuc,
                name: req.body.tenchuyenmuc,
            },
            sender: {
                id: req.user.username,
                displayName: req.user.displayName,
                avatarUrl: req.user.avatarUrl,
            },
            imagesArray,
            attachmentsArray,
            videoIdArray : videoIdArray
        }        

        new postModel(post).save()
        .then((resultPost) => {
            return res.status(200).json({
                code:0,
                msg:'đăng post thành công',
                data: {
                    post,
                    user: req.user,
                    broadcast: resultPost.department.id ? true: false, // chỉ broadcast khi post thuộc chuyên mục nào đó
                }
            });
        })
        .catch(err => {
            console.log('err ', err)
            return res.status(500).json({
                msg:'đăng post thất bại với lỗi ' + err,
            });
        })
        
    }
    // [POST] /post/:postId
    editPost(req, res){
        const {postId} = req.params;
        const {tenchuyenmuc,chuyenmuc,title,content, videoId} = req.body;
        postModel.findOne({_id: postId})
        .then( postFound => {
            if (postFound === null){
                throw new Error('not found post');
            }

            req.post = mongooseToObject(postFound);
            req.post.name = title;
            req.post.content = content;
            if(req.post.department){
                req.post.department.name = tenchuyenmuc;
                req.post.department.id = chuyenmuc;
            }            
            req.post.lastEdited = new Date().toISOString();

            var videoIdArray = undefined
            if (videoId ){
                videoIdArray = Array.isArray(videoId) ? videoId : [videoId];
                
            }
            req.post.videoIdArray = videoIdArray;
            
            
            // Kiểm tra attachment cũ đã bị xóa chưa
            var promises = [];
            const oldAttachment = req.body.attachmentFileOld !== undefined ? req.body.attachmentFileOld : [];
            req.post.imagesArray = postFound.imagesArray.filter( imgLink => {
                if( ! oldAttachment.includes(imgLink)){// User muốn xóa hình này
                    // promises.push(unlink(`.\\public${imgLink}`));    
                    const filename = decodeURIComponent(imgLink.split('/').pop()).replace('?alt=media','');
                    promises.push(                            
                        fBucket.deleteFiles({
                            prefix: `${filename}`
                        })
                    ) 
                } 
                return oldAttachment.includes(imgLink);// giữa lại hình còn chứa trong oldAttachment                
            })           
            
            req.post.attachmentsArray = postFound.attachmentsArray.filter( fileLink => {
                if( ! oldAttachment.includes(fileLink)){// User muốn xóa file này
                    // promises.push(unlink(`.\\public${fileLink}`));
                    const filename = decodeURIComponent(fileLink.split('/').pop()).replace('?alt=media','');
                    promises.push(                            
                        fBucket.deleteFiles({
                            prefix: `${filename}`
                        })
                    )
                } 
                return oldAttachment.includes(fileLink);// giữa lại file còn chứa trong oldAttachment
            })

            return Promise.all(promises);            
        })
        .then(  async () => {// đã xóa file cũ

            if(req.files.attachmentFile !== undefined){// thêm các file mới
                var newImagesArray = [];
                var newAttachmentsArray = [];      
                if(req.files.attachmentFile !== undefined){
                    var promises = []
                    newImagesArray = req.files.attachmentFile
                    .filter(fi => fi.mimetype.startsWith('image/') )
                    .map( fi => {
                        promises.push(
                            fBucket.upload(fi.path,{
                                destination: getFirebaseFileUrl(fi.path),
                                metadata : {
                                    metadata:{
                                        firebaseStorageDownloadTokens: uuid(),
                                    }, 
                                },
                            })           
                        );
                        return `${bucketUrl}/${encodeURIComponent(getFirebaseFileUrl(fi.path))}?alt=media`;
                    });
                    
                    newAttachmentsArray = req.files.attachmentFile
                    .filter(fi => !fi.mimetype.startsWith('image/') )
                    .map( fi => {
                        promises.push(
                            fBucket.upload(fi.path,{
                                destination: getFirebaseFileUrl(fi.path),
                                metadata : {
                                    metadata:{
                                        firebaseStorageDownloadTokens: uuid(),
                                    },
                                },
                            })
                        );
                        return `data:text/plain;charset=UTF-8,${bucketUrl}/${encodeURIComponent(getFirebaseFileUrl(fi.path))}?alt=media`
                    });

                    await Promise.all(promises)
                    .then( () => {
                        req.post.imagesArray.push(...newImagesArray);                
                        req.post.attachmentsArray.push(...newAttachmentsArray);
                        console.log('edit hết file mới')
                        // xóa file tạm
                        req.files.attachmentFile.forEach(fi => {
                            unlink(fi.path);
                        })
                    })
                    .catch( (err) => {
                        console.log('edit fiel bị lỗi ',err)
                    })
                    
                }
                
            }

            return postModel.updateOne({_id:postId},req.post);
        })
        .then( () => {
            return res.status(200).json({
                code:0,
                msg:'edit post thành công',
                data: {
                    post: req.post,
                    user: req.user
                }
            });
        })
        .catch(err =>{
            console.log("err ", err)
            return res.status(500).json({
                msg:'edit post thất bại với lỗi ' + err,
            });
        })        
    }
    // [DELETE] /post/:postId
    delPost(req, res){
        //TODO: xóa post     
        const {postId} = req.params;
        postModel.findOne({_id: postId})
        .then(postFound => {
            if(postFound == null){
                return res.status(500).json({
                    msg:'không tìm thấy post',
                });
            }
            // kiểm tra user này có quyền xóa post này ko
            if (postFound.sender.id != req.user.username){
                return res.status(403).json({
                    msg:'bạn không có quyền xóa post này',
                });
            }
            
            // xóa hết attachment và hình
            var promises = [];
            postFound.imagesArray.forEach(imageLink => {
                const filename = decodeURIComponent(imageLink.split('/').pop()).replace('?alt=media','');
                promises.push(                            
                    fBucket.deleteFiles({
                        prefix: `${filename}`
                    })
                )
            });
            postFound.attachmentsArray.forEach(fileLink => {
                const filename = decodeURIComponent(fileLink.split('/').pop()).replace('?alt=media','');
                promises.push(                            
                    fBucket.deleteFiles({
                        prefix: `${filename}`
                    })
                )
            });
            return Promise.all(promises);      
        })
        .then(() => {// đã xóa hết attchment
            return postModel.deleteOne({_id: postId});            
        })
        .then(() => {// đã xóa post
            return commentModel.deleteMany({postId})
        })
        .then( () => {// xóa hết unread-notifications
            //TODO: xóa unread-notifications hiện tại. (Không làm trigger được)
            return unreadNotifiModel.deleteMany({postId})// không cần đợi
        })
        .then(() => {// đã xóa hết comment
            return res.status(200).json({
                code:0,
                msg:'xóa post thành công',
                data: {
                    postId,
                }
            });
        })
        .catch(err => {
            return res.status(500).json({
                msg:'xóa post thất bại với lỗi ' + err,
            });
        })
        

    }

    /* ========================== COMMENT ================================ */
    // [GET] /post/:postId/comments?page=    &offset=
    getComments(req, res){
        // mỗi lần chỉ hiện thêm 4 comment có createdAt mới nhất
        const {postId} = req.params;

        const cmtNum = parseInt(req.query.page);
        const offset = parseInt(req.query.offset);
        const cmtPerPost = 4;

        commentModel.find({postId}).sort({createdAt: -1}).skip(offset + (cmtNum-1)*cmtPerPost).limit(cmtPerPost)
        .then((commentArr) => {
            if(commentArr.length === 0){
                return res.status(200).json({
                    code:1,
                    msg:`hết comment`,
                });
            }
            const comments = multipleMongooseToObject(commentArr);

            return res.status(200).json({
                code:0,
                msg:`lấy ${cmtPerPost} comment thành công`,
                data: {
                    comments ,                    
                    user : req.user,                
                }
            });

        })
        .catch(err => {
            return res.status(500).json({
                msg:`lấy ${cmtPerPost} comment thất bại với lỗi: ${err}`,
            });
        })
        
    }
    // [GET] /comment/:commentId
    getOneComment(req, res){
        const {commentId} = req.params;

        commentModel.findOne({_id: commentId})
        .then(cmtFound => {
            if (cmtFound === null){
                throw new Error('not found comment');
            }
            return res.status(200).json({
                code:0,
                msg:`lấy comment thành công`,
                data: {
                    comment : mongooseToObject(cmtFound),
                    user: req.user,
                }
            });

        })
        .catch(err => {
            return res.status(500).json({
                msg:'lấy comment thất bại với lỗi ' + err,
            });
        })
    }
    // [POST] /post/:postId/comment
    addComment(req, res){
        const {postId} = req.params;
        postModel.findById(postId)
        .then((postFound)=>{
            postFound.commentsCount = postFound.commentsCount + 1;
            return postFound.save();
        })
        .then(resultPost => {            
            req.comment = {
                _id: mogoose.Types.ObjectId(),
                content: req.body.cmt,
                createdAt: new Date().toISOString(),
                sender: {
                    id: req.user.username,
                    displayName: req.user.displayName,
                    avatarUrl: req.user.avatarUrl,
                },
                receiverId : resultPost.sender.id,
                postId,
            }
            return new commentModel(req.comment).save();
        })
        .then((re) => {
            return res.status(200).json({
                code:0,
                msg:'đăng comment thành công',
                data: {
                    comment: req.comment,
                    user: req.user,
                }
            });
        })
        .catch(err => {
            return res.status(500).json({
                msg:'đăng comment thất bại với lỗi ' + err,
            });
        })
    }
    // [POST] /comment/:commentId
    editComment(req, res){
        //TODO: kiểm tra user này có quyền sửa comment này ko ( 401 Unauthorized)
        const {commentId} = req.params;
        const {newCmt} = req.body;
        commentModel.findOne({_id: commentId})
        .then( cmtFound => {
            if(cmtFound == null){
                return res.status(500).json({
                    msg:'không tìm thấy comment',
                });
            }
             // kiểm tra user này có quyền sửa comment này ko
            if (cmtFound.sender.id != req.user.username){
                return res.status(403).json({
                    msg:'bạn không có quyền sửa comment này',
                });
            }
            
            req.comment = cmtFound;
            req.comment.content = newCmt;
            req.comment.lastEdited = new Date().toISOString();
            console.log('req.comment ',req.comment)
            return commentModel.updateOne({_id:commentId},req.comment);            
        })
        .then(() => {// đã sửa comment
            
            return res.status(200).json({
                code:0,
                msg:'sửa comment thành công',
                data: {
                    comment: req.comment,
                }
            });
        })
        .catch(err => {
            return res.status(500).json({
                msg:'sửa comment thất bại với lỗi ' + err,
            });
        })       

    }
    // [DELETE] /comment/:commentId
    delComment(req, res){
        //TODO: kiểm tra user này có quyền xóa comment này ko ( 401 Unauthorized)
        const {commentId} = req.params;
        commentModel.findOne({_id: commentId})
        .then( cmtFound => {
            if(cmtFound == null){
                return res.status(500).json({
                    msg:'không tìm thấy comment',
                });
            }
             // kiểm tra user này có quyền xóa comment này ko
            if (cmtFound.sender.id != req.user.username){
                return res.status(403).json({
                    msg:'bạn không có quyền xóa comment này',
                });
            }
            return postModel.updateOne({_id:cmtFound.postId},{
                $inc: { commentsCount: -1} 
            });            
        })
        .then(() => { // đã update số lượng comment của post
            return commentModel.deleteOne({_id: commentId});
        })
        .then(() => {// đã xóa comment
            return res.status(200).json({
                code:0,
                msg:'xóa comment thành công',
                data: {
                    commentId
                }
            });
        })
        .catch(err => {
            return res.status(500).json({
                msg:'xoa1 comment thất bại với lỗi ' + err,
            });
        })       

    }

    /* ========================== USER ================================ */
    // [GET] /user/:userId
    getOneUser(req,res){
        const {userId} = req.params;

        userModel.findOne({_id: userId})
        .then(userFound => {
            if (userFound === null){
                throw new Error('not found user');
            }
            return res.status(200).json({
                code:0,
                msg:`lấy user thành công`,
                data: {
                    userInfo: mongooseToObject(userFound),
                    user: req.user,
                }
            });

        })
        .catch(err => {
            return res.status(500).json({
                msg:'lấy user thất bại với lỗi ' + err,
            });
        })
    }
    // [POST] /user/:userId
    editUser(req,res){
        const {userId} = req.params;
        const {displayName,userType,oldpass,newpass} = req.body;        

        var newUserInfo = {
            displayName,
            lastEdited: new Date().toISOString(),
        }

        if(userType == 'student'){
            const {userClass,faculty,speciality} = req.body;
            newUserInfo.studentInfo = {
                class: userClass,
                faculty: faculty,
                speciality: speciality,
            }
        }

        userModel.findOne({_id:userId})
        .then( async userFound => {
            if(req.file){// thêm file avatar mới
                if (userFound.avatarUrl.startsWith(bucketUrl)){
                    // chỉ xóa hình của user. ( ko xóa no-face)
                    const filename = decodeURIComponent(userFound.avatarUrl.split('/').pop()).replace('?alt=media','');
                    fBucket.deleteFiles({
                        prefix: `${filename}`
                    })
                }
                fBucket.upload(req.file.path,{
                    destination: getFirebaseFileUrl(req.file.path),
                    metadata : {
                        metadata:{
                            firebaseStorageDownloadTokens: uuid(),
                        }, 
                    },
                })
                .then( () => {
                    unlink(req.file.path)
                })
                newUserInfo.avatarUrl = `${bucketUrl}/${encodeURIComponent(getFirebaseFileUrl(req.file.path))}?alt=media`;
            }
            if (oldpass){
                await bcrypt.compare(oldpass, userFound.password)
                .then(passwordMatch => {
                    if (!passwordMatch) {
                        throw new Error('password not match');
                    }else{
                        newUserInfo.password = bcrypt.hashSync(newpass,10);
                    }                    
                })          
            }
            return userModel.updateOne({_id:userId},newUserInfo);            
        })        
        .then( () => {
            return res.status(200).json({
                code:0,
                msg:`update user thành công`,
                data: {
                    newUserInfo: newUserInfo,
                    user: req.user,
                }
            });
        })
        .catch(err => {
            console.log("err ", err.message)
            if(err.message == 'password not match' ){
                return res.status(200).json({
                    code:1,
                    msg:`mật khẩu cũ không khớp`
                });
            }
            return res.status(500).json({
                msg:'update user thất bại với lỗi ' + err,
            });
        })

    }
    // [POST] /userstaff/:userId
    async editUserStaff(req,res){
        const {userId} = req.params;
        const {chuyenmuc,matkhau} = req.body;

        var authorized = [];
        if(Array.isArray(chuyenmuc)) {
            for (let cm in chuyenmuc) {
                const temp = chuyenmuc[cm].split('_');
                authorized.push({
                    id: temp[0],
                    name: temp[1]
                })
            }
        }   
        else {
            const temp = chuyenmuc.split('_');
            authorized.push({
                id: temp[0],
                name: temp[1]
            })
        }

        var newUserInfo = {            
            lastEdited: new Date().toISOString(),
            staffInfo: {
                authorized
            }
        }        

        if (matkhau){
            newUserInfo.password = bcrypt.hashSync(matkhau,10)
        }

        userModel.updateOne({_id:userId},newUserInfo)
        .then(() => {
            res.redirect('/manager/staffs')
        })
        .catch(err => {
            return res.status(500).json({
                msg:'Thêm mới staff thất bại với lỗi ' + err,
            });
        })

    }

    // [DELETE] /user/:userId
    delUser(req,res){
        /*
        chỉ xóa userModel
        ko xóa các sender.id trong comment hay post, ko xoa comment hay post, và ko xóa attachment. ko xóa avatar
        */

        //TODO: kiểm tra quyền
        const {userId} = req.params;
        userModel.deleteOne({_id:userId})
        .then( () => {
            return res.status(200).json({
                code:0,
                msg:`delete user thành công`,
                data: {
                    user: req.user,
                }
            });
        })
        .catch(err => {
            return res.status(500).json({
                msg:'delete user thất bại với lỗi ' + err,
            });
        })
    }
}

module.exports = new ApiController;