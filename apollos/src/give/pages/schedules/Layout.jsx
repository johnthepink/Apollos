
import { Component, PropTypes} from "react"
import ReactDOM from "react-dom"
import Moment from "moment"
import { Link } from "react-router"

import { Spinner } from "../../../core/components/loading"
import { Error as ErrIcon } from "../../../core/components/icons"
import Meta from "../../../core/components/meta"
import AddSchedule from "../../blocks/AddSchedule"
import Split, { Left, Right } from "../../../core/blocks/split"

import Confirm from "../../blocks/ActionButtons"
import { AccountType } from "../../components"


export default class Layout extends Component {

  state = {
    expandedSchedule: null
  }

  expandSchedule = (e) => {
    e.preventDefault()

    const { dataset } = e.currentTarget
    const { id } = dataset

    if (this.state.expandedSchedule === Number(id)) {
      this.collapseSchedule()
      return
    }

    this.setState({
      expandedSchedule: Number(id)
    })
  }

  collapseSchedule = () => {
    this.setState({
      expandedSchedule: null
    })
  }

  formatDate = (date) => {
    return Moment(new Date(date)).format("MMM D, YYYY")
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

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render () {

    const {
      schedules,
      accounts,
      schedulesReady,
      accountsReady,
      recoverableSchedules,
      cancelSchedule,
      confirm,
      person
    } = this.props

    let hasCompletedSchedules = false;
    let photo = "//s3.amazonaws.com/ns.assets/apollos/give_now-schedules1x2.jpg"
    return (
        <div>
          <Split nav={true} classes={["background--light-primary"]}>

            <Meta title="Schedule Your Giving" image={photo} />

            <Right
              background={photo}
              mobile={false}>
            </Right>


          </Split>
          <Left scroll={true} classes={["background--light-secondary"]} ref="container">


              {(() => {
                if (recoverableSchedules.length) {
                  return (
                    <div className="background--primary soft-half soft-sides@portable soft-double-sides@anchored">

                      <div className="soft-ends soft-double-ends@lap-and-up soft-side@lap-and-up">
                        <h4 className="text-light-primary soft-half-sides soft-half-bottom">Hey { person.nickName || person.firstName }!</h4>
                        <h5 className="text-light-primary soft-half-sides soft-bottom">
                           We have found giving schedules from our previous system that need to be transferred! To transfer a schedule, click below.
                        </h5>

                        <Link to="/give/schedules/transfer" className="btn--light">Transfer Schedules</Link>
                      </div>

                    </div>

                  )
                }
              })()}

            <div className="soft-double-sides@lap-and-up soft-double-ends@lap-and-up soft background--light-primary">
              <div className="text-left soft-double-top@palm-wide-and-up hard-left@lap-and-up soft-half-bottom soft@anchored">
                <h2 className="flush soft-bottom@portable text-dark-primary soft-top@handheld soft-double-top">Schedule Your Giving</h2>
                <div className="soft-double-ends@anchored">
                  {(() => {
                    if (!accountsReady || !accounts || !accounts.length) {
                      return (
                        <div className="text-center soft">
                          <Spinner styles={{width: "40px", height: "40px"}}/>
                        </div>
                      )
                    }
                    return <AddSchedule accounts={accounts}/>
                  })()}

                </div>
              </div>
            </div>


            <div  id="active-schedules" className="soft-half soft-sides@portable soft-double-sides@anchored soft-double-bottom@anchored soft-bottom@portable">
              <h4 className="soft soft-double-ends text-center flush-bottom">
                My Active Schedules
              </h4>


              {(() => {


                if (!Meteor.user()) {
                  return (
                    <div className="text-center soft-sides">
                      <p><em>Please sign in or create an account to setup or view your scheduled contributions!</em></p>
                    </div>
                  )
                }

                if ((schedules && !schedules.length) && !schedulesReady) {
                  // loading
                  return (
                    <div className="text-center soft">
                      <Spinner styles={{width: "40px", height: "40px"}}/>
                    </div>
                  )
                }

                if ((schedules && !schedules.length) && schedulesReady) {
                  return (
                    <div className="text-center soft-sides">
                      <p><em>You don't have any active scheduled contributions. If you created a new schedule, it may take a few minutes to be reflected here</em></p>
                    </div>
                  )

                }

                return (
                  <div>
                    {schedules && schedules.map((schedule, i) => {

                      if (!schedule.details || !schedule.details[0].account) {
                        return null
                      }

                      let complete = false
                      if (new Date(schedule.next) < Moment().add(1, "day") && schedule.schedule.value === "One-Time") {
                        hasCompletedSchedules = true;
                        return null;
                      }

                      return (
                        <div key={i} className="soft card">

                          <Link to={`/give/schedules/${schedule.id}`}>

                            <div className="grid" style={{verticalAlign: "middle"}} key={i}>

                              <div className="grid__item one-half" style={{verticalAlign: "middle"}}>
                                <h6 className="text-dark-tertiary push-half-bottom">
                                  {this.capitalizeFirstLetter(schedule.schedule.description.toLowerCase())}
                                  <span className="text-dark-secondary">{complete ? " - Complete" : ""}</span>
                                </h6>
                                <h5 className="flush one-whole" style={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}>
                                  {schedule.details[0].account.name}
                                </h5>
                                <p className="flush soft-half-top text-dark-tertiary">
                                  <small>
                                    <em>
                                      {this.formatDate(schedule.start)}
                                    </em>
                                  </small>
                                </p>

                              </div>


                              <div className="grid__item one-half text-right" style={{verticalAlign: "middle"}}>
                                <div className="soft-half-right">
                                  <h4 className="text-dark-tertiary one-whole flush soft-right@handheld soft-double-right@lap-and-up" style={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}>
                                    {this.monentize(schedule.details[0].amount)}
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
                    <p className="soft text-center">
                      <small>
                        <em>
                          Changes to schedules may take a few minutes to be reflected here.
                        </em>
                      </small>
                    </p>
                  </div>
                )
              })()}

              {(() => {
                if (hasCompletedSchedules) {
                  return (
                    <div>
                      <hr className="flush hard"/>
                      <h4 className="soft soft-double-ends text-center flush-bottom">
                        My Completed Schedules
                      </h4>

                      {schedules && schedules.map((schedule, i) => {

                        if (!schedule.details || !schedule.details[0].account) {
                          return null
                        }

                        let complete = false
                        if (new Date(schedule.next) < Moment().add(1, "day") && schedule.schedule.value === "One-Time") {
                          complete = true
                        }

                        if (!complete) {
                          return null;
                        }

                        return (
                          <div key={i} className="soft card">

                            <Link to={`/give/schedules/${schedule.id}`}>

                              <div className="grid" style={{verticalAlign: "middle"}} key={i}>

                                <div className="grid__item one-half" style={{verticalAlign: "middle"}}>
                                  <h6 className="text-dark-tertiary push-half-bottom">
                                    {this.capitalizeFirstLetter(schedule.schedule.description.toLowerCase())}
                                    <span className="text-dark-secondary">{complete ? " - Complete" : ""}</span>
                                  </h6>
                                  <h5 className="flush one-whole" style={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}>
                                    {schedule.details[0].account.name}
                                  </h5>
                                  <p className="flush soft-half-top text-dark-tertiary">
                                    <small>
                                      <em>
                                        {this.formatDate(schedule.start)}
                                      </em>
                                    </small>
                                  </p>

                                </div>


                                <div className="grid__item one-half text-right" style={{verticalAlign: "middle"}}>
                                  <div className="soft-half-right">
                                    <h4 className="text-dark-tertiary one-whole flush soft-right@handheld soft-double-right@lap-and-up" style={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}>
                                      {this.monentize(schedule.details[0].amount)}
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
                }

              })()}
            </div>

          </Left>
        </div>
    );
  }
}
