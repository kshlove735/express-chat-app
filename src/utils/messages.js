const messageModel = require("../models/messages.model");

const getToken = (sender, receiver) => {
    let key = [sender, receiver].sort().join("_");
    return key;
}
const saveMessage = async ({ from, to, message, time }) => {
    let token = getToken(from, to);
    let data = {
        from,
        message,
        time
    }

    try {
        const res = await messageModel.updateOne({ userToken: token }, {
            $push: { message: data }
        })
        console.log(`메시지가 생성되었습니다.`, res);
    } catch (err) {
        throw (err)
    }

}



module.exports = {
    saveMessage
}