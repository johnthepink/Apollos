import { PropTypes } from "react"
import { css } from "aphrodite";

import { Forms } from "../../../../core/components"
import Styles from "../../AddSchedule/styles-css"

const Layout = ({ classes, accounts, state, preFill, showInputs, format, selectVal, inputVal }) => (
  <div>
    <div
      className={`display-inline-block push-half-bottom h3 push-half-right ${classes}`}>
      and give to
    </div>

    <Forms.Select
      items={accounts}
      name="select-account"
      id={`${state.id}_select`}
      hideLabel={true}
      classes={["soft-bottom", "display-inline-block", `${css(Styles.select)}`]}
      inputClasses={`${classes} outlined--dotted outlined--light h3 hard-top flush-bottom`}
      placeholder="select fund"
      onChange={showInputs}
      includeBlank={true}
      deselect={true}
      selected={selectVal}
    />

    {(() => {
      if (state.fund) {
        return (
          <div className="display-block">
            <h3 className={`${classes} push-half-bottom push-half-right display-inline-block`}>
              with
            </h3>
            <Forms.Input
              id={state.id}
              name={state.fund || "secondary-account"}
              hideLabel={true}
              type="tel"
              classes={["soft-bottom", "input--active", "display-inline-block"]}
              inputClasses={`outlined--dotted outlined--light h3 hard-top flush-bottom text-dark-primary ${css(Styles["show-placeholder"])}`}
              placeholder="$0.00"
              format={format}
              defaultValue={preFill(state.id)}
              style={{maxWidth: "150px"}}
              value={inputVal}
            />
          </div>
        )
      }
    })()}


  </div>
)


export default Layout
