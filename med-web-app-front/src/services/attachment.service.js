import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_API_URL + '/api/files/';

class AttachmentService {

    getAttachmentsForUser(username) {
        return axios.get(API_URL + username, {headers: authHeader()});
    }

    getAttachmentsInfoForUser(username) {
        return axios.get(API_URL + 'test/' + username, {headers: authHeader()});
    }

    uploadAttachment(file, fileName, isDicom, UID, onUploadProgress) {
        let formData = new FormData();

        if (isDicom) {
            formData.append("file", new Blob([file]), fileName);
        } else {
            formData.append("file", file);
            UID = null;
        }
        const user = JSON.parse(localStorage.getItem('user'));
        let token = '';
        if (user && user.token) {
            token = user.token;
        }
        return axios.post(API_URL + "upload/" + UID, formData, {
            headers: {'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + token},
            onUploadProgress,
        });
    }

    deleteAttachment(fileId) {
        const user = JSON.parse(localStorage.getItem('user'));
        let token = '';
        if (user && user.token) {
            token = user.token;
        }
        return axios.delete(API_URL + 'delete/' + fileId, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
    }

    renameAttachment(fileId, newName) {
        let formData = new FormData();
        formData.append("name", newName);

        const user = JSON.parse(localStorage.getItem('user'));
        let token = '';
        if (user && user.token) {
            token = user.token;
        }
        return axios.post(API_URL + "rename/" + fileId, formData, {
            headers: {'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + token}
        });
    }

    async downloadAttachment(fileId, fileName) {
        axios.get(API_URL + 'download/' + fileId, {responseType: 'blob', headers: authHeader()})
            .then(response => {
                var fileDownload = require('js-file-download');
                fileDownload(response.data, fileName);
                return response;
            });
    }

    async getPreview(fileId) {
        return axios.get(API_URL + 'preview/' + fileId, {headers: authHeader()});
    }

    async getPreviewNew(fileId) {

        const user = JSON.parse(localStorage.getItem('user'));
        let token = '';
        if (user && user.token) {
            token = user.token;
        }
        return axios.get(API_URL + 'preview/' + fileId, {
            responseType: 'blob',
            headers: {'Authorization': 'Bearer ' + token}
        });
    }
}

export default new AttachmentService();