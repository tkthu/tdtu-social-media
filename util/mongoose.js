module.exports = {
    // Chuyển courses thành object thường để khắc phục lỗi bảo mật của handlerbar
    multipleMongooseToObject: function (mongoosesArray) {
        return mongoosesArray.map((mongoosesArray) =>
            mongoosesArray.toObject(),
        );
    },
    mongooseToObject: function (mongoose) {
        return mongoose ? mongoose.toObject() : mongoose;
    },
};
