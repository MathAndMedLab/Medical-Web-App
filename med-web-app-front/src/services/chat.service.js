import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL + '/api/msg/';


class ChatService {
    getMessages(senderUsername, recipientUsername) {
        let parameters = this.createRequestParamsForGetMsg(senderUsername, recipientUsername);

        return axios.get(API_URL + 'all/messages',
            {headers: authHeader(), params: parameters});
    }

    createRequestParamsForGetMsg(senderUsername, recipientUsername) {
        let params = {};

        params["senderUsername"] = senderUsername;
        params["recipientUsername"] = recipientUsername;
        return params;
    }

    getChatRoomMessages(chatId) {
        let params = {};

        params["chatId"] = chatId;
        return axios.get(API_URL + 'all/chatRoom/messages',
            {headers: authHeader(), params: params});
    }

    getUnreadMessages(recipientId) {
        const parameters = this.createRequestParamsForGetUnreadMsg(recipientId);

        return axios.get(API_URL + 'unread/messages',
            {headers: authHeader(), params: parameters});
    }

    async downloadAttachmentByMsgSendDate(time, senderName, recipientName, fileName) {
        axios.get(API_URL + 'download/by/send/date/' + time + "/" + senderName + "/" + recipientName + "/" + fileName + "/", {
            responseType: 'blob',
            headers: authHeader()
        })
            .then(response => {
                var fileDownload = require('js-file-download');
                fileDownload(response.data, fileName);
                return response;
            });
    }

    createRequestParamsForGetUnreadMsg(recipientId) {
        let params = {};

        params["recipientId"] = recipientId;
        return params;
    }

    updateStatusUnreadMessages(messages) {
        return axios.post(API_URL + 'update/messages', {messages},
            {headers: authHeader()});
    }

    createRequestParamsForUpdateUnreadMsg(messages) {
        let params = {};

        params["messages"] = messages;
        return params;
    }

    deleteMsg(message) {
        return axios.post(API_URL + 'delete', {message}, {headers: authHeader()})
    }

    createGroupChat(chatName, members, creator, creatorId, avatar, sendDate, timeZone) {
        return axios.post(API_URL + 'create-group-chat',
            {chatName, members, creator, creatorId, avatar, sendDate, timeZone},
            {headers: authHeader()})
    }

    getGroupChats (member) {
        let parameters = {}
        parameters["memberName"] = member.memberName
        return axios.get(API_URL + 'all/groupChats',
            {headers: authHeader(), params: parameters});
    }

    getGroupChat (chatId) {
        let parameters = {}
        parameters["chatId"] = chatId
        return axios.get(API_URL + 'groupChat',
            {headers: authHeader(), params: parameters});
    }

    deleteMsgByTimeAndChatId(time, senderName, recipientName) {
        return axios.post(API_URL + 'delete/by/time/chatid', {
            time,
            senderName,
            recipientName
        }, {headers: authHeader()})
    }
}

export default new ChatService();