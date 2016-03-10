import { Component, PropTypes} from "react"
import { connect } from "react-redux"

import { GraphQL } from "../../../../core/graphql"
import { nav as navActions, modal as modalActions } from "../../../../core/store"
import { transactions as transactionActions, give as giveActions } from "../../../store"
import Confirm from "./Confirm"
import Layout from "./Layout"

function getTransaction(id, dispatch){
  let mongoId = Meteor.userId()
  let query = `
  {
    transaction: scheduledFinanicalTransaction(id: ${id},  mongoId: "${mongoId}") {
      numberOfPayments
      next
      end
      id
      reminderDate
      gateway
      start
      date
      details {
        amount
        account {
          name
          description
        }
      }
      payment {
        paymentType
        accountNumber
        id
      }
      schedule {
        value
        description
      }
    }
  }
  `

  return GraphQL.query(query)
    .then(({transaction}) => {
      const obj = {
        [transaction.id]: transaction
      }
      dispatch(transactionActions.addSchedule(obj))
    })
}


const map = (state) => ({
  person: state.onBoard.person,
  transactions: state.transactions.scheduledTransactions

})

@connect(map)
export default class Details extends Component {

  state = {
    isActive: true,
    removed: null
  }

  static fetchData(getStore, dispatch, props) {
    const { id } = props.params
    return getTransaction(id, dispatch)
  }

  componentWillMount() {
    this.props.dispatch(navActions.setLevel("BASIC_CONTENT"))
  }

  componentDidMount(){
    const { id } = this.props.params
    const { dispatch } = this.props
    getTransaction(id, dispatch)
  }

  componentWillUnmount() {
    this.props.dispatch(navActions.setLevel("TOP"))
    if (this.state.removed) {
      // WUT, need to clean up after launch
      this.props.dispatch(giveActions.deleteSchedule(this.state.removed))
      this.props.dispatch(transactionActions.removeSchedule(this.state.removed))
    }
  }


  stop = (e) => {
    e.preventDefault()

    this.props.dispatch(modalActions.render(Confirm, {
      onFinished: () => {
        const { id, gateway } = this.props.transactions[Number(this.props.params.id)]

        this.setState({isActive: false, removed: id})
        Meteor.call("give/schedule/cancel", {id, gateway}, (err, response) => {
          // console.log(err, response)
        })
      }
    }))

  }

  render () {
    const id = Number(this.props.params.id)
    let transaction = this.props.transactions[id]
    let complete = false

    if (new Date(transaction.next) < new Date() && transaction.schedule.value === "One-Time") {
      complete = true
    }

    return (
      <Layout
        stop={this.stop}
        schedule={transaction}
        state={this.state}
        person={this.props.person}
        active={this.state.isActive}
        complete={complete}
      />
    )
  }
}
