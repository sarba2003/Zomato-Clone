const Restaurant = require("../Model/restaurantDB");

exports.getRestaurant = (req, res) => {
  Restaurant.find()
    .then((response) => {
      res.status(200).json({
        message: "Restaurant Fetched Successfully",
        restaurant: response,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.getRestaurantByLocationId = (req, res) => {
  const { locId } = req.params;

  Restaurant.find({ city: locId }, {})
    .then((response) => {
      res.status(200).json({
        message: "Restaurant By Location Id Fetched Successfully",
        restaurants: response,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.getRestaurantById = (req, res) => {
  const { id } = req.params;

  Restaurant.findById(id)
    .then((response) => {
      res.status(200).json({
        message: "Restaurant By Id Fetched Successfully",
        restaurants: response,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.filteredRestaurant = (req, res) => {
  let { location, mealtype, lcost, hcost, cuisine, sort, page } = req.body;

  sort = sort ? sort : 1;
  page = page ? page : 1;
  const itemsPerPage = 2;
  const startIndex = page * itemsPerPage - itemsPerPage;
  const endIndex = page * itemsPerPage;

  var filterObj = {};

  location && (filterObj["city"] = location);
  mealtype && (filterObj["type.mealtype"] = mealtype);
  lcost && hcost && (filterObj["cost"] = { $gte: lcost, $lte: hcost });
  cuisine && (filterObj["Cuisine.cuisine"] = { $in: cuisine });

  console.log(filterObj);

  Restaurant.find(filterObj)
    .sort({ cost: sort })
    .then((response) => {
      const filteredResponse = response.slice(startIndex, endIndex);
      res.status(200).json({
        message: "Restaurant Filtered Successfully",
        restaurants: filteredResponse,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
