const MenuItemsModel = require("../Model/MenuItemsModel");
const RestaurantModel = require("../Model/RestaurantModel");

const { mongoDbError } = require("../Routes/debugger");
module.exports.getRestaurantListByLocID = async (request, response) => {
  let { loc_id } = request.params;
  try {
    let result = await RestaurantModel.find(
      { location_id: loc_id },
      { locality: 1, name: 1, city: 1, image: 1 }
    );
    if (result.length === 0) {
      response.send({
        status: false,
        message: "restaurant is not available for given location",
      });
    } else {
      response.send({
        status: true,
        restaurants: result,
      });
    }
  } catch (error) {
    mongoDbError(error.message);
    response.status(500).send({
      status: false,
      message: "Invalid id is passed",
    });
  }
};

module.exports.getRestaurantDetailsByID = async (request, response) => {
  let { id } = request.params;
  try {
    let result = await RestaurantModel.findById(id); // .findOne({_id:id})
    response.send({
      status: true,
      restaurants: result,
    });
  } catch (error) {
    mongoDbError(error.message);
    response.status(500).send({
      status: false,
      message: "Invalid id is passed",
    });
  }
};

module.exports.filter = async (request, response) => {
  // filter
  // mealtype (mandatory)
  // location
  // cuisines
  // cost-for-two (500 (low_cost) to 1000 (high_cost))
  // sort (ASC / DESC)
  // page (1,2,3,4,5) (pre-page - 2 restaurant)
  let { mealtype, location, l_cost, h_cost, sort, cuisine } = request.body;

  sort = sort ? sort : 1;
  // high to low (DESC) and low to heigh (ASC)
  const filterData = {};

  if (mealtype !== undefined) filterData["mealtype_id"] = mealtype;
  if (location !== undefined) filterData["location_id"] = location;
  if (l_cost !== undefined && h_cost !== undefined)
    filterData["min_price"] = { $gt: l_cost, $lt: h_cost };
  if (cuisine !== undefined) filterData["cuisine_id"] = { $in: cuisine };
  console.log(filterData);
  try {
    let result = await RestaurantModel.find(filterData, {
      name: 1,
      city: 1,
      locality: 1,
      location_id: 1,
      min_price: 1,
      image: 1,
      cuisine_id: 1,
      cuisine: 1,
    }).sort({
      min_price: sort,
    });
    // high to low (DESC) -1
    // low to heigh (ASC) 1
    if (result.length === 0) {
      response.send({
        status: false,
        message: "restaurant is not available",
      });
    } else {
      response.send({
        status: true,
        restaurants: result,
      });
    }
  } catch (error) {
    mongoDbError(error.message);
    response.status(500).send({
      status: false,
      message: "Invalid id is passed",
    });
  }
};

module.exports.getMenuItems = async (request, response) => {
  let { rest_id } = request.params;
  try {
    let result = await MenuItemsModel.find({ restaurantId: rest_id });
    response.status(200).send({
      status: true,
      menu_items: result,
    });
  } catch (error) {
    mongoDbError(error.message);
    response.status(500).send({
      status: false,
      message: "Invalid id is passed",
    });
  }
};
