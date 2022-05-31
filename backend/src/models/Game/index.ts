export default class Game {
    constructor(
        public name:string, 
        public image: string, 
        public stockTotal:number,
        public categoryId:number, 
        public pricePerDay:number,
        public id?:number) {
    }
};