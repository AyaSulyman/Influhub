const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/de-vision', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("MongoDB connection error:", error);
});
