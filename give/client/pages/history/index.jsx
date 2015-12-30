import { Component, PropTypes} from "react"
import { Link } from "react-router"
import ReactDom from "react-dom"
import { connect } from "react-redux"
import ReactMixin from "react-mixin"
import Moment from "moment"

// loading state
import { Loading } from "../../../../core/client/components"
import { Authorized } from "../../../../core/client/blocks"
import { nav as navActions } from "../../../../core/client/actions"
import { Split, Left, Right } from "../../../../core/client/layouts/split"

import { Transactions } from "../../../lib/collections"

import Details from "./history.Details"

@connect()
@ReactMixin.decorate(ReactMeteorData)
export default class Template extends Component {

  state = {
    page: 1,
    pageSize: 20,
    shouldUpdate: true,
    done: false
  }

  // componentWillMount() {
  //   this.props.dispatch(navActions.setLevel("CONTENT"))
  //
  // }
  //
  // componentWillUnmount() {
  //   this.props.dispatch(navActions.setLevel("TOP"))
  // }
  componentDidMount() {
    const container = ReactDom.findDOMNode(this.refs["container"])
    container.addEventListener("scroll", this.pageOnScroll);
    window.addEventListener("scroll", this.pageOnScroll);
  }

  componentWillUnmount() {
    const container = ReactDom.findDOMNode(this.refs["container"])
    container.removeEventListener("scroll", this.pageOnScroll);
    window.removeEventListener("scroll", this.pageOnScroll);
  }

  pageOnScroll = (e) => {
  if (this.state.done) return

  const { scrollHeight, clientHeight, scrollTop, offsetTop } = e.target

  let percentage;

  if (scrollTop && scrollHeight) {
    percentage = scrollTop / scrollHeight
  } else if (window.scrollY && document.body.clientHeight) {
    percentage = window.scrollY, document.body.clientHeight
  }

  if ( percentage > 0.5 && this.state.shouldUpdate) {
    this.setState({
      page: this.state.page + 1,
      shouldUpdate: false
    });

    // wait a bit to prevent paging multiple times
    setTimeout(() => {
      if (this.state.page * this.state.pageSize > this.data.transactions.length) {
        this.setState({ done: true, shouldUpdate: false });
      } else {
        this.setState({ shouldUpdate: true });
      }
    }, 1000);
  }
}

  getMeteorData() {
    Meteor.subscribe("transactions")
    const transactions = Transactions.find({}, {
      limit: this.state.page * this.state.pageSize,
      sort: { CreatedDateTime: -1 }
    }).fetch();

    return {
      transactions
    };

  }

  formatDate = (date) => {
    return Moment(date).format("MMM D, YYYY")
  }

  monentize = (value, fixed) => {

    if (typeof value === "number") {
      value = `${value}`
    }

    if (!value.length) {
      return `$0.00`
    }

    value = value.replace(/[^\d.-]/g, "")

    let decimals = value.split(".")[1]
    if ((decimals && decimals.length >= 2) || fixed) {
      value = Number(value).toFixed(2)
      value = String(value)
    }

    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return `$${value}`
  }


  render () {

    return (

      <Split nav={true} >
        <Right background="//dg0ddngxdz549.cloudfront.net/images/cached/images/remote/http_s3.amazonaws.com/ns.images/newspring/_fpo/NScollege-cip-0033_1700_1133_90_c1.jpg"
 mobile={false}>
        </Right>

        <Left scroll={true} ref="container">
          <div className="constrain-copy soft-double@lap-and-up">
            <div className="soft soft-double-top@lap-and-up">
              <h2 className="flush hard">Giving History</h2>
            </div>
          </div>


          <div className="background--light-secondary">
            <div className="constrain-copy soft@lap-and-up">
              <div className="soft">
              </div>
            </div>
          </div>

          <div className="constrain-copy soft soft-double-sides@lap-and-up" ref="history">
            {() => {
              const { transactions } = this.data

              if (!transactions || !transactions.length) {
                // loading
                return (
                  <div>
                    Loading...
                  </div>
                )
              }

              return (
                <div>
                  {this.data.transactions.map((transaction, i) => {
                    if (!transaction.TransactionDetails[0].Account) {
                      return null
                    }
                    return (
                      <div key={i} className="soft-ends push-half-ends hard-sides outlined--light outlined--bottom constrain-mobile">

                        <Link to={`/give/history/${transaction.Id}`}>

                          <div className="grid" style={{verticalAlign: "middle"}}>

                            <div className="grid__item one-half" style={{verticalAlign: "middle"}}>
                              <h5 className="text-dark-tertiary flush">
                                {transaction.TransactionDetails[0].Account.PublicName}
                              </h5>
                              <p className="flush soft-half-top italic small text-dark-tertiary">
                                {this.formatDate(transaction.CreatedDateTime)}
                              </p>
                            </div>

                            <div className="grid__item one-half text-right" style={{verticalAlign: "middle"}}>
                              <div className="soft-half-right">
                                <h4 className="text-dark-tertiary flush soft-right@handheld soft-double-right@lap-and-up">
                                  {this.monentize(transaction.TransactionDetails[0].Amount)}
                                  <span className="text-primary icon-arrow-next locked" style={{
                                      right: "-5px",
                                      top: "1px"
                                    }}></span>
                                </h4>
                              </div>

                            </div>

                          </div>

                        </Link>

                      </div>

                    )
                  })}

                </div>
              )
            }()}
          </div>


        </Left>
      </Split>
    );
  }
}


const Routes = [
  {
    path: "history",
    component: Authorized,
    indexRoute: { component: Template },
    childRoutes: [
      {
        path: ":id",
        component: Details
      }
    ]
  }
]

export default {
  Template,
  Routes
}
