import React from "react";
import axios from "axios";
import queryString from "query-string";
import Modal from "react-modal";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../Style/detailPage.css";
const BASE_URL = window.env.REACT_APP_BASE_URL;

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

class Details extends React.Component {
  constructor() {
    super();
    this.state = {
      restaurant: [],
      resId: undefined,
      galleryModal: false,
      menuModal: false,
      menu: [],
      formModal: false,
    };
  }

  componentDidMount() {
    const q = queryString.parse(window.location.search);
    const { restuarant } = q;

    axios({
      url: `${BASE_URL}/restaurants/${restuarant}`,
      method: "get",
      headers: { "Content-Type": "application/JSON" },
    })
      .then((res) => {
        this.setState({ restaurant: res.data.restaurants, resId: restuarant });
      })
      .catch((err) => console.log(err));
  }

  handleModal = (state, value) => {
    const { resId } = this.state;

    if (state === "menuModal" && value === true) {
      axios({
        url: `${BASE_URL}/menu/${resId}`,
        method: "get",
        headers: { "Content-Type": "application/JSON" },
      })
        .then((res) => {
          this.setState({ menu: res.data.menuItem });
        })
        .catch((err) => console.log(err));
    }

    this.setState({ [state]: value });
  };

  addItems = (index, operationType) => {
    var total = 0;
    const items = [...this.state.menu];
    const item = items[index];

    if (operationType === "add") {
      item.qty += 1;
    } else {
      item.qty -= 1;
    }

    items[index] = item;

    items.map((x) => {
      total += x.qty * x.price;
    });
    this.setState({ menu: items, subtotal: total });
  };

  initPayment = (data) => {
    const options = {
      key: "rzp_test_ccDeDrRzUiorhL",
      amount: data.amount,
      currency: data.currency,
      description: "Test Transaction",
      order_id: data.id,

      handler: async (response) => {
        try {
          const verifyLink = `${BASE_URL}/api/payment/verify`;
          const { data } = await axios.post(verifyLink, response);
        } catch (error) {
          console.log(error);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  handlePayment = async () => {
    const { subtotal } = this.state;

    try {
      const orderLink = `${BASE_URL}/api/payment/orders`;
      const { data } = await axios.post(orderLink, { amount: subtotal });

      this.initPayment(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { restaurant, galleryModal, menuModal, menu, subtotal, formModal } =
      this.state;
    return (
      <div>
        <nav class="navbar bg-danger" data-bs-theme="">
          <div class="container">
            <div class="navbar-brand text-danger circle">
              <h2 class="logo">e!</h2>
            </div>
          </div>
        </nav>

        <div className="container">
          <div className="bannerCover">
            <img src={restaurant.thumb} className="banner" alt=" " />
            <input
              type="button"
              value="Click to see Image Gallery"
              className="gallery_button"
              onClick={() => this.handleModal("galleryModal", true)}
            />
          </div>

          <h2 className="heading mt-4">{restaurant.name}</h2>

          <div>
            <input
              type="button"
              className="btn btn-danger order_button"
              value="Place Online Order"
              onClick={() => this.handleModal("menuModal", true)}
            />
          </div>

          <div className="tabs">
            <div className="tab">
              <input
                type="radio"
                className=""
                id="tab-1"
                name="tab-group"
                checked
              />
              <label htmlFor="tab-1">Overview</label>

              <div className="content">
                <div className="about">About this place</div>

                <div className="head">Cuisine</div>
                <div className="value">
                  {restaurant &&
                    restaurant.Cuisine &&
                    restaurant.Cuisine.map((cu) => `${cu.name}, `)}
                </div>

                <div className="head">Average Cost</div>
                <div className="value">
                  ₹{restaurant.cost} for two people (approx.)
                </div>
              </div>
            </div>

            <div className="tab ms-4">
              <input type="radio" className="" id="tab-2" name="tab-group" />
              <label htmlFor="tab-2">Contact</label>

              <div className="content">
                <div className="value">Phone Number</div>
                <div className="value-red">+91 {restaurant.contact_number}</div>

                <div className="head">{restaurant.name}</div>
                <div className="value">{restaurant.address}</div>
              </div>
            </div>
          </div>
        </div>

        <Modal isOpen={galleryModal} style={customStyles}>
          <div
            onClick={() => this.handleModal("galleryModal", false)}
            className="close"
          >
            <i class="bi bi-x-lg"></i>
          </div>
          <div>
            <Carousel
              showIndicators={false}
              showThumbs={false}
              showStatus={false}
            >
              <div>
                <img src={restaurant.thumb} className="gallery_img" alt=" " />
              </div>
            </Carousel>
          </div>
        </Modal>

        <Modal isOpen={menuModal} style={customStyles}>
          <div
            onClick={() => this.handleModal("menuModal", false)}
            className="close"
          >
            <i class="bi bi-x-lg"></i>
          </div>
          <div>
            <h3 className="menu_restaurant_name">{restaurant.name}</h3>

            {menu?.map((item, index) => {
              return (
                <div className="menu">
                  <div className="menu_body">
                    <h5 className="font_weight">{item.name}</h5>
                    <h5 className="font_weight">₹ {item.price}</h5>
                    <p className="item_details">{item.description}</p>
                  </div>

                  <div className="menu_image">
                    <img
                      className="item_image"
                      src={`./images/${item.image}`}
                      alt="food"
                    />

                    {item.qty === 0 ? (
                      <div
                        className="item_quantity_button"
                        onClick={() => this.addItems(index, "add")}
                      >
                        ADD
                      </div>
                    ) : (
                      <div className="item_quantity_button">
                        <button onClick={() => this.addItems(index, "sub")}>
                          {" "}
                          -{" "}
                        </button>
                        <span className="qty"> {item.qty} </span>
                        <button
                          onClick={() => this.addItems(index, "add")}
                          style={{ color: "#61B246" }}
                        >
                          {" "}
                          +{" "}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="payment">
              {subtotal === undefined ? (
                <h4 className="total font_weight">Subtotal: ₹ 0 </h4>
              ) : (
                <h4 className="total font_weight">Subtotal: ₹ {subtotal}</h4>
              )}

              <button
                className="btn btn-danger payment_button"
                onClick={() => {
                  this.handleModal("menuModal", false);
                  this.handleModal("formModal", true);
                }}
              >
                Pay Now
              </button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={formModal} style={customStyles}>
          <div
            onClick={() => this.handleModal("formModal", false)}
            className="close"
          >
            <i class="bi bi-x-lg"></i>
          </div>
          <div style={{ width: "20em" }}>
            <h3 className="menu_restaurant_name">{restaurant.name}</h3>

            <label htmlFor="name" style={{ marginTop: "10px" }}>
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              style={{ width: "100%" }}
              className="form-control"
              id="name"
            />

            <label htmlFor="mobile" style={{ marginTop: "10px" }}>
              Mobile Number
            </label>
            <input
              type="text"
              placeholder="Enter mobile number"
              style={{ width: "100%" }}
              className="form-control"
              id="mobile"
            />

            <label htmlFor="address" style={{ marginTop: "10px" }}>
              Address
            </label>
            <textarea
              type="text"
              rows="4"
              placeholder="Enter your address"
              style={{ width: "100%" }}
              className="form-control"
              id="address"
            ></textarea>

            <button
              className="btn btn-success"
              style={{ float: "right", marginTop: "18px" }}
              onClick={this.handlePayment}
            >
              Proceed
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Details;
