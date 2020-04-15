



class UserManager{
    constructor(){
        this.name = "Dongjun";
    }


    async createUser(userEmail, userNickname, userPassword, userGender, userAge, userheight, userAddress1, userAddress2) {
        console.log("TEST2");
    }

    async initUserObject(){

    }
    async checkEmail(){
        /*
            DB에서 Email 받아와서 확인하는 로직작성
        */
        return isEmail ? true : false;

    }

    



}

module.exports = UserManager;