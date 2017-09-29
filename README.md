# react-video-players

A library of React video player components that share a similar interface and makes
it easy to work with various video platforms (Vimeo, YouTube, etc.) and players,
consistently in your site or application.

## Install

Via [npm](https://npmjs.com/package/react-video-players):

```sh
npm install --save react-video-players
```

Via [Yarn](https://yarn.fyi/react-video-players):

```sh
yarn add react-video-players
```

## Video Players

The goal of this library is to offer a variety of different player "types", while
maintaining a similar/common interface across each component. Currently, there
are three video player components available: `VimeoPlayer`, `YouTubePlayer` and
`VideoPlayer` (standard `<video>` tag implemenation).

In addition to the three components, this library also include the High Order Component
that the three players use, in the event you’d like to use that to build your own
video player component.

### Common Properties

* `aspectRatio:String` - Used to calculate aspect ratio for the container so that
video is displayed responsively.
* `config:Object` - Optional config settings. See [VimeoPlayer Props](#props) or [YouTubePlayer Props](#props-1)
* `controls:Element` - A React component that contains controls setup to control
the video. See [Player Controls](#player-controls)
* `height:Number || String` - Height of the player. Default `100%`.
* `loop:Boolean` - Whether or not the video should loop playback. Default `false`.
* `play:Boolean` - Whether or not the video should play on load. Default `false`.
* `time:Number` - Time to play when the player loads, or seek time if the player is already loaded. Default `0`.
* `width:Number || String` - Width of the player. Default `100%`.

### Callbacks

* `onEnded:Function` - Callback when video playback has ended.
* `onError:Function` - Callback when an error occurs within the player.
* `onPause:Function` - Callback when video player is paused.
* `onPlay:Function` - Callback when video player is played.
* `onReady:Function` - Callback when video player is ready.
* `onTimeUpdate:Function` - Callback when video player time updates.

### Player Components

#### `VimeoPlayer`

The `VimeoPlayer` component is a simple React wrapper around the standard Vimeo
Player embed. For more informatin on how to work with the Vimeo Player directly,
check out this repo, [@vimeo/player.js](https://github.com/vimeo/player.js), for
more info and examples.

The `VimeoPlayer` component offers limited control of the player via the `props`
on the component: `loop`, `play`, `time` and `volume`. I’m open to adding more
access to some of the other methods available on the player via props, but to
keep it simple I’ve started with these four.

##### Props

* `config:Object` - Options that are passed to the player on setup,
Available [embedOptions](https://github.com/vimeo/player.js#embed-options).
* `videoId:Number` - ID of the Vimeo video you'd like to load in the player.

##### Example

```js
import {VimeoPlayer} from 'react-video-players';

...

  render() {
    return (
      <div>
        <VimeoPlayer videoId="225408543" />
      </div>
    );
  }

...

```

#### `YouTubePlayer`

Similar to the `VimeoPlayer` component, the `YouTubePlayer` component is a simple
React wrapper around the YouTube Player, allowing for basic control and configuration,
allowing you to use it how you want within your React sites/applications.

##### Props

* `config:Object` - The `config` object is mapped to the `playerVars` property
used when creating the player. Available [playerVars](https://developers.google.com/youtube/player_parameters?playerVersion=HTML5#Parameters).
* `playlist:String` - An optional value that can be set when you would like to
load a playlist into the player. This property is also set to the `videoId` when
the `loop` flag has been set on the player (which is required for the YouTube Player
to loop the video).
* `videoId:String` - String to the YouTube video ID you would like to load in the player.

##### Example

```js
import {YouTubePlayer} from 'react-video-players';

...

  render() {
    return (
      <div>
        <YouTubePlayer videoId="8gXpZmQ7j70" />
      </div>
    );
  }

...

```

#### `VideoPlayer`

Just your plain ole’ `<video>` tag, wrapped in a similar interface to the other
platform specific players. You could use this as is if you have direct access
to video urls, or use it as a base for a more complex video player that you’re
building in React.

##### Props

* `config:Object` - An object containing the additional attributes that are available
for the `<video>` tag, but are not exposed via other props. (Ex. `controls`, `poster`, `preload`, etc.)
* `src:String` - URL to video content.

##### Example

```js
import {VideoPlayer} from 'react-video-players';

...

  render() {
    return (
      <div>
        <VideoPlayer src="[...your video source url...]" />
      </div>
    );
  }

...

```

### `playerController` (Higher Order Component)

Want to build your own embeddable player using a different providers player? No problem 😎

Included in this library is the a High Order Component that wraps all the players
in this library, `playerController`. The `playerController` is responsible for
wiring up the `controls`, along with handling some basic style and callback handling
within video component instances so that we’re not repeating ourselves too much.

Feel free to use the `playerController` to write your own React video players that
wrap embeddable players from other video providers. Also, if you end up writing
a really awesome component for another provider, and you’d like to add it to this
repo, just make a PR with your additions and I’ll check’em out and merge them in
as soon as I can.

#### Example

```js
import React, {Component} from 'react';
import {playerController} from 'react-video-players';

class YourRadVideoPlayer extends Component {

...

}
...

export default playerController(YourRadVideoPlayer);

```

## Player Controls

The `controls` property on the video player components makes it easy to compose
controls in context with the video player and provide a simple way to keep controls
in sync with the video state, while also providing callbacks that can be used
to control video playback.

### Properties

* `loop:Boolean` - Loop status of video
* `play:Boolean` - Playing status of video
* `time:Number` - Current time of video
* `volume:Number` - Current volume of video

### Callback

* `onPause:Function` - Callback to pause video
* `onPlay:Function` - Callback to play video
* `onSeek:Function` - Callback to seek video
* `onVolumeChange:Function` - Callback to change the volume of video

## License

[MIT](LICENSE) © [Ryan Hefner](https://www.ryanhefner.com)
