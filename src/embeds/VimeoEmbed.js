import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cleanProps from 'clean-react-props';
import Player from '@vimeo/player';

class VimeoEmbed extends Component {
  constructor(props) {
    super(props);

    this.onPlayerReady = this.onPlayerReady.bind(this);
  }

  componentDidMount() {
    this.createPlayer();
  }

  componentWillReceiveProps(nextProps) {
    const {
      loop,
      play,
      time,
      volume,
    } = nextProps;

    if (this.props.play !== play) {
      if (play) {
        this.player.play();
      }
      else {
        this.player.pause();
      }
    }

    if (this.props.loop !== loop) {
      this.player.setLoop(loop);
    }

    if (this.props.time !== time) {
      this.player.setCurrentTime(time);
    }

    if (this.props.volume !== volume) {
      this.player.setVolume(volume);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    const {
      onEnded,
      onPlay,
      onTimeUpdate,
      onVolumeChange,
    } = this.props;

    this.player.off('play', onPlay);
    this.player.off('ended', onEnded);
    this.player.off('timeupdate', onTimeUpdate);
    this.player.off('volumechange', onVolumeChange);
  }

  createPlayer() {
    const {
      config,
      height,
      videoId,
      videoUrl,
      width,
      onEnded,
      onError,
      onPause,
      onPlay,
      onTimeUpdate,
      onVolumeChange,
    } = this.props;

    Object.assign(config,
      videoId ? {id: videoId} : {},
      videoUrl ? {url: videoUrl} : {},
      {height, width}
    );

    this.player = new Player(this.refPlayer, config);
    this.player.on('ended', onEnded);
    this.player.on('error', onError);
    this.player.on('pause', onPause);
    this.player.on('play', onPlay);
    this.player.on('timeupdate', onTimeUpdate);
    this.player.on('volumechange', onVolumeChange);

    this.player.ready()
      .then(this.onPlayerReady);

    return Promise.resolve(this.player);
  }

  onPlayerReady() {
    const {
      height,
      play,
      time,
      volume,
      width,
      onReady,
    } = this.props;

    const iframe = this.refPlayer.querySelector('iframe');
    iframe.width = width;
    iframe.height = height;

    this.player.setVolume(volume);

    if (play) {
      this.player.play();
      this.player.setCurrentTime(time);
    }

    onReady();
  }

  render() {
    const {
      aspectRatio,
      children,
    } = this.props;

    let playerStyle = {};

    if (aspectRatio) {
      playerStyle = {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      };
    }

    const omitProps = [
      'height',
      'loop',
      'width',
      'onEnded',
      'onError',
      'onPause',
      'onPlay',
      'onTimeUpdate',
      'onVolumeChange',
    ];

    return (
      <div {...cleanProps(this.props, omitProps)}>
        <div
          ref={(element) => {
            this.refPlayer = element;
          }}
          style={playerStyle}
        ></div>
        {children}
      </div>
    );
  }
}

VimeoEmbed.propTypes = {
  aspectRatio: PropTypes.string,
  config: PropTypes.object,
  height: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  loop: PropTypes.bool,
  play: PropTypes.bool,
  time: PropTypes.number,
  videoId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  videoUrl: PropTypes.string,
  volume: PropTypes.number,
  width: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  onEnded: PropTypes.func,
  onError: PropTypes.func,
  onPause: PropTypes.func,
  onPlay: PropTypes.func,
  onReady: PropTypes.func,
  onTimeUpdate: PropTypes.func,
  onVolumeChange: PropTypes.func,
};

VimeoEmbed.defaultProps = {
  aspectRatio: '16:9',
  config: {},
  height: '100%',
  loop: false,
  play: false,
  time: 0,
  volume: 1,
  width: '100%',
  onEnded: () => {},
  onError: () => {},
  onPause: () => {},
  onPlay: () => {},
  onReady: () => {},
  onTimeUpdate: () => {},
  onVolumeChange: () => {},
};

export default VimeoEmbed;
