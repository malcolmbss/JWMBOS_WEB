<%@ page contentType="text/html;charset=UTF-8" %>
  <%@ page import="jwm.svcimpl.jsp.URLParamtersToEL" %>
    <% URLParamtersToEL.bindParamsToRequest(request); %>
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8"> 
        <title>${title}</title>

        <link rel="stylesheet" href="${pageContext.request.contextPath}/css/resource-layout.css">

    </head>

    <body>

        <!-- Logo -->
        <div class="logo">
            <a href="/">
                <img src="https://life.family/app/default/assets/addons/default/younger/default-theme/resources/img/logo.svg"
                    alt="LifeFamily">
            </a>
        </div>

        <!-- Header -->
        <div class="header">
            <h1>${title}</h1>
        </div>

        <!-- Main Layout -->
        <div class="layout">

            <div class="left">
                <iframe id="calendarFrame" src="/calendar/jsp/calendar.jsp?title=${title}&calendarName=${calendarName}">
                </iframe>
            </div>

            <div class="divider"></div>

            <div class="right">
                <iframe id="eventFrame" src="/event/jsp/event-details.jsp">
                </iframe>
            </div>

        </div>


        <script src="${pageContext.request.contextPath}/js/resource-layout.js"></script>
    </body>

    </html>