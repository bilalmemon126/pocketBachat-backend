import mongoose from "mongoose"

const dbConnect = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
    }
    catch (error) {
        console.log("mongodb connection error ", error)
        return error
    }
}

export default dbConnect