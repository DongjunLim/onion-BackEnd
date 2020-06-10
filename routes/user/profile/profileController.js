const ProfileManager = require('../../../models/Profile/ProfileManager');
const UserManager = require('../../../models/User/UserManager');

module.exports.profileController = {
    
    //API25
    getProfileInfo: async (req,res) => {
        const { targetNickname } = req.params;
        const output = await ProfileManager.getProfileInfo(targetNickname);

        return output ? res.send(output) : res.sendStatus(202);
    },

    //API26
    getMyProfileInfo: async (req,res) => {

        const output = await ProfileManager.getMyProfileInfo(req.userNickname);
        console.log(output)
        output["userNickname"] = req.userNickname
        if(!output.profilePhotoUrl){
            output.profilePhotoUrl = "profile/beauty_1556873758105+3.JPG";
        }
        return output ? res.send(output) : res.sendStatus(202);

    },

    //API27
    updateProfileInfo: async (req,res) => {
        const {
            userGender,
            userHeight,
            userAge,
            userAddress1,
            userAddress2,
            userInstagramUrl,
            userProfilePhoto
        } = req.body.userInfo;

        const updateProfileResult = UserManager.updateProfile(req.userNickname,
            userGender,
            userHeight,
            userAge,
            userAddress1,
            userAddress2,
            userInstagramUrl) 
        const updateProfilePhotoResult = await UserManager.updateProfilePhoto(req.userNickname,userProfilePhoto);

        if(updateProfilePhotoResult && updateProfileResult) return res.sendStatus(200);
        else if(!updateProfilePhotoResult)  return res.sendStatus(204);
        else if (!updateProfileResult)  return res.sendStatus(202);
    }

}