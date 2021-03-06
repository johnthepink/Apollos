import { Component, PropTypes } from "react"
import ReactMixin from "react-mixin"
import { Likeable, Shareable } from "/imports/mixins"
import { connect } from "react-apollo";
import gql from "graphql-tag";

import Loading from "apollos-core/dist/core/components/loading"
import { nav as navActions } from "apollos-core/dist/core/store"
import { actions as audioActions } from "/imports/store/audio"
import { Headerable } from "apollos-core/dist/core/mixins"
import headerActions from "apollos-core/dist/core/store/header"

import Helpers from "/imports/helpers"

import SingleVideoPlayer from "/imports/components/players/video/Player";
import SeriesVideoList from "./series.VideoList"

const mapQueriesToProps = ({ ownProps, state }) => ({
  currentSermon: {
    query: gql`
      query getSermon($sermonId: ID!) {
        content: node(id: $sermonId) {
          ... on Content {
            entryId: id
            title
            status
            channelName
            meta {
              urlTitle
              siteId
              date
              actualDate
              channelId
            }
            content {
              audio {
                duration
                file: s3
              }
              description
              speaker
              ooyalaId
            }
          }
        }
      }
    `,
    variables: { sermonId: ownProps.params.sermonId },
    forceFetch: false,
    returnPartialData: false,
  },
  series: {
    query: gql`
      query getSeriesSingle($id: ID!) {
        content: node(id: $id) {
          id
          ... on Content {
            entryId: id
            title
            status
            channelName
            meta {
              urlTitle
              siteId
              date
              channelId
            }
            content {
              description
              images(sizes: ["large", "medium", "small"]) {
                fileName
                fileType
                fileLabel
                url
                size
              }
              ooyalaId
              colors {
                id
                value
                description
              }
              isLight
            }
          }
        }
      }
    `,
    variables: { id: ownProps.params.id },
    forceFetch: false,
    returnPartialData: false,
  },
});

const mapStateToProps = (state) => ({ live: state.live });

@connect({ mapQueriesToProps, mapStateToProps })
@ReactMixin.decorate(Likeable)
@ReactMixin.decorate(Shareable)
@ReactMixin.decorate(Headerable)
export default class SeriesSingleVideo extends Component {

  componentWillMount() {
    if (process.env.WEB) return;

    // needed for client cache
    this.handleHeader(this.props);

    this.props.dispatch(navActions.setLevel("CONTENT"))
    this.props.dispatch(navActions.setAction("CONTENT", {
      id: 2,
      action: this.likeableAction
    }));
  }

  componentWillUpdate(nextProps){
    this.handleHeader(nextProps);
  }

  handleHeader = (nextProps) => {
    const { content } = nextProps.series;
    if(!content) return;

    const color = Helpers.collections.color(content);

    const { live } = this.props.live;

    const options = {
      title: "Series",
      color: color,
    };

    if (!live) options.subTitle = content.title;

    this.props.dispatch(headerActions.set(options));
  }

  playAudio = (e) => {
    e.preventDefault();
    const currentSermon = this.props.currentSermon.content;
    const series = this.props.series.content;
    this.props.dispatch(audioActions.setPlaying({
      track: {
        ...currentSermon.content.audio[0],
        title: currentSermon.title,
        artist: Helpers.content.speakers(currentSermon),
      },
      album: series,
    }));
  }

  render() {

    const sermonContent = this.props.currentSermon.content;
    const seriesContent = this.props.series.content;

    if (!(sermonContent && seriesContent)) {
      // loading
      return (
        <div className="locked-ends locked-sides floating">
          <div className="floating__item">
            <Loading/>
          </div>
        </div>
      )
    }

    const currentSermon = sermonContent;
    const series = seriesContent;

    return (
      <div className="background--light-primary">
        <SingleVideoPlayer ooyalaId={currentSermon.content.ooyalaId} />
        <div
          className="soft-sides background--light-secondary text-dark-secondary"
          style={{ paddingTop: "15px", paddingBottom: "15px" }}
          onClick={this.playAudio}
        >
          <h7 style={{ verticalAlign: "middle" }}>Listen To Audio</h7>
          <i
            className="icon-category-audio float-right"
            style={{ marginTop: "-2px" }}
          />
        </div>
        <div className="soft soft-double@palm-wide-and-up push-top">
          <h2 className="push-half-bottom">{currentSermon.title}</h2>
          <h4>{Helpers.content.speakers(currentSermon)}</h4>
          <h6 className="text-dark-tertiary">{Helpers.time.date(currentSermon)}</h6>
          <div dangerouslySetInnerHTML={Helpers.react.markup(currentSermon, "description")}></div>
        </div>
        <SeriesVideoList id={this.props.params.id} />
      </div>
    );
  }
}
