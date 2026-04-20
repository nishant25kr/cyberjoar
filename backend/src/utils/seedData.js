const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Intelligence = require('../models/Intelligence');

const seedData = [
    {
        title: "Large Deployment Near Border",
        sourceType: "IMINT",
        description: "Satellite imagery reveals significant armor movement near the northern perimeter.",
        latitude: 34.0522,
        longitude: -118.2437,
        confidence: 85,
        priority: "High",
        tags: ["Armor", "Satellite", "Border"],
        imageUrl: "https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Informant Report: Logistics Hub",
        sourceType: "HUMINT",
        description: "Local source reports increased activity at warehouse sector 7. Expected supply chain surge.",
        latitude: 34.0722,
        longitude: -118.2637,
        confidence: 70,
        priority: "Medium",
        tags: ["Logistics", "Informant"],
        imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Encrypted Signal Burst Detected",
        sourceType: "OSINT",
        description: "Public frequency monitors picked up anomalous encrypted bursts from downtown relay towers.",
        latitude: 34.0122,
        longitude: -118.2237,
        confidence: 90,
        priority: "Critical",
        tags: ["SIGINT", "Digital", "Encrypted"],
        imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Protest Coordination Found",
        sourceType: "OSINT",
        description: "Social media analysis indicates coordinated gatherings planned at the civic center tomorrow.",
        latitude: 34.0422,
        longitude: -118.2537,
        confidence: 65,
        priority: "Low",
        tags: ["Social Media", "Public Event"],
        imageUrl: "https://images.unsplash.com/photo-1541873676947-d3999908de78?q=80&w=800&auto=format&fit=crop"
    }
];

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');
    } catch (err) {
        console.error('Connection failed:', err);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await connectDB();
        await Intelligence.deleteMany();
        await Intelligence.insertMany(seedData);
        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
