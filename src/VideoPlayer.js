import React, { Component } from 'react';
import PropTypes from 'prop-types';
import playerController from './playerController';
import VideoEmbed from './embeds/VideoEmbed';

class VideoPlayer extends Component {
  render() {
    const {
      aspectRatio,
    } = this.props;

    let style = {};

    if (aspectRatio) {
      const [width, height] = aspectRatio.split(':');
      style = {
        position: 'relative',
        height: 0,
        paddingBottom: `${height / width * 100}%`,
      };
    }

    return (
      <VideoEmbed {...this.props} style={style} />
    );
  }
}

VideoPlayer.propTypes = {
  aspectRatio: PropTypes.string,
  config: PropTypes.object,
  loop: PropTypes.bool,
  play: PropTypes.bool,
  time: PropTypes.number,
  volume: PropTypes.number,
  onEnded: PropTypes.func,
  onError: PropTypes.func,
  onPause: PropTypes.func,
  onPlay: PropTypes.func,
  onReady: PropTypes.func,
  onTimeUpdate: PropTypes.func,
  onVolumeChange: PropTypes.func,
};

VideoPlayer.defaultProps = {
  aspectRatio: '16:9',
  config: {},
  loop: false,
  play: false,
  time: 0,
  volume: 1,
  onEnded: () => {},
  onError: () => {},
  onPause: () => {},
  onPlay: () => {},
  onReady: () => {},
  onTimeUpdate: () => {},
  onVolumeChange: () => {},
};

export default playerController(VideoPlayer);
