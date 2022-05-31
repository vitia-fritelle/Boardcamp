import { listCategories, newCategory } from "./categoriesControllers";
import { listCustomers, newCustomer, searchCustomer, updateCustomer } from "./customersControllers";
import { listGames, newGame } from "./gamesControllers";
import { deleteRental, finishRental, listRentals, newRental } from "./rentalsControllers";

const controllers = {
    listCategories,
    newCategory,
    listGames,
    newGame,
    listCustomers,
    newCustomer,
    searchCustomer,
    updateCustomer,
    listRentals,
    finishRental,
    newRental,
    deleteRental
};

export default controllers;