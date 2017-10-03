import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cleanProps from 'clean-react-props';
import Player from 'youtube-player';

export const PlayerStates = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  VIDEO_CUED: 5,
};

class YouTubeEmbed extends Component {
  constructor(props) {
    super(props);

    this.onPlayerError = this.onPlayerError.bind(this);
    this.onPlayerReady = this.onPlayerReady.bind(this);
    this.onPlayerStateChange = this.onPlayerStateChange.bind(this);

    this.playbackInterval = null;
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
        this.player.playVideo();
      }
      else {
        this.player.pauseVideo();
      }
    }

    if (this.props.loop !== loop) {
      this.player.setLoop(loop);
    }

    if (this.props.time !== time) {
      this.player.seekTo(time);
    }

    if (this.props.volume !== volume) {
      this.player.setVolume(volume * 100);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    if (this.errorListener) {
      this.player.off(this.errorListener);
    }

    if (this.readyListener) {
      this.player.off(this.readyListener);
    }

    if (this.stateChangeListener) {
      this.player.off(this.stateChangeListener);
    }
  }

  createPlayer() {
    const promise = new Promise((resolve, reject) => {
      try {
        const {
          config,
          width,
          height,
          loop,
          play,
          playlist,
          time,
          videoId,
          volume,
          onReady,
        } = this.props;

        Object.assign(config, {
          autoplay: play ? 1 : 0,
          loop: loop ? 1 : 0,
          playlist,
        });

        this.player = Player(this.refPlayer, {
          playerVars: config,
          height,
          videoId,
          width,
        });
        this.errorListener = this.player.on('error', this.onPlayerError);
        this.readyListener = this.player.on('ready', this.onPlayerReady);
        this.stateChangeListener = this.player.on('stateChange', this.onPlayerStateChange);

        resolve(this.player);
      }
      catch (err) {
        reject(err);
      }
    });

    return promise;
  }

  onPlayerError(evt) {
    const {
      onError,
    } = this.props;

    switch (evt.data) {
      case 2:
        return onError({
          code: evt.data,
          message: 'Invalid parameter',
        });

      case 5:
        return onError({
          code: evt.data,
          message: 'HTML 5 error',
        });

      case 100:
        return onError({
          code: evt.data,
          message: 'Video not found',
        });

      case 101:
        return onError({
          code: evt.data,
          message: 'Video cannot be played in embedded players',
        });

      // 🖕
      case 150:
        return onError({
          code: evt.data,
          message: 'This error is the same as 101. It’s just a 101 error in disguise!',
        });

      default:

    }
  }

  onPlayerReady() {
    const {
      play,
      time,
      volume,
      onReady,
    } = this.props;

    this.player.setVolume(volume * 100);

    if (play) {
      this.player.playVideo();
      this.player.seekTo(time);
    }

    onReady();
  }

  onPlayerStateChange(evt) {
    const {
      onEnded,
      onPause,
      onPlay,
      onTimeUpdate,
    } = this.props;

    const duration = this.player.getDuration();
    const seconds = this.player.getCurrentTime();
    const percent = duration === 0 ? 0 : (seconds / duration);

    switch (evt.data) {
      case PlayerStates.UNSTARTED:
        break;

      case PlayerStates.ENDED:
        clearInterval(this.playbackInterval);

        onEnded({
          duration,
          percent,
          seconds,
        });
        break;

      case PlayerStates.PLAYING:
        onPlay({
          duration,
          percent,
          seconds,
        });

        this.playbackInterval = setInterval(() => {
          const intDuration = this.player.getDuration();
          const intSeconds = this.player.getCurrentTime();
          onTimeUpdate({
            duration: intDuration,
            percent: intDuration === 0 ? 0 : (intSeconds / intDuration),
            seconds: intSeconds,
          });
        }, 250);
        break;

      case PlayerStates.PAUSED:
        clearInterval(this.playbackInterval);

        onPause({
          duration,
          percent,
          seconds,
        });
        break;

      case PlayerStates.BUFFERING:
        break;

      case PlayerStates.VIDEO_CUED:
        break;

      default:
        break;
    }
  }

  render() {
    const {
      children,
      aspectRatio,
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

YouTubeEmbed.propTypes = {
  aspectRatio: PropTypes.string,
  height: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  loop: PropTypes.bool,
  play: PropTypes.bool,
  time: PropTypes.number,
  videoId: PropTypes.string,
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

YouTubeEmbed.defaultProps = {
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

export default YouTubeEmbed;
