import services from "../../services";

const {isEmpty} = services;

export default class Category {
    
    constructor(
        public name:string,
        public id?:number) {
        isEmpty(name);    
    }
    
};