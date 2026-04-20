const mongoose = require('mongoose');

const IntelligenceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    sourceType: {
        type: String,
        enum: ['OSINT', 'HUMINT', 'IMINT'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    imageUrl: {
        type: String,
        default: ''
    },
    confidence: {
        type: Number,
        min: 0,
        max: 100,
        default: 50
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    tags: [String],
    rawMetadata: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Intelligence', IntelligenceSchema);
