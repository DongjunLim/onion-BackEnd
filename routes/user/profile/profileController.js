const ProfileManager = require('../../../models/Profile/ProfileManager');
const UserManager = require('../../../models/User/UserManager');
const multer = require('multer');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 10 * 1024 * 1024 } });

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
            output.profilePhotoUrl = "profile/" + req.userNickname;
        }
        return output ? res.send(output) : res.sendStatus(202);

    },

    //API27
    updateProfileInfo: async (req,res) => {
        const {
            userHeight,
            userAge,
            userAddress1,
            userAddress2,
            userInstagramUrl,
        } = req.body;

        const updateProfileResult = await UserManager.updateProfile(req.userNickname,
            userHeight,
            userAge,
            userAddress1,
            userAddress2,
            userInstagramUrl);
        console.log(updateProfileResult);
        return updateProfileResult ? res.sendStatus(200) : res.sendStatus(202);
    },

    // updateProfilePhoto: async (req, res) => {
        
    // } 

}