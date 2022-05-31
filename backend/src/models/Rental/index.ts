export default class Rental {
    public rentDate: Date;

    public returnDate: Date|null = null;

    public delayFee: number|null = null;

    constructor(
        public customerId:number,
        public gameId:number,
        public daysRented:number,
        public originalPrice: number,
        public id?:number) {
        this.rentDate = new Date();
    }
};