import { ValidateAccessToken } from "../../utils/index.js";

export const UserAuth = async (req,res,next) => {
    
    const isAuthorized = await ValidateAccessToken(req);

    if(isAuthorized){
        return next();
    }
    return res.status(403).json({message: 'Not Authorized'})
}