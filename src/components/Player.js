import React, { useState, useRef, useEffect } from 'react';
import PlayerDetails from "./PlayerDetails";
import PlayerControls from "./PlayerControls";
import Slider from "./Slider";

function Player(props) {
    const audioEl = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [percentage, setPercentage] = useState(0);

    const onChange = (e) => {
        setPercentage(e.target.value)
    };

    useEffect(() => {
        if (isPlaying) {
            audioEl.current.play();
        } else {
            audioEl.current.pause();
        }
    });

    const SkipSong = (forwards = true) => {
        if (forwards) {
            props.setCurrerentSongIndex(() => {
                let temp = props.currentSongIndex;
                temp++;

                if (temp > props.songs.length - 1) {
                    temp = 0;
                }

                return temp;
            });
        } else {
            props.setCurrentSongIndex(() => {
                let temp = props.currentSongIndex;
                temp--;

                if (temp < 0) {
                    temp = props.songs.length - 1;
                }

                return temp;
            });
        }
    }

    return (
        <div className="c-player">
            {/* <audio src={props.songs[props.currentSongIndex].src} ref={audioEl}></audio> */}
            <audio src={"https://firebasestorage.googleapis.com/v0/b/t-career-radio.appspot.com/o/Mon%20Jan%2024%202022%2017%3A13%3A23%20GMT%2B0900%20(%E6%97%A5%E6%9C%AC%E6%A8%99%E6%BA%96%E6%99%82)test.mp3?alt=media&token=c40e7cb0-2157-4248-8a2d-e7bd76726258"} ref={audioEl}></audio>
            {/* <h4>Playing now</h4> */}
            <PlayerDetails
                song={props.songs[props.currentSongIndex]}
            />
            <PlayerControls
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                SkipSong={SkipSong}
            />
            <Slider onChange={onChange} percentage={percentage} />
            <p><strong>Next up:</strong> {props.songs[props.nextSongIndex].title} by {props.songs[props.nextSongIndex].artist}</p>
        </div>
    )
}

export default Player;