import React, {Component} from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash.omit';
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
    this.player.off(this.onPlayerReady);
    this.player.off(this.onPlayerStateChange);
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
        this.player.on('ready', this.onPlayerReady);
        this.player.on('stateChange', this.onPlayerStateChange);

        resolve(this.player);
      }
      catch (err) {
        reject(err);
      }
    });

    return promise;
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

    const cleanProps = omit(this.props, [
      'aspectRatio',
      'config',
      'height',
      'loop',
      'play',
      'playlist',
      'seekTo',
      'time',
      'videoId',
      'volume',
      'width',
      'onEnded',
      'onError',
      'onPause',
      'onPlay',
      'onReady',
      'onTimeUpdate',
      'onVolumeChange',
    ]);

    return (
      <div {...cleanProps}>
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
