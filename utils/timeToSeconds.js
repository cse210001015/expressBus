function timeStringToSeconds(timeString) {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
  
    // Calculate the total number of seconds
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  
    return totalSeconds;
}

export {timeStringToSeconds};