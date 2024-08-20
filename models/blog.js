const { Schema, model } = require('mongoose');

const blogSchema = new Schema({
    title: {
        required: true,
        type: String
    },
    body: {
        required: true,
        type: String
    },
    coverImageUrl: {
        type: String
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
}, { timestamps: true });

const Blog = model('blog', blogSchema);

module.exports = {
    Blog
}