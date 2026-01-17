<%@ page contentType="text/html;charset=UTF-8" %>
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <title>${title}</title>

        <link rel="stylesheet" href="${pageContext.request.contextPath}/css/resource-layout.css">
    </head>

    <body>
        <div style="width:225px">
            <a class="navbar-brand" href="/" data-lang="en"><img
                    src="https://life.family/app/default/assets/addons/default/younger/default-theme/resources/img/logo.svg?v=1734170988"
                    class="nav-logo" alt="LifeFamily" data-original-alt="5597161637474264" data-lang="en"></a>
        </div>

        <div
            style="background-color:#1380c1; width:100%; color:white; text-align:center; padding:10px; margin-bottom:20px">
            <h1>${title} Title</h1>
        </div>

        <div class="layout">
            <div class="left">
                <iframe id="calendarFrame" src="/calendar/jsp/calendar.jsp?title=${title}">
                </iframe>
            </div>

            <div class="right">
                <iframe id="eventFrame" src="/event/jsp/event-details-placeholder.jsp">
                </iframe>
            </div>
        </div>

        <script src="${pageContext.request.contextPath}/js/calendar-layout.js"></script>

    </body>

    </html>