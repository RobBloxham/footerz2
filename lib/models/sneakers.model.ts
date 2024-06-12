import mongoose from 'mongoose';

const sneakersSchema = new mongoose.Schema({
    nickname: { type: String, required: true },
    colorway: { type: String, required: true },
    releaseDate: { type: Date, required: true }, 
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    parentId: {
        type: String,
    }

})

const Sneakers = mongoose.models.Sneakers || mongoose.model('Sneakers', sneakersSchema);

export default Sneakers;