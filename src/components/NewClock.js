import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TimeContainer = styled.div`
  position: fixed;
  bottom: 0px;
  left: 30px;
  z-index:2;
`
const Time = styled.h2`
  font-size: 2rem;
  color: #000;
`
function NewClock() {
    let savedTime = [0, 0, 0]
    if (sessionStorage['time']) savedTime = JSON.parse(sessionStorage['time'])
    const [seconds, setSeconds] = useState(savedTime[0] + 2);
    const [minutes, setMinutes] = useState(savedTime[1]);
    const [hours, setHours] = useState(savedTime[2]);

    useEffect(() => {
        const time = setTimeout(() => {
            if (seconds === 59) {
                let tempMinutes = minutes + 1;
                setSeconds(0);
                setMinutes(tempMinutes);
            } else {
                let tempSeconds = seconds + 1;
                setSeconds(tempSeconds);
            }
            if (minutes === 59) {
                let tempHours = hours + 1;
                setMinutes(0);
                setHours(tempHours);
            }
        }, 1000);
        window.onbeforeunload = () => {
            sessionStorage['time'] = JSON.stringify([seconds, minutes, hours]);
        }
        return () => clearTimeout(time);
    });

    return (
        <TimeContainer>
            <Time>
                {hours < 10 ? `0${hours}` : hours}:
            {minutes < 10 ? `0${minutes}` : minutes}:
            {seconds < 10 ? `0${seconds}` : seconds}
            </Time>
        </TimeContainer>
    );
};

export default NewClock;