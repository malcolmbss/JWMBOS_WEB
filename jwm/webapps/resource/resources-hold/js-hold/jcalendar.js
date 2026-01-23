/** INIT cal **/
const initiateJCal = (role, regionId, subscriberId, ownerType, tagUid) => {
  // regionId = regionId || 7;
  // subscriberId = subscriberId || 159;
  var listenersCreated = false;

  var Calendar = tui.Calendar;

  const calendarContainer = document.getElementById(tagUid);

  var cal = new Calendar(calendarContainer, {
    title: "Driver Fair Sign Up",
    defaultView: "week",
    taskView: false,
    isReadOnly: true,
    disableClick: true,
    disableDblClick: true,
    useCreationPopup: false,
    useDetailPopup: false,
    template: {
      time: function (schedule) {
         var availHtml = `
                <div title='${schedule.location}' style='line-height:12px; font-weight:normal; white-space:nowrap; margin-bottom:6px; '>
                   ${schedule.location}
             `;
           if (cal.getViewName() === "month") {
              availHtml += `
                   <br>${moment(schedule.start.getTime()).format( "ha" )} *Available*
                </div>
             `;
           }
           else {
              availHtml += `
                   <br>*Available*
                </div>
             `;
           }
          var fullHtml = `
                <div style='font-weight:normal; margin-top: 6px; margin-bottom:4px'>
                   *Full*
                </div>
             `;

          if (schedule.raw.rsvpCount === schedule.raw.maxCount) return fullHtml;
          else return availHtml;
      },
    },
  });

  cal.setOptions({week: { hourStart :  8 }}, true);
  cal.setOptions({week: { hourEnd   : 21 }}, true);

  renderDateRange(cal);
  if (role === false) {
    // Calendar operations for non operator role
    cal.on({
      clickSchedule: function (e) {
        if (cal.getViewName() === "month") {
          cal.changeView("week", true);
        }

        var schedule = e.schedule;
        var target = e.event.target;
        //check if schedule has available slots
        getSchedule(schedule, cal, target, role, subscriberId, regionId);
      },
      clickDayname: function (e) {
        var dayClick = new Date(e.date);
        dayClick.setDate(dayClick.getDate() + 1);

        if (cal.getViewName() === "week") {
          cal.setDate(dayClick);
          cal.changeView("day", true);
        }
      },
    });
  } else {
    // Calendar operations for Operator roles
    cal.on({
      clickSchedule: function (e) {
        if (cal.getViewName() == "month") {
          cal.changeView("week", true);
        }
        var schedule = e.schedule;
        var target = e.event.target;

        getSchedule(schedule, cal, target, role, regionId);
        // toggleInfoPopper( schedule, target, cal)
      },
      clickDayname: function (e) {
        var dayClick = new Date(e.date);
        dayClick.setDate(dayClick.getDate() + 1);
        if (cal.getViewName() === "week") {
          cal.setDate(dayClick);
          cal.changeView("day", true);
        }
      },
    });
  }
  getInfo(cal, regionId, ownerType);
  console.log( "listenersCreated A? " + listenersCreated );
  if ( !listenersCreated )
  {
     //set up eventListeners for calendar
     $(".move-prev").click(function () {
       moveToNextOrPrevRange(-1, cal);
     });
     $(".move-next").click(function () {
       moveToNextOrPrevRange(1, cal);
     });
     $(".move-today").click(function () {
       onClickTodayBtn(cal);
     });
     $(".daily").click(function () {
       changeToDaily(cal);
     });
     $(".weekly").click(function () {
       changeToWeekly(cal);
     });
     $(".monthly").click(function () {
       changeToMonthly(cal);
     });
   console.warn( "creating listeners" );
     $(".new-schedule-btn").click(function () {
       createNewSchedulePopup(cal, regionId, ownerType);
     });
     $("#btn-cal-gen").click(function () {
       toggleCalGenPopper(cal, regionId, ownerType);
     });
  $("#submit-new-schedule").click(function (e) {
    e.preventDefault();
    submitNewSchedule(cal, regionId, ownerType);
  });
     listenersCreated = true;
     console.log( "listenersCreated B? " + listenersCreated );
  }
  if (subscriberId) {
    checkIfRsvp(subscriberId);
  }
};

/** CALENDAR DATA FUNCS **/

const getWindowLoc = () => {
  var loc = window.location.href.slice(0, 5);
  var url;
  if (loc === "http:") {
    url = "http://local.wridz.com/cis/JWMBOS";
  } else {
    url = "/cis/JWMBOS";
  }
  return url;
};

const getInfo = (cal, regionId, ownerType) => {
  var data = {
    sessionId: "$system$",
    dataObj: "eventList",
    identifier: "getSched",
    command: "GetSchedules",
    ownerType: ownerType,
    ownerId: regionId,
    logLevel: "Debug",
    timeStamp: "2020-11-05-10:00:00:00Z",
    appName: "Wridz",
    osName: "iOS",
    appVer: "0.1",
  };

  axios
    .post(getWindowLoc(), data)
    .then(function (response) {
      cal.clear();
      var data = response.data.eventList;
      if (data.length === 0 || !data.length) {
        return createAlert(2, "Uh Oh!", "<h3>This Calendar Has no Events</h3");
      }
      var listedSchedules = 0;
      var firstEvent;

      //set the calendar to the earliest schedule that is equal to or after today
      for (var i = 0; i < data.length; i++) {
        if (new Date(data[i].bgnDateTime) >= new Date()) {
          firstEvent = data[i];
          break;
        }
      }

      for (var i = 0; i < data.length; i++) {
        //filter out old dates
        if (new Date(data[i].bgnDateTime) < new Date()) {
//          console.log( "("+i+") filter out date: " + data[i].bgnDateTime );
          continue;
        }
        //check if event is already full
//        console.log( "("+i+") accept date: " + data[i].bgnDateTime );
        if (data[i].rsvpCount === data[i].maxCount) {
          bgColor = "gray";
        } else {
          bgColor = "#004cff";
          color = "white";
        }
        cal.createSchedules([
          {
            id: data[i].id,
            calendarId: "1",
            title: data[i].name,
            category: "time",
            raw: {
              maxCount: data[i].maxCount,
              rsvpCount: data[i].rsvpCount,
              ownerType: data[i].ownerType,
              ownerId: data[i].ownerId,
              description: data[i].description,
              location: data[i].location,
            },
            dueDateClass: "",
            start: data[i].bgnDateTime,
            end: data[i].endDateTime,
            bgColor: bgColor,
            color: "white",
            location: data[i].location,
          },
        ]);
        listedSchedules++;
      }
      if (listedSchedules < 1) {
        return createAlert(2, "Uh Oh!", "<h3>This Calendar Has no Events</h3");
      }
      cal.setDate(new Date(firstEvent.bgnDateTime));

      cal.setOptions({week: { hourStart :  8 }}, true);
      cal.setOptions({week: { hourEnd   : 21 }}, true);
      cal.changeView("week", true);

      renderDateRange(cal);
    })
    .catch(function (error) {
      console.log(error);
    });
};

const deleteSchedule = (schedule, cal) => {
  var data = {
    sessionId: "$system$",
    dataObj: "event",
    identifier: "deleteSched",
    command: "DeleteSchedule",
    ownerType: schedule.raw.ownerType,
    ownerId: schedule.raw.ownerId,
    eventId: schedule.id,
    logLevel: "Debug",
    timeStamp: "2020-11-12-10:00:00:00Z",
    appName: "Wridz",
    osName: "iOS",
    appVer: "0.1",
  };

  axios
    .post(getWindowLoc(), data)
    .then(function (response) {
      cal.deleteSchedule(schedule.id, schedule.calendarId, false);
      togglePopperOff();
    })
    .catch(function (error) {
      console.log(error);
    });
};

const updateRsvpCount = (schedule, cal, popper, subscriberId) => {
  var data = {
    sessionId: "$system$",
    dataObj: "event",
    identifier: "updateRsvp",
    command: "EventSignUp",
    ownerType: schedule.raw.ownerType,
    ownerId: schedule.raw.ownerId,
    eventId: schedule.id,
    subscriberId: subscriberId,
    logLevel: "Debug",
    timeStamp: "2020-11-12-10:00:00:00Z",
    appName: "Wridz",
    osName: "iOS",
    appVer: "0.1",
  };

  axios
    .put(getWindowLoc(), data)
    .then(function (response) {
      var rsvpCount = response.data.rsvpCount;
      if (rsvpCount === schedule.raw.maxCount) {
        cal.updateSchedule(schedule.id, schedule.calendarId, {
          raw: {
            maxCount: schedule.raw.maxCount,
            rsvpCount: rsvpCount,
            ownerType: schedule.raw.ownerType,
            ownerId: schedule.raw.ownerId,
            location: schedule.raw.location,
          },
          location: schedule.raw.location,
          bgColor: "grey",
        });
      } else {
        cal.updateSchedule(schedule.id, schedule.calendarId, {
          raw: {
            rsvpCount: rsvpCount,
            maxCount: schedule.raw.maxCount,
            ownerType: schedule.raw.ownerType,
            ownerId: schedule.raw.ownerId,
            location: schedule.raw.location,
          },
          location: schedule.raw.location,
        });
      }
      //confirmation for jerry at wizard
      $("#appt").val(response.data.id);
      togglePopperOff(popper);
      createAlert(
        0,
        "Congrats!",
        "You Have Been signed up for your in person meetup!",
        "YAY"
      );
    })

    .catch(function (error) {
      console.log(error);
    });
};

const updateMaxCount = (schedule, cal, maxAvailable) => {
  var data = {
    sessionId: "$system$",
    dataObj: "event",
    identifier: "updateMaxCount",
    command: "UpdateMaxCount",
    ownerType: schedule.raw.ownerType,
    ownerId: schedule.raw.ownerId,
    eventId: schedule.id,
    maxCount: maxAvailable,
    logLevel: "Debug",
    timeStamp: "2020-11-12-10:00:00:00Z",
    appName: "Wridz",
    osName: "iOS",
    appVer: "0.1",
  };

  axios
    .put(getWindowLoc(), data)
    .then(function (response) {
      var maxCount = response.data.maxCount;
      if (schedule.raw.rsvpCount === maxCount) {
        cal.updateSchedule(schedule.id, schedule.calendarId, {
          raw: {
            maxCount: maxCount,
            rsvpCount: schedule.raw.rsvpCount,
            ownerType: schedule.raw.ownerType,
            ownerId: schedule.raw.ownerId,
          },
          bgColor: "grey",
        });
      } else {
        cal.updateSchedule(schedule.id, schedule.calendarId, {
          raw: {
            maxCount: maxCount,
            rsvpCount: schedule.raw.rsvpCount,
            ownerType: schedule.raw.ownerType,
            ownerId: schedule.raw.ownerId,
          },
          bgColor: "#004cff",
          color: "white",
        });
      }
      togglePopperOff();
    })
    .catch(function (error) {
      console.log(error);
    });
};

const updateLocation = (schedule, cal, location) => {
  var data = {
    sessionId: "$system$",
    dataObj: "event",
    identifier: "updateLocation",
    command: "updateLocation",
    ownerType: schedule.raw.ownerType,
    ownerId: schedule.raw.ownerId,
    eventId: schedule.id,
    location: location,
    logLevel: "Debug",
    timeStamp: "2020-11-12-10:00:00:00Z",
    appName: "Wridz",
    osName: "iOS",
    appVer: "0.1",
  };

  axios
    .put(getWindowLoc(), data)
    .then(function (response) {
      var location = response.data.location;
      cal.updateSchedule(schedule.id, schedule.calendarId, {
        location: location,
      });
      togglePopperOff();
    })
    .catch(function (error) {
      console.log(error);
    });
};

const createNewSchedule = (cal, formData, regionId, ownerType) => {

  var data = {
    sessionId: "$system$",
    dataObj: "event",
    identifier: "createNewSchedule",
    command: "CreateSchedule",
    OwnerType: 64,
    OwnerId: regionId,
    maxCount: formData.maxCount,
    location: formData.location,
    BgnTime: formData.startDate,
    EndTime: formData.endDate,
    description: formData.description,
    name: "Driver Sign Up Fair",
    logLevel: "Debug",
    timeStamp: "2020-11-12-10:00:00:00Z",
    appName: "Wridz",
    osName: "iOS",
    appVer: "0.1",
  };

  axios
    .post(getWindowLoc(), data)
    .then(function (response) {
      cal.clear();
      getInfo(cal, regionId, ownerType);
      togglePopperOff();
    })
    .catch(function (error) {
      console.log(error);
    });
};

const getSchedule = (schedule, cal, target, role, subscriberId) => {
  var data = {
    sessionId: "$system$",
    dataObj: "event",
    identifier: "getSchedule",
    command: "GetSchedule",
    ownerType: schedule.raw.ownerType,
    ownerId: schedule.raw.ownerId,
    eventId: schedule.id,
    logLevel: "Debug",
    timeStamp: "2020-11-12-10:00:00:00Z",
    appName: "Wridz",
    osName: "iOS",
    appVer: "0.1",
  };

  axios
    .post(getWindowLoc(), data)
    .then(function (response) {
      if (response.data.maxCount === response.data.rsvpCount && role === true) {
        cal.updateSchedule(
          schedule.id,
          schedule.calendarId,
          {
            raw: {
              maxCount: response.data.maxCount,
              rsvpCount: response.data.rsvpCount,
              ownerType: response.data.ownerType,
              ownerId: response.data.ownerId,
              location: response.data.location,
            },
            bgColor: "grey",
          },
          true
        );
        //setting silent to true on updatesched will fix the popper disconnect
        toggleInfoPopper(schedule, target, cal);
      } else if (
        response.data.maxCount !== response.data.rsvpCount &&
        role === true
      ) {
        cal.updateSchedule(
          schedule.id,
          schedule.calendarId,
          {
            raw: {
              maxCount: response.data.maxCount,
              rsvpCount: response.data.rsvpCount,
              ownerType: response.data.ownerType,
              ownerId: response.data.ownerId,
              location: response.data.location,
            },
            bgColor: "#004cff",
            color: "white",
          },
          true
        );
        //setting silent to true on updatesched will fix the popper disconnect
        toggleInfoPopper(schedule, target, cal);
      } else if (
        response.data.maxCount === response.data.rsvpCount &&
        role === false
      ) {
        cal.updateSchedule(schedule.id, schedule.calendarId, {
          raw: {
            maxCount: response.data.maxCount,
            rsvpCount: response.data.rsvpCount,
            ownerType: response.data.ownerType,
            ownerId: response.data.ownerId,
            location: response.data.location,
          },
          bgColor: "grey",
        });
        alert("This Block Is Full");
      } else {
        cal.updateSchedule(
          schedule.id,
          schedule.calendarId,
          {
            raw: {
              maxCount: response.data.maxCount,
              rsvpCount: response.data.rsvpCount,
              ownerType: response.data.ownerType,
              ownerId: response.data.ownerId,
              location: response.data.location,
            },
            bgColor: "#004cff",
            color: "white",
          },
          true
        );
        //setting silent to true on updatesched will fix the popper disconnect
        togglePopperTimeSlot(schedule, cal, target, subscriberId);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

const updateLocAndMax = (schedule, cal, location, maxCount) => {
  var data = {
    sessionId: "$system$",
    dataObj: "event",
    identifier: "updateLocAndMax",
    command: "updateLocAndMax",
    ownerType: schedule.raw.ownerType,
    ownerId: schedule.raw.ownerId,
    eventId: schedule.id,
    location: location,
    maxCount: maxCount,
    logLevel: "Debug",
    timeStamp: "2020-11-12-10:00:00:00Z",
    appName: "Wridz",
    osName: "iOS",
    appVer: "0.1",
  };

  axios
    .post(getWindowLoc(), data)
    .then(function (response) {
      cal.updateSchedule(schedule.id, schedule.calendarId, {
        location: location,
        raw: {
          maxCount: maxCount,
          rsvpCount: schedule.raw.maxCount,
          ownerType: schedule.raw.ownerType,
          ownerId: schedule.raw.ownerId,
        },
      });
      togglePopperOff();
    })
    .catch(function (error) {
      console.log(error);
    });
};

const checkIfRsvp = (subscriberId) => {
  const data = {
    sessionId: "$system$",
    dataObj: "event",
    command: "checkIfRsvp",
    subscriberId: subscriberId,
    logLevel: "debug",
    timeStampta: new Date(),
    appName: "wridz",
  };

  axios
    .post(getWindowLoc(), data)
    .then((response) => {
      if (response.data.RsvpdEvent !== -1) {
        $("#appt").val(response.data.id);
      } else {
        return;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

/** END CALENDAR DATA FUNCS **/

/** START ACCESSIBILITY FUNCS ***/
const renderDateRange = (cal) => {
  var startRange = cal.getDateRangeStart()._date.toString().substr(0, 11);
  var endRange = cal.getDateRangeEnd()._date.toString().substr(0, 11);

  document.getElementById("renderRange").innerHTML =
    startRange + " - " + endRange;
};

const onClickTodayBtn = (cal) => {
  cal.today();
  changeToDaily(cal);
};

const changeToDaily = (cal) => {
  cal.changeView("day", true);
  renderDateRange(cal);
};

const changeToWeekly = (cal) => {
  cal.changeView("week", true);
  renderDateRange(cal);
};

const changeToMonthly = (cal) => {
  cal.changeView("month", true);
  renderDateRange(cal);
};

const moveToNextOrPrevRange = (val, cal) => {
  if (val === -1) {
    cal.prev();
  } else if (val === 1) {
    cal.next();
  }
  renderDateRange(cal);
};

/** END ACCESSIBILITY **/

/** POPPER FUNCTIONS **/

const togglePopperTimeSlot = (schedule, cal, target, subscriberId) => {
  var popLeft = $(".TimeSlotPopper");

  var htmlString = `
  <h3>Appointment Scheduled</h3>
  <p>You have selected the following time slot:</p>
  <table style="width:100%">
     <tr class="popper-row">
       <td style="font-weight:bold">Start</td>
       <td class="popper-data">${getDate(schedule.start._date)}</td>
     </tr>
     <tr class="popper-row">
       <td style="font-weight:bold">End</td>
       <td class="popper-data">${getDate(schedule.end._date)}</td>
     <tr class="popper-row">
       <td style="font-weight:bold">Location</td>
       <td class="popper-data">${schedule.location}</td>
     </tr>
  </table>
     <ul class="mt-3">
        <li>Your onboarding interview will typically last around 10 minutes.</li>
        <li>Several drivers will have appointments in this same time slot.</li>
        <li>We encourage you to arrive early in your timeslot period.</li>
     </li>
     <div style="font-weight:bold" class="mt-3">
        Press the "Confirm" button below to accept your time slot.
     </div>
     <div style="font-weight:bold" class="mt-3">
        After selection you will receive an email confirming your time.
     </div>

  <div class="row mt-3">
     <div class="col-lg-3">
     </div>
     <div class="col-lg-4">
        <button class='btn btn-cal mb-3 modal-submit'>
           Confirm
        </button>
     </div>
     <div class="col-lg-4">
        <button class='btn btn-cal mb-3 modal-close'>
           Close
        </button>
     </div>
  </div>
  `;

  $(".popper-contents").html(htmlString);
  popLeft.attr("activePopper", true);
  popLeft.show();

  var reference = $(".popper-host");

  var popper = new Popper(target, popLeft, {
    placement: "left",
  });

  $(".modal-submit").click(function (e) {
    e.preventDefault();
    submitRsvpPopper(schedule, cal, popLeft, subscriberId);
  });
  $(".modal-close").click(function (e) {
    e.preventDefault();
    togglePopperOff(popLeft);
  });
};

const submitRsvpPopper = (schedule, cal, popper, subscriberId) => {
  updateRsvpCount(schedule, cal, popper, subscriberId);
};

const toggleInfoPopper = (schedule, target, cal) => {
  var popLeft = $(".infoPopper");

  var startTime = moment(schedule.start.getTime()).format(
    "ddd, MMMM Do YYYY, h:mm A"
  );
  var endTime = moment(schedule.end.getTime()).format(
    "ddd, MMMM Do YYYY, h:mm A"
  );

  var htmlString = `
      <div style="text-align:center">
         <h3>${schedule.title}</h3>
         <h4>Signup Timeslot</h4>
      </div>
      <table style="width:100%">
        <tr class="popper-row">
           <td style="font-weight:bold">Start:</td>
           <td class="popper-data">${startTime}</td>
        </tr>
        <tr class="popper-row">
           <td style="font-weight:bold">End:</td>
           <td class="popper-data">${endTime}</td>
        </tr>
        <tr class="popper-row">
           <td style="font-weight:bold">Location:</td>
           <td class="popper-data">${schedule.location}</td>
        </tr>
        <tr class="popper-row">
           <td style="font-weight:bold">Current RSVP:</td>
           <td class="popper-data">${schedule.raw.rsvpCount}</td>
        </tr>
        <tr class="popper-row">
           <td style="font-weight:bold">Max:</td>
           <td class="popper-data">${schedule.raw.maxCount}</td>
        </tr>
        <tr>
      </table>
      <div class="jwmbos-row center mt-3">
         <div class="jwmbos-col-4">
            <button style="width:98%" class='btn btn-cal start-edit'>
               <i class="ti-pencil"></i>
               Edit
            </button>
         </div>
         <div class="jwmbos-col-4">
            <button style="width:98%" class='btn btn-cal modal-delete'>
               <i class="ti-trash"></i>
               Delete
            </button>
         </div>
         <div class="jwmbos-col-4">
            <button style="width:98%" class="btn btn-cal modal-close">
               <i class="ti-close"></i>
               Close
            </button>
         </div>
      </div>
   `;

  $(popLeft).html(htmlString);
  popLeft.show();

  var popper = new Popper(target, popLeft, {
    placement: "left",
  });

  $(".modal-close").click(function (e) {
    e.preventDefault();
    togglePopperOff(popLeft);
  });
  $(".start-edit").click(function () {
    toggleEditPopperOn(schedule, cal, popLeft);
  });
  $(".modal-delete").click(function (e) {
    e.preventDefault();
    toggleDeletePopper(schedule, cal, popLeft);
  });
};

const toggleEditPopperOn = (schedule, cal, popLeft) => {
  var htmlString = `
    <div class="editPopper">
      <div class="card popperCard">
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <span style="font-weight: bold;">ID ${schedule.id}</span>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <span style="font-weight: bold;">${schedule.title}</span>
            </div>
          </div>
          <form>
            <div class="form-row">
              <div class="form-group col-md-10">
                <label for="inputEmail4">Max Attendents</label><br>
                <input type="number" class="form-control-sm" id="maxCount" min="0" max="100" value="${schedule.raw.maxCount}">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-10">
                <label for="rsvpCount">RsvpCount</label><br>
                <input  type="number" class="form-control-sm" id="rsvpCount" readonly min="0" max="100" value="${schedule.raw.rsvpCount}">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-12">
                <label for="location">Location</label><br>
                <input style="width:100%" type="text" class="form-control-sm" id="location" value="${schedule.location}">
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                <button type="button" class="btn btn-cal modal-close">Cancel</button>
              </div>
              <div class="col-md-4">
                <button type="button" class="btn btn-cal editPopperSubmit ml-2">Update</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
    </div>
    </div>
  `;

  popLeft.html(htmlString);
  popLeft.attr("activePopper", true);
  popLeft.show();

  $(".modal-close").click(function (e) {
    e.preventDefault();
    togglePopperOff(popLeft);
  });
  $(".editPopperSubmit").click(function (e) {
    e.preventDefault();
    submitEditPopper(cal, schedule);
  });
  $("#location").change(function () {
    $("#location").attr("value", this.value);
  });
  $("#maxCount").change(function () {
    $("#maxCount").attr("value", this.value);
  });
};

const submitEditPopper = (cal, schedule) => {
  var stringCount = $("#maxCount").attr("value");
  var maxCount = parseInt(stringCount);

  var rsvpString = $("#rsvpCount").attr("value");
  var rsvpCount = parseInt(rsvpString);

  var location = $("#location").attr("value");

  if (
    maxCount !== schedule.raw.maxCount &&
    rsvpCount === schedule.raw.rsvpCount &&
    location === schedule.location
  ) {
    if (maxCount > rsvpCount) {
      updateMaxCount(schedule, cal, maxCount);
    } else {
      alert(
        "Max Count must be greater than or equal to possible slots available"
      );
    }
  } else if (
    maxCount === schedule.raw.maxCount &&
    location !== schedule.location
  ) {
    updateLocation(schedule, cal, location);
  } else if (
    maxCount !== schedule.raw.maxCount &&
    location !== schedule.location
  ) {
    updateLocAndMax(schedule, cal, location, maxCount);
  } else {
    togglePopperOff();
    return;
  }
};

const toggleDeletePopper = (schedule, cal, popLeft) => {
  var htmlString = `<span>Are you sure you want to delete the schedule from <br><span class="time">${schedule.start._date}</span> <br> to <br> <span class="time">${schedule.end._date}</span><br>at <br><span class="time">${schedule.location}</span>?</span><div class="row"><div class="col-md-4"><buton class='btn btn-cal confirm-delete'><i class="ti-trash"></i>&nbsp; Delete</button></div><div class="col-md-4"><button class="btn btn-cal modal-close"><i class="ti-close"></i>&nbsp; Close</button></div></div>`;

  popLeft.html(htmlString);
  popLeft.attr("activePopper", true);
  popLeft.show();

  $(".confirm-delete").click(function () {
    deleteSchedule(schedule, cal);
  });
  $(".modal-close").click(function (e) {
    e.preventDefault();
    togglePopperOff(popLeft);
  });
};

const getMinDateTime = (date) => {
  const mins = date.getMinutes();
  const hour = date.getHours();
  const day = date.getDate();

  if (mins > 0 && mins < 30) {
    date.setMinutes(30);
    return date;
  } else if (hour > 11) {
    date.setDate(day + 1);
    date.setHours(8);
    date.setMinutes(0);
    return date;
  } else if (mins > 30) {
    date.setMinutes(0);
    date.setHours(hour + 1);
    return date;
  } else if (mins === 0 || mins === 30) {
    return date;
  }
};

const getMinStartScheduleTime = (date) => {
  const mins = date.getMinutes();
  const hour = date.getHours();
  const day = date.getDate();

  if (hour > 22) {
    date.setDate(day + 1);
    date.setHours(8);
  }

  if (mins > 0 && mins < 30) {
    date.setMinutes(30);
    return date;
  } else if (mins > 30) {
    date.setMinutes(0);
    date.setHours(hour + 1);
    return date;
  } else if (mins === 0 || mins === 30) {
    return date;
  }
};

const getMaxDateTime = (date) => {
  date.setHours(22);
  date.setMinutes(0);
  return date;
};

function createNewSchedulePopup(cal, regionId, ownerType) {
  var reference = $(".new-schedule-btn");
  var popLeft = $(".createNewSchedulePopper");

  popLeft.attr("activePopper", true);
  popLeft.show();

  var popper = new Popper(reference, popLeft, {
    placement: "bottom-end",
  });

  var start = $("#startDate").datetimepicker({
    dateFormat: "D, M d, yy",
    timeFormat: "h:mm TT",
    stepMinute: 30,
    minDateTime: getMinDateTime(new Date()),
    hourMax: 22,
    hourMin: 8,
  });

  start.change(function () {
    start.attr("value", this.value);
  });

  // value change handlers
  $("#location").change(function () {
    $("#location").attr("value", this.value);
  });
  $("#maxCount").change(function () {
    $("#maxCount").attr("value", this.value);
  });
  $("#eventLength").change(function () {
    $("#eventLength").attr("value", this.value);
  });
  $("#description").change(function () {
    $("#description").attr("value", this.value);
  });

  // submit or toggle off
  $(".modal-close").click(function (e) {
    e.preventDefault();
    togglePopperOff(popLeft);
  });
  // $(".submit-new-schedule").click(function (e) {
  //   e.preventDefault();
  //   submitNewSchedule(cal, regionId, ownerType);
  // });
}

const getDate = (value) => {
  var min = moment(value).format("ddd, MMM D, YYYY h:mm A");
  return min;
};

const getEndDateTime = (date, eventLength) => {
  let endDate;
  let start = new Date(date);

  if (eventLength === "1 Hour") {
    let h = start.getHours();

    endDate = start.setHours(h + 1);
  } else if (eventLength === "30 Minutes") {
    let mins = start.getMinutes();

    if (mins === 30) {
      let h = start.getHours();
      start.setHours(h + 1);
      start.setMinutes(0);
      endDate = start;
    } else {
      start.setMinutes(30);
      endDate = start;
    }
  }
  return moment(endDate).format("ddd, MMM D, YYYY h:mm A").toString();
};

function validateForm(formData) {
  var hadInvlaid = false;

  for (var key in formData) {
    if (key === "maxCount") {
      if (typeof parseInt($(`#${key}`).val()) !== "number") {
        $(`#${key}`).addClass("is-invalid");
        hadInvlaid = true;
      } else if ($("#maxCount").val() === "") {
        $("#maxCount").addClass("is-invalid");
        hadInvlaid = true;
      }
    }
    if (formData[key] == "") {
      $(`#${key}`).addClass("is-invalid");
      hadInvlaid = true;
    }
  }

  if (hadInvlaid === true) {
    createAlert(
      2,
      "Uh Oh!",
      "<h3>Seems there was a problem with the information you entered</h3>"
    );
    return;
  } else if (hadInvlaid === false) {
    return true;
  }
}

function submitNewSchedule(cal, regionId, ownerType) {
  var stringCount = $("#maxCount");
  var maxCount = parseInt(stringCount.attr("value"));

  var location = $("#location").attr("value");

  var startDate = $("#startDate").attr("value");
  var eventLength = $("#eventLength").attr("value");
  if ( typeof eventLength == "undefined") eventLength = "1 Hour";

  var description = $("#description").attr("value");

  var formData = {
    maxCount: maxCount,
    location: location,
    startDate: startDate,
    eventLength: eventLength,
    endDate: getEndDateTime(startDate, eventLength),
    description: description,
  };

  if (validateForm(formData)) {
    createNewSchedule(cal, formData, regionId, ownerType);
  }
}

const toggleCalGenPopper = (cal, regionId, ownerType) => {
  var reference = $("#btn-cal-gen");
  var popLeft = $(".calendarGenPopper");

  popLeft.attr("activePopper", true);
  popLeft.show();

  var popper = new Popper(reference, popLeft, {
    placement: "bottom-end",
  });

  $(".modal-close").click(function () {
    togglePopperOff(popLeft);
  });
};

function togglePopperOff(popper) {
  if (popper === undefined) {
    var popper = $("[activePopper=true]");
    popper.hide();
    popper.attr("activePopper", false);
  } else {
    popper.hide();
  }
}

/** END POPPER FUNCTIONS**/

/** VALIDATE AND SUBMIT CREATOR FORM **/

function OnboardingScheduleCreatorFormValidate(
  aFormId,
  accountId,
  containerTagUid1,
  containerTagUid2,
  tagUid
) {
  var aForm = document.getElementById(aFormId);
  //    console.log( aFormId + " " + aForm );
  errCount = 0; // reset count

  doValidate(aForm, "eventName");
  doValidate(aForm, "frequency");
  // doValidate(aForm, "lunch");
  doValidate(aForm, "startDay");
  doValidate(aForm, "dayAmount");
  doValidate(aForm, "location");
  doValidate(aForm, "eventInfo");
  doValidate(aForm, "maxCount");

  if (errCount > 0) {
    alert("Please correct the " + errCount + " errors.");
    return false;
  }

  var ajaxRequest = getAjaxRequestObject();

  //??????????????? Why commented??  JWM 1/25/22 -----ajaxRequest.onreadystatechange = function() { cardAddResponse( ajaxRequest, containerTagUid1, containerTagUid2, tagUid );} ;
  // JWM add 1/25/22
      ajaxRequest.onreadystatechange = function ()
      {
         document.getElementById("section_refresh" + tagUid).click();
      };


  var serverCall =
    "/projectmanager/jsp/ajax/ajaxGetEventList.jsp" +
    "?command=CreateSchedules" +
    "&eventName=" +
    getElementByName("eventName").value +
    "&identifier=" +
    getElementByName("identifier").value +
    "&frequency=" +
    getElementByName("frequency").value +
    // "&lunch=" +
    // // getElementByName("lunch").value +
    "&startDay=" +
    getElementByName("startDay").value +
    "&dayAmount=" +
    getElementByName("dayAmount").value +
    "&location=" +
    getElementByName("location").value +
    "&description=" +
    getElementByName("eventInfo").value +
    "&ownerType=" +
    getElementByName("ownerType").value +
    "&ownerId=" +
    getElementByName("ownerId").value +
    "&maxCount=" +
    getElementByName("maxCount").value +
    "&objectClassID=203";

  ajaxRequest.open("GET", serverCall, true);
  ajaxRequest.send(null);
  return false;
}

/** END CREATOR FORM **/
