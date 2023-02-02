var mongoose = require('mongoose');

var PhotoSchema = new mongoose.Schema({
    imageUrl: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Requires population of author
PhotoSchema.methods.toJSONFor = function(user) {
    return {
        id: this._id,
        body: this.imageUrl,
        createdAt: this.createdAt,
        author: this.author.toProfileJSONFor(user)
    };
};

mongoose.model('Photo', PhotoSchema);