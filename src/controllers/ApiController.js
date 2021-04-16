const postModel = require('../models/post.model');
const commentModel = require('../models/comment.model');

const unreadNotifiModel = require('../models/unreadNotifi.model');
const userModel = require('../models/user.model');

const {unlink}  = require('fs/promises')

const mogoose = require('mongoose')

const {multipleMongooseToObject, mongooseToObject} = require('../../util/mongoose')

//TODO: rename post name thành title

class ApiController{

    // [GET] /posts?page=   &user=    &offset=
    getPosts(req, res){
        // mỗi lần chỉ hiện 10 bài có createdAt mới nhất
        const pageNum = parseInt(req.query.page);
        const offset = parseInt(req.query.offset);
        const postPerPage = 10;

        const senderId = req.query.user !== "" ? req.query.user : {$ne: null}
        console.log("{senderId} ", {"sender.id" :senderId})
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
        // mỗi lần chỉ hiện 10 bài có createdAt mới nhất
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
            console.log("errer ", err)
            return res.status(500).json({
                msg:'lấy post thất bại với lỗi ' + err,
            });
        })
        
    }

    // [POST] /post
    addPost(req, res){        
        var imagesArray = undefined;
        var attachmentsArray = undefined;
        console.log("req.files.attachmentFile ", req.files.attachmentFile)
        if(req.files.attachmentFile !== undefined){
            imagesArray = req.files.attachmentFile
            .filter(fi => fi.mimetype.startsWith('image/') )
            .map( fi => {
                return fi.path.replace("public","");
            });

            attachmentsArray = req.files.attachmentFile
            .filter(fi => !fi.mimetype.startsWith('image/') )
            .map( fi => {
                return fi.path.replace("public","");
            });
        }
        console.log("imagesArray ", imagesArray);
        console.log("attachmentsArray ", attachmentsArray);     

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
            videoIdArray : req.body.videoId
        }

        new postModel(post).save()
        .then((resultPost) => {
            //TODO: thêm vào unread-notifications cho các user hiện tại. (nên là trigger)
            if(resultPost.department.id){
                userModel.find({ _id: {$ne: resultPost.sender.id}})
                .then(users => {
                    users.map( user => {
                        new unreadNotifiModel({
                            _id: mogoose.Types.ObjectId(),
                            senderId: resultPost.sender.id,
                            postId: resultPost._id,
                            receiverId: user.username,
                            title: resultPost.name,
                            department: resultPost.department.name,
                            postCreatedAt: resultPost.createdAt,
                        }).save()
                    })                
                })
            }

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
            return res.status(500).json({
                msg:'đăng post thất bại với lỗi ' + err,
            });
        })
        
    }

    // [DELETE] /post/:postId
    delPost(req, res){   
        //TODO: xóa notificaition     
        const {postId} = req.params;
        postModel.findOne({_id: postId})
        .then(postFound => {
            console.log('postFound ',postFound)
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
            
            // xóa hết attachment
            var promises = [];
            postFound.imagesArray.forEach(imageLink => {
                promises.push(unlink(`.\\public${imageLink}`));
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
            //TODO: xóa unread-notifications hiện tại. (nên là trigger)
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
            console.log("err ",err)
            return res.status(500).json({
                msg:'xóa post thất bại với lỗi ' + err,
            });
        })
        

    }

    /* -------------------------------------------- */
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
            console.log("comments ", comments)

            return res.status(200).json({
                code:0,
                msg:`lấy ${cmtPerPost} comment thành công`,
                data: {
                    comments                 
                }
            });

        })
        .catch(err => {
            console.log("err ", err)
            return res.status(500).json({
                msg:`lấy ${cmtPerPost} comment thất bại với lỗi: ${err}`,
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
            console.log("req.comment  " ,req.comment)
            return new commentModel(req.comment).save();
        })
        .then((re) => {
            console.log("re  " ,re)
            return res.status(200).json({
                code:0,
                msg:'đăng comment thành công',
                data: {
                    comment: req.comment,
                }
            });
        })
        .catch(err => {
            return res.status(500).json({
                msg:'đăng comment thất bại với lỗi ' + err,
            });
        })
    }

    // [DELETE] /post/:postId/comment/:commentId
    delComment(req, res){   
        //TODO: kiểm tra user này có quyền xóa comment này ko ( 401 Unauthorized)

        var post = {};
        return res.status(200).json({
            code:0,
            msg:'xóa comment thành công',
            data: post
        });

    }

}

module.exports = new ApiController;