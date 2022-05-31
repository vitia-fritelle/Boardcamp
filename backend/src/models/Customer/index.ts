export default class Customer {
    constructor(
        public name:string,
        public phone:string,
        public cpf:string,
        public birthday:string,
        public id?:number) {
    }
};