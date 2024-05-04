import React from "react";
import "../Style/frontPage.css";
import Banner from "./Banner";
import QuickSearch from "./QuickSearch";
import axios from "axios";
const BASE_URL = window.env.REACT_APP_BASE_URL;

class Homepage extends React.Component {
  constructor() {
    super();
    this.state = {
      loc: [],
      mealtype: [],
    };
  }

  componentDidMount() {
    axios({
      withCredentials: true,
      url: `${BASE_URL}/location`,
      method: "get",
      headers: {
        "Content-Type": "application/JSON",
        "Access-Control-Allow-Credentials": true,
      },
    })
      .then((res) => {
        this.setState({ loc: res.data.location });
      })
      .catch((err) => console.log(err));

    axios({
      withCredentials: true,
      url: `${BASE_URL}/mealtype`,
      method: "get",
      headers: {
        "Content-Type": "application/JSON",
        "Access-Control-Allow-Credentials": true,
      },
    })
      .then((res) => {
        this.setState({ mealtype: res.data.meal });
      })
      .catch((err) => console.log(err));
  }

  render() {
    const { loc, mealtype } = this.state;

    return (
      <div>
        <Banner locationData={loc} />

        <QuickSearch mealtypeData={mealtype} />
      </div>
    );
  }
}

export default Homepage;
