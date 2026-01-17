<%@ page contentType="text/html;charset=UTF-8" %>
  <!DOCTYPE html>
  <%@ page import="jwm.svcimpl.jsp.URLParamtersToEL" %>
    <% URLParamtersToEL.bindParamsToRequest(request); %>

      <html>

      <head>
        <title>${title}</title>
        <link rel="stylesheet" href="${pageContext.request.contextPath}/css/app.css">

        <!-- FullCalendar -->
        <link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.css" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.js"></script>

        <!-- Flatpickr -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
        <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
      </head>

      <body>

        <button style="background-color:#1380c1; color:white;" onclick="openInstructions()">
          Click Here
        </button>

        to subscribe to this calendar on your mobile device for future updates
        <div style="margin:5px 0 5px 0; padding:15px; width:100%; text-align:center">
          <span style="padding:5px; background-color:#1380c1; color:white">${title}</span>
        </div>
        <div style="height:100%" id="calendar">data-calendar-name="${calendarName}"></div>


        <!-- this line MUST follow the id=calendar div tag-->
        <script src="${pageContext.request.contextPath}/js/calendar.js"></script>


      </body>

      </html>