let countdownActive = setInterval(() => {
    let countDownDate = new Date(dateEl).getTime();
    const now = new Date().getTime();
    const distance = countDownDate - now;
    console.log("distance", distance);

    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);
    console.log(days, hours, minutes, seconds);

    // if the countdown has ended, show complete
    if (distance < 0) {
      clearInterval(countdownActive);
    } else {
      // show the countdown in progress

      res.status(200);

      res.render("index", {
        date: dateEl,
        daysResult: days,
        hoursResult: hours,
        minutesResult: minutes,
        secondsResult: seconds,
      });

    }
  }, second);