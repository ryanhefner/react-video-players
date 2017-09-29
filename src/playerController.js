import React, { Component } from 'react';
import PropTypes from 'prop-types';
import omit from 'lomit';

const playerController = (PlayerComponent) => {
  return class extends Component {
    constructor(props) {
      super(props);

      this.onControlsPlay = this.onControlsPlay.bind(this);
      this.onControlsPause = this.onControlsPause.bind(this);
      this.onControlsSeek = this.onControlsSeek.bind(this);
      this.onControlsVolumeChange = this.onControlsVolumeChange.bind(this);

      this.onPlayerTimeUpdate = this.onPlayerTimeUpdate.bind(this);
      this.onPlayerVolumeChange = this.onPlayerVolumeChange.bind(this);

      this.state = {
        loop: props.loop,
        play: props.play,
        seekTo: props.time,
        time: props.time,
        volume: props.volume,
      };
    }

    componentWillReceiveProps(nextProps) {
      const {
        loop,
        play,
        time,
        volume,
      } = nextProps;

      this.setState({
        seekTo: time,
        loop,
        play,
        volume,
      });
    }

    shouldComponentUpdate(nextProps, nextState) {
      /**
       * @todo See if there could be any optimization introduced here. - Ryan
       */
      return true;
    }

    onControlsPlay() {
      this.setState({
        play: true,
      });
    }

    onControlsPause() {
      this.setState({
        play: false,
      });
    }

    onControlsSeek(time) {
      this.setState({
        time,
      });
    }

    onControlsVolumeChange(volume) {
      this.setState({
        volume,
      });
    }

    onPlayerTimeUpdate(time) {
      this.setState({
        time,
      });

      if (this.props.onTimeUpdate) {
        this.props.onTimeUpdate(time);
      }
    }

    onPlayerVolumeChange(volume) {
      this.setState({
        volume,
      });

      if (this.props.onVolumeChange) {
        this.props.onVolumeChange(volume);
      }
    }

    render() {
      const {
        children,
        controls,
      } = this.props;

      const {
        loop,
        play,
        time,
        seekTo,
        volume,
      } = this.state;

      const clonedControls = controls
        ? React.cloneElement(controls, {
            loop,
            play,
            time,
            volume,
            onPause: this.onControlsPause,
            onPlay: this.onControlsPlay,
            onSeek: this.onControlsSeek,
            onVolumeChange: this.onControlsVolumeChange,
          })
        : null;

      const cleanProps = omit(this.props, [
        'controls',
        'loop',
        'play',
        'time',
        'volume',
        'onTimeUpdate',
        'onVolumeChange',
      ]);

      const cleanState = omit(this.state, [
        'time',
      ]);

      return (
        <PlayerComponent
          {...cleanProps}
          {...cleanState}
          time={seekTo}
          onTimeUpdate={this.onPlayerTimeUpdate}
          onVolumeChange={this.onPlayerTimeUpdate}
        >
          {clonedControls}
          {children}
        </PlayerComponent>
      );
    }
  }
};

export default playerController;
