import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL + '/api/records/';


class RecordService {

    constructor(props) {
        this.createRequestParamsForGet = this.createRequestParamsForGet.bind(this);
        this.createRequestParamsForSave = this.createRequestParamsForSave.bind(this);
    }

    getAll(page, pageSize, searchTitle, selectedTopicValue) {
        let parameters = this.createRequestParamsForGet(page, pageSize, searchTitle, selectedTopicValue);

        return axios.get(API_URL + 'all/root',
            {headers: authHeader(), params: parameters});
    }

    getRecord(recordId) {
        return axios.get(API_URL + recordId, {headers: authHeader()});
    }

    getAnswers(recordId) {
        return axios.get(API_URL + 'answers/' + recordId, {headers: authHeader()});
    }

    saveRecord(title, content, topics, files, newFiles, parentId = -1) {
        return axios.post(API_URL + 'create', {title, content, topics, files, newFiles, parentId}, {headers: authHeader()});
    }

    deleteRecord(recordId){
        return axios.delete(API_URL + "delete/" + recordId, {headers: authHeader()});
    }

    createRequestParamsForGet(page, pageSize, searchTitle, selectedTopicValue) {
        let params = {};

        if (searchTitle) params["searchTitle"] = searchTitle;
        if (page) params["page"] = page - 1;
        if (pageSize) params["pageSize"] = pageSize;
        if (selectedTopicValue) params["selectedTopicValue"] = selectedTopicValue;

        return params;
    }

    createRequestParamsForSave(title, content, topics, attachments) {
        let params = {};

        if (title) params["title"] = title;
        if (content) params["content"] = content;
        if (topics) params["topics"] = topics;
        if (attachments) params["files"] = attachments;

        return params;
    }

}

export default new RecordService();