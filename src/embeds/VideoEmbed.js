import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cleanProps from 'clean-react-props';

class VideoEmbed extends Component {
  constructor(props) {
    super(props);

    this.onEnded = this.onEnded.bind(this);
    this.onError = this.onError.bind(this);
    this.onLoadedMetadata = this.onLoadedMetadata.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onTimeUpdate = this.onTimeUpdate.bind(this);
    this.onVolumeChange = this.onVolumeChange.bind(this);
  }

  componentDidMount() {
    const {
      play,
      time,
      volume,
      onReady,
    } = this.props;

    this.player = this.refPlayer;
    this.player.addEventListener('ended', this.onEnded);
    this.player.addEventListener('error', this.onError);
    this.player.addEventListener('loadedmetadata', this.onLoadedMetadata);
    this.player.addEventListener('pause', this.onPause);
    this.player.addEventListener('play', this.onPlay);
    this.player.addEventListener('timeupdate', this.onTimeUpdate);
    this.player.addEventListener('volumechange', this.onVolumeChange);

    onReady();

    if (play) {
      this.player.play();
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      loop,
      play,
      time,
      src,
      volume,
    } = nextProps;

    if (this.props.src !== src) {
      this.player.setAttribute('src', src);
    }

    if (this.props.play !== play) {
      if (play) {
        this.player.play();
      }
      else {
        this.player.pause();
      }
    }

    if (this.props.loop !== loop) {
      this.player.setAttribute('loop', loop);
    }

    if (this.props.time !== time) {
      this.player.setAttribute('currentTime', time);
    }

    if (this.props.volume !== volume) {
      this.player.setAttribute('volume', volume);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this.player.removeEventListener('ended', this.onEnded);
    this.player.removeEventListener('error', this.onError);
    this.player.removeEventListener('loadedmetadata', this.onLoadedMetadata);
    this.player.removeEventListener('pause', this.onPause);
    this.player.removeEventListener('play', this.onPlay);
    this.player.removeEventListener('timeupdate', this.onTimeUpdate);
    this.player.removeEventListener('volumechange', this.onVolumeChange);
  }

  getCurrentStatus() {
    return {
      duration: !isNaN(this.player.duration) ? this.player.duration : 0,
      percent: !isNaN(this.player.duration)
        ? ((!isNaN(this.player.currentTime) ? this.player.currentTime : 0) / this.player.duration)
        : 0,
      seconds: !isNaN(this.player.currentTime) ? this.player.currentTime : 0,
    }
  }

  onEnded(evt) {
    const {
      onEnded,
    } = this.props;

    onEnded(this.getCurrentStatus());
  }

  onError(evt) {
    const {
      onError,
    } = this.props;

    onError(this.player.error);
  }

  onLoadedMetadata() {
    const {
      time,
      volume,
    } = this.props;

    this.player.currentTime = time;
    this.player.volume = volume;
  }

  onPause(evt) {
    const {
      onPause,
    } = this.props;

    onPause();
  }

  onPlay(evt) {
    const {
      onPlay,
    } = this.props;

    onPlay(this.getCurrentStatus());
  }

  onTimeUpdate(evt) {
    const {
      onTimeUpdate,
    } = this.props;

    onTimeUpdate(this.getCurrentStatus());
  }

  onVolumeChange(evt) {
    const {
      onVolumeChange,
    } = this.props;

    onVolumeChange({
      volume: evt.target.volume,
    });
  }

  render() {
    const {
      aspectRatio,
      children,
      config,
      loop,
      src,
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
      'src',
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
        <video
          {...config}
          height="100%"
          loop={loop}
          ref={(element) => {
            this.refPlayer = element;
          }}
          src={src}
          style={playerStyle}
          width="100%"
        ></video>
        {children}
      </div>
    );
  }
}

VideoEmbed.propTypes = {
  aspectRatio: PropTypes.string,
  config: PropTypes.object,
  height: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  loop: PropTypes.bool,
  play: PropTypes.bool,
  src: PropTypes.string,
  time: PropTypes.number,
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
};

VideoEmbed.defaultProps = {
  aspectRatio: '16:9',
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
};

export default VideoEmbed;
