import {body,validationResult} from 'express-validator'

const validateRequest = (req,res,next)  => {
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
        .matches(/^\d{10}$/).withMessage("Contact must be a valid 10-digit number."),
    body("password")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),
    body("fullname")
        .notEmpty().withMessage("Full name is required."),
    body("isSeller")
        .optional()
        .isBoolean().withMessage("isSeller must be a boolean value."),
    validateRequest
]

export const validateLoginUser = [
    body("email")
    .isEmail().withMessage("Please provide a valid email address."),
    body("password")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),
    validateRequest
]