const calendarEl = document.getElementById('calendar');
const calendarName = calendarEl.dataset.calendarName;

let calendar;
let startPicker, endPicker;
alert(calendarName);
document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');

  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'timeGridWeek',
    slotMinTime: '06:00:00',
    slotMaxTime: '22:00:00',
    events: `/calendar/events?calendarName=${encodeURIComponent(calendarName)}`,
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

  fetch(`/calendar/createEvents?calendarName=${encodeURIComponent(calendarName)}`, {
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

function openInstructions() {
  const maxWidth = 1250;
  const width = Math.min(screen.width, maxWidth);

  const height = 600;  // pick whatever you want

  const left = Math.round((screen.width - width) / 2);
  const top = Math.round((screen.height - height) / 2);

  window.open(
    'subscribe-instructions.jsp',
    'Subscribe Instructions',
    `width=${width},
     height=${height},
     left=${left},
     top=${top},
     resizable=yes,
     scrollbars=yes`
  );

}
