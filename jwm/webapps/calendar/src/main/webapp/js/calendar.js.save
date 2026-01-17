(() => {
  let calendar;

  document.addEventListener('DOMContentLoaded', () => {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) {
      console.error('Calendar element not found');
      return;
    }

    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'timeGridWeek',

      slotMinTime: '06:00:00',
      slotMaxTime: '22:00:00',

      selectable: true,
      editable: false,
      displayEventTime: true,

      events: `${CALENDAR_CONTEXT}/api/events`,

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

      select: handleDateSelection,
      eventClick: handleEventClick
    });

    calendar.render();
  });

  /**
   * Date range selected → open event creation popup
   */
  function handleDateSelection(selectionInfo) {
    openCreateEventPopup(selectionInfo.start, selectionInfo.end);
  }

  /**
   * Optional: click existing event
   */
  function handleEventClick(info) {
    // Hook for later: event details page
    console.log('Event clicked:', info.event.id);
  }

  /**
   * Opens event creation UI (separate WAR)
   */
  function openCreateEventPopup(start, end) {
    const params = new URLSearchParams({
      start: start.toISOString(),
      end: end.toISOString(),
      source: 'calendar'
    });

    const width = 720;
    const height = 650;

    const left = Math.round((screen.width - width) / 2);
    const top = Math.round((screen.height - height) / 2);

    window.open(
      `${EVENT_UI_BASE}/createEvent.jsp?${params.toString()}`,
      'CreateEvent',
      `
        width=${width},
        height=${height},
        left=${left},
        top=${top},
        resizable=yes,
        scrollbars=yes
      `
    );
  }

  /**
   * Listen for messages from event UI WAR
   */
  window.addEventListener('message', event => {
    // SECURITY: verify origin
    if (!ALLOWED_EVENT_UI_ORIGINS.includes(event.origin)) {
      return;
    }

    if (event.data === 'eventCreated') {
      calendar.refetchEvents();
    }
  });

})();
