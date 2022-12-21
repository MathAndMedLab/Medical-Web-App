import ProfileService from "../services/profile.service";
import GetAllReviews from "./review-request";

async function GetUser(username) {
    const response = await (ProfileService.getProfile(username).then(
        async response => {
            return response;
        })
        .catch((e) => {
            console.log(e);
        }));
    return await response.data;

}

export default GetUser;