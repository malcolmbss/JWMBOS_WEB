<%@ page contentType="text/html;charset=UTF-8" %>
  <!DOCTYPE html>
  <html>

  <head>
    <title>Southwest Campus LifeMen Calendar</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/app.css">

    <!-- FullCalendar -->
    <link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.js"></script>

    <!-- Flatpickr -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
  </head>

  <body>
    <div style="width:225px">
      <a class="navbar-brand" href="/" data-lang="en"><img
          src="https://life.family/app/default/assets/addons/default/younger/default-theme/resources/img/logo.svg?v=1734170988"
          class="nav-logo" alt="LifeFamily" data-original-alt="5597161637474264" data-lang="en"></a>
    </div>

    <div style="background-color:#1380c1; width:100%; color:white; text-align:center; padding:10px; margin-bottom:20px">
      <h1>Southwest Campus LifeMen</h1>
    </div>


    <div class="container">
      <div class="left" style="border:2px solid #1380c1; padding:5px;">
        <button style="background-color:#1380c1; color:white;" onclick="openInstructions()">
          Click Here
        </button>

        to subscribe to this calendar on your mobile device for future updates
        <div style="margin:5px 0 5px 0; padding:15px; width:100%; text-align:center">
          <span style="padding:5px; background-color:#1380c1; color:white">Southwest Campus LifeMen
            Calendar</span>
        </div>
        <div style="height:100%"id="calendar"></div>
      </div>
      <div class="right">
        <div style="margin:0px 0 20px 0; width:100%; text-align:center">
          <h2 style="padding:5px;background-color:#1380c1; color:white">
            November 20, 2025 6:30-8:00pm Event<br>LifeMen Monthly BBQ</h2>
          <h3>Brendan Steinhauser - The Alliance for Secure AI</h3>
        </div>
        <button style="background-color:#1380c1; color:white;">
          Edit Event Details
        </button> <span style="font-size:10pt"><i>(this button will appear based on user roles)</i></span>
        <h4>Summary</h4>
        In this talk, Brendan Steinhauser, the Executive Director of The Alliance for Secure AI, discusses the
        importance of responsible AI development and the potential risks associated with unchecked advancements in...
        <h4>Video</h4>
        <div style="text-align:center; margin:0px 0 20px 0;">

          <iframe style="margin-top:10px" src="https://www.youtube.com/embed/YN4MDKMndtY?si=Fc6AhGSioPgI5cOJ"
            title="LifeMen BBQ Nov 2025" allowfullscreen>
          </iframe>

        </div>

        <h4>Transcript</h4>
        Thanks for having me. Oh, it's our pleasure. I was hoping you wouldn't try to intimidate me that shirt, but
        that's alright. I'm a very intimidating guy....
        <h4>Photos</h4>
        <button style="background-color:#1380c1; color:white;">
          Photo Gallery
        </button>
        <h4>Audio</h4>
        ....
        <h4>Testimonies</h4>
        ....
      </div>



      <!-- Event Modal -->
      <div id="eventModal" class="modal">
        <div class="modal-content">
          <h3>Create LifeFamily Event</h3>
          <div class="container">
            <div class="left" style="border:0 solid #1380c1; padding:5px;">
              <label>Title</label>
              <input id="eventTitle" type="text" />
              <div class="datetime-field">
                <label>Start</label>
                <input style="width:75%" id="eventStart" type="text" />
                <span class="datetime-icon" onclick="startPicker.open()">📅</span>
              </div>
              <div class="datetime-field">
                <label>End</label>
                <input style="width:75%" id="eventEnd" type="text" />
                <span class="datetime-icon" onclick="endPicker.open()">📅</span>
              </div>
              <label>Description</label>
              <input id="eventDescription" type="text" />
              <label>Internal Notes</label>
              <input id="eventInternalNotes" type="text" />



            </div>
            <div class="right" style="border:0 solid #1380c1; padding:5px;">
              <label>Recurring</label>
              <input id="Recurring" type="checkbox" />
              <label>Facilities</label>
              <input id="eventFacilities" type="text" />
              <label>Catering</label>
              <input id="eventCatering" type="text" />
              <label>Production Requirements</label>
              <input id="eventProductionRequirements" type="text" />
              <label>IT Requirements</label>
              <input id="eventITRequirements" type="text" />


            </div>
            <div class="right" style="border:0 solid #1380c1; padding:5px;">
              <label>Attendee Scope</label>
              <input id="AttendeeScope" type="text" />
              <label>Invitation Only</label>
              <input id="eventInvitations" type="checkbox" />
              <label>Maximum Count</label>
              <input id="maxCount" type="text" />



            </div>
          </div>





          <div class="buttons">
            <button type="button" onclick="saveEvent()">Save</button>
            <button type="button" onclick="closeModal()">Cancel</button>
          </div>
        </div>
      </div>

      <script>
        let calendar;
        let startPicker, endPicker;

        document.addEventListener('DOMContentLoaded', function () {
          const calendarEl = document.getElementById('calendar');

          calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'timeGridWeek',
            slotMinTime: '06:00:00',
            slotMaxTime: '22:00:00',
            events: '/calendarmgr/events',
            selectable: true,
            editable: true,
            displayEventTime: true,
            headerToolbar: {
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek'
            },
            eventTimeFormat: {
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short'
            },

            select: function (info) {
              document.getElementById('eventTitle').value = '';
              startPicker.setDate(info.start, true);
              endPicker.setDate(info.end, true);

              openModal();
            }
          });

         
          calendar.render();

          // Flatpickr initialization 
          startPicker = flatpickr('#eventStart', {
            enableTime: true,
            time_24hr: true,
            dateFormat: 'Y-m-d H:i',
            clickOpens: true
          });

          endPicker = flatpickr('#eventEnd', {
            enableTime: true,
            time_24hr: true,
            dateFormat: 'Y-m-d H:i',
            clickOpens: true
          });

        });


        function saveEvent() {
          const title = document.getElementById('eventTitle').value;
          const start = startPicker.selectedDates[0];
          const end = endPicker.selectedDates[0];

          if (!title || !start || !end) {
            alert('All fields are required');
            return;
          }

          fetch('/calendarmgr/createEvent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: title,
              start: start.toISOString(),
              end: end.toISOString()
            })
          }).then(() => {
            calendar.refetchEvents();
            closeModal();
          });
        }
         function openModal() {
            document.getElementById('eventModal').style.display = 'block';
          }

          function closeModal() {
            document.getElementById('eventModal').style.display = 'none';
          }
      </script>

      <script>
        function openInstructions() {
          const maxWidth = 1250;
          const width = Math.min(screen.width, maxWidth);

          const height = 600;  // pick whatever you want

          const left = Math.round((screen.width - width) / 2);
          const top = Math.round((screen.height - height) / 2);

          window.open(
            'instructions.jsp',
            'Subscribe Istructions',
            `width=${width},
     height=${height},
     left=${left},
     top=${top},
     resizable=yes,
     scrollbars=yes`
          );

        }
      </script>

  </body>

  </html>