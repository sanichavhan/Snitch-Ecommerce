import {body,validationResult} from 'express-validator'

const validateRequest = (req,res)  => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }
    next();
}
export const validateRegisterUser = [
    body("email")
    .isEmail().withMessage("Please provide a valid email address."),
    body("contact")
        .isMobilePhone().withMessage("Please provide a valid contact number."),
    body("password")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),
    body("fullname")
        .notEmpty().withMessage("Full name is required."),
    body("isSeller")
        .isBoolean().withMessage("isSeller must be a boolean value."),
    validateRequest
]