import { Component, PropTypes } from "react"
import Moment from "moment"
import { Link } from "react-router"

export default class LikesItem extends Component {

  static propTypes = {
    like: PropTypes.object.isRequired
  }

  backgroundStyles = {
    backgroundImage: `url('${this.props.like.image}')`
  }

  getDate(entry) {
    let date = new Date(entry.date);

    let time = Moment(date);
    let currentTime = new Date();

    if (date.getUTCFullYear() === currentTime.getUTCFullYear())
      return Moment(time).format("MMM D")
    else
      return Moment(time).format("MMM D, YYYY")
  }

  iconClasses = `${this.props.like.icon} soft-half-right`

  render() {

    const like = this.props.like;

    return (
      <section className="hard">
        <div className="grid">
          <div className="one-whole grid__item">
            <div className="card">
              <Link to={like.link} className="plain">
                <div
                  className="background--fill card__image ratio--landscape"
                  style={this.backgroundStyles}
                  ></div>
                <div className="card__item soft text-dark-tertiary">
                  <h4 className="text-dark">{like.title}</h4>
                    <i className={this.iconClasses}></i>
                    <h7>{like.category}</h7>
                  <h7 className="text-right float-right">{this.getDate(like)}</h7>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

}
