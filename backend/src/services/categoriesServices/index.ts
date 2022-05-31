import utils from "../../utils";

const {CustomError} = utils;

export const isEmpty = (name:string) => {
    if (!name) {
        throw new CustomError(400,'O nome não pode estar vazio');
    }
};

